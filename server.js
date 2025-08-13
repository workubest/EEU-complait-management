
import express from 'express';
const app = express();

// Enable CORS manually and JSON parsing
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbwB13dJpn1d_3Xin2-FtpdpMNmVvMSpmfdxeijSnGEmRM5mRQxMJK-dy6TXmsR9ExM/exec';

// Handle API requests
app.use('/api', async (req, res) => {
  try {
    console.log(`${req.method} ${req.originalUrl}`);
    console.log('Query:', req.query);
    console.log('Body:', req.body);
    
    // Construct the target URL with query parameters
    const targetUrl = new URL(googleAppsScriptUrl);
    
    // Copy query parameters from the original request
    Object.keys(req.query).forEach(key => {
      targetUrl.searchParams.set(key, req.query[key]);
    });
    
    console.log('Target URL:', targetUrl.toString());
    
    // Prepare fetch options
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    // Add body for POST requests
    if (req.method === 'POST' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }
    
    // Make the request to Google Apps Script
    const response = await fetch(targetUrl.toString(), fetchOptions);
    const data = await response.text();
    
    console.log('Response status:', response.status);
    console.log('Response data:', data.substring(0, 200) + '...');
    
    // Try to parse as JSON, fallback to text
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (e) {
      console.error('JSON parse error:', e.message);
      jsonData = { success: false, error: 'Invalid JSON response', data: data };
    }
    
    res.status(response.status).json(jsonData);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Proxy error: ' + error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
