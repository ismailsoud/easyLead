const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

async function scrapeGoogleMaps(searchQuery) {
    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    const results = [];

    try {
        // Navigate to Google Maps
        await page.goto('https://www.google.com/maps', { waitUntil: 'networkidle0' });
        
        // Wait for and type into the search box
        await page.waitForSelector('#searchboxinput', { visible: true });
        await page.type('#searchboxinput', searchQuery);
        await page.keyboard.press('Enter');

        // Wait for results to load
        await page.waitForSelector('div[role="feed"]', { timeout: 10000 });
        
        // Wait a bit for dynamic content
        await page.waitForTimeout(3000);

        // Scroll to load more results
        await autoScroll(page);

        // Extract results
        const businesses = await page.evaluate(() => {
            const items = document.querySelectorAll('div[role="feed"] > div');
            return Array.from(items, item => {
                // Name and Link
                const nameElement = item.querySelector('div.fontHeadlineSmall');
                const linkElement = item.querySelector('a[href^="https://www.google.com/maps/place"]');
                
                // Address
                const addressElement = item.querySelector('[data-tooltip]') || 
                                     item.querySelector('div[role="button"] > div.fontBodyMedium');
                
                // Rating and Reviews
                const ratingElement = item.querySelector('span.fontBodyMedium > span');
                const reviewsElement = item.querySelector('span.fontBodyMedium > span ~ span');
                
                // Type of business
                const typeElement = item.querySelector('div.fontBodyMedium.color-text-secondary');

                // Website and Phone
                const infoElements = Array.from(item.querySelectorAll('div[role="button"][aria-label]'));
                const website = infoElements.find(el => el.ariaLabel?.includes('Website'))?.ariaLabel || '';
                const phone = infoElements.find(el => 
                    el.ariaLabel?.includes('Phone:') || 
                    el.ariaLabel?.match(/\+\d|-|\(\d+\)|\d{3}/)
                )?.ariaLabel || '';

                return {
                    name: nameElement ? nameElement.innerText.trim() : '',
                    address: addressElement ? 
                            addressElement.getAttribute('data-tooltip') || 
                            addressElement.innerText.trim() : '',
                    rating: ratingElement ? ratingElement.innerText.trim() : '',
                    reviews: reviewsElement ? reviewsElement.innerText.trim() : '',
                    type: typeElement ? typeElement.innerText.trim() : '',
                    website: website.replace('Website: ', ''),
                    phone: phone.replace('Phone: ', ''),
                    link: linkElement ? linkElement.href : ''
                };
            }).filter(item => item.name); // Only include items with names
        });

        results.push(...businesses);
    } catch (error) {
        console.error('Scraping error:', error);
        throw error;
    } finally {
        await browser.close();
    }

    return results;
}

// Helper function to auto-scroll
async function autoScroll(page) {
    await page.evaluate(async () => {
        const feed = document.querySelector('div[role="feed"]');
        if (!feed) return;

        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = feed.scrollHeight;
                feed.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight || totalHeight > 3000) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

app.post('/api/scrape', async (req, res) => {
    try {
        const { searchQuery } = req.body;
        if (!searchQuery) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const results = await scrapeGoogleMaps(searchQuery);
        
        // Generate CSV file
        const csvWriter = createCsvWriter({
            path: path.join(__dirname, 'results.csv'),
            header: [
                { id: 'name', title: 'Business Name' },
                { id: 'address', title: 'Address' },
                { id: 'rating', title: 'Rating' },
                { id: 'reviews', title: 'Reviews' },
                { id: 'type', title: 'Business Type' },
                { id: 'website', title: 'Website' },
                { id: 'phone', title: 'Phone' },
                { id: 'link', title: 'Google Maps Link' }
            ]
        });

        await csvWriter.writeRecords(results);

        res.json({
            success: true,
            data: results,
            csvPath: 'results.csv'
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

app.get('/api/download', (req, res) => {
    const filePath = path.join(__dirname, 'results.csv');
    res.download(filePath);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
