const crypto = require('crypto');

const email = 'user@example.com';
const secret = 'member_c2ea619c619e5eb9fa77222d1208314095fdc6963099f6a965d36027fdf1a9c3';
const timestamp = Date.now().toString();
const emailB64 = Buffer.from(email).toString('base64');

const signature = crypto.createHmac('sha256', secret)
  .update(timestamp)
  .update(email.toLowerCase())
  .digest('hex');

console.log(`${emailB64}.${timestamp}.${signature}`);
