const fs = require('fs');
const path = './node_modules/@expo/ws-tunnel/build/index.js';

if (fs.existsSync(path)) {
  let content = fs.readFileSync(path, 'utf8');
  if (content.includes('new s.WebSocket(')) {
    content = content.replace('new s.WebSocket(', 'new (s.WebSocket || s)(');
    fs.writeFileSync(path, content, 'utf8');
    console.log('[StudyPlanner] Successfully patched @expo/ws-tunnel for Node.js compatibility.');
  }
}
