const https = require('https');

const options = {
  hostname: 'polar-ip-check.onrender.com',
  port: 443,
  path: '/',
  method: 'GET'
};

const req = https.request(options, (res) => {
  let data = '';

  console.log('Response Code:', res.statusCode);

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response Data:', data);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();