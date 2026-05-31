const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const Url = require('./models/Url.js');

// Initialize dependencies
dotenv.config();
const app = express();
connectDB();

// Setup System Middleware
app.use(cors());
app.use(express.json());

// ROUTE 1: Create a shortened URL record
app.post('/api/shorten', async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: 'A destination URL payload is required' });
  }

  // Regex confirmation check to confirm valid URL patterns
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if (!urlRegex.test(longUrl)) {
    return res.status(400).json({ error: 'Malformed or invalid URL string provided' });
  }

  try {
    // Check if the URL string has already been mapped previously
    let urlRecord = await Url.findOne({ longUrl });
    if (urlRecord) {
      return res.json(urlRecord);
    }

    // Dynamic import to support modern cryptographic string dependencies smoothly
    const { nanoid } = await import('nanoid');
    const shortCode = nanoid(6); // Compact, high-collision safety 6-character hash

    urlRecord = new Url({
      longUrl,
      shortCode
    });

    await urlRecord.save();
    return res.status(201).json(urlRecord);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal system runtime exception' });
  }
});

// ROUTE 2: Fetch system metrics array
app.get('/api/links', async (req, res) => {
  try {
    const records = await Url.find().sort({ createdAt: -1 });
    return res.json(records);
  } catch (err) {
    return res.status(500).json({ error: 'Unable to retrieve tracking metrics records' });
  }
});

// ROUTE 3: Wildcard Redirection Engine Interceptor
app.get('/:code', async (req, res) => {
  try {
    const urlRecord = await Url.findOne({ shortCode: req.params.code });
    
    if (!urlRecord) {
      return res.status(404).send('<h1>Error 404: Shortened URL alias not found</h1>');
    }

    // Capture usage analytics increments
    urlRecord.clicks += 1;
    await urlRecord.save();

    // Ensure absolute addressing strings match explicit HTTP schema declarations
    let targetUrl = urlRecord.longUrl;
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `http://${targetUrl}`;
    }

    // Dispatches HTTP 302 Found redirect context directly back to client browsers
    return res.redirect(targetUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).send('System redirect failure event logged');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server routing cleanly on port ${PORT}`));