const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.end('ok');
    return;
  }
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    fs.writeFileSync('orders_dump.json', body);
    res.end('ok');
    process.exit(0);
  });
});
server.listen(9999);
