<!DOCTYPE html>
<html>
<head>
    <title>Website Monitor Logger</title>
    <style>
        body { font-family: monospace; max-width: 800px; margin: 50px auto; padding: 20px; }
        textarea { width: 100%; height: 200px; font-family: monospace; }
        .output { width: 100%; height: 200px; background: #f0f0f0; padding: 10px; overflow: auto; white-space: pre-wrap; }
        button { padding: 10px 20px; font-size: 16px; margin: 10px 0; cursor: pointer; }
        input { width: 100%; padding: 8px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>📡 Website Monitor Logger</h1>
    <p>Paste your website HTML below, click Monitor, then copy the output and deploy it.</p>
    
    <label>Your Telegram Bot Token:</label>
    <input type="text" id="botToken" placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz">
    
    <label>Your Telegram Chat ID:</label>
    <input type="text" id="chatId" placeholder="123456789">
    
    <label>Paste your website source code:</label>
    <textarea id="inputCode" placeholder="<html>...your entire website...</html>"></textarea>
    
    <button onclick="monitorWebsite()">🔍 Monitor</button>
    
    <label>Output (copy this to deploy):</label>
    <div id="output" class="output"></div>
    
    <script>
        function monitorWebsite() {
            const originalCode = document.getElementById('inputCode').value;
            const botToken = document.getElementById('botToken').value;
            const chatId = document.getElementById('chatId').value;
            
            if (!originalCode || !botToken || !chatId) {
                alert('Please fill in all fields');
                return;
            }
            
            // Generate unique session ID for this monitoring session
            const sessionId = Date.now().toString();
            
            // The tracking script to inject
            const trackingScript = `
<script>
// Tracking for session: ${sessionId}
const BOT_TOKEN = "${botToken}";
const CHAT_ID = "${chatId}";
const SESSION_ID = "${sessionId}";
const JOIN_TIME = Date.now();

function sendTelegram(message) {
    fetch(\`https://api.telegram.org/bot\${BOT_TOKEN}/sendMessage\`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({chat_id: CHAT_ID, text: message})
    }).catch(e => console.log('Telegram error:', e));
}

// Send join message
const joinDate = new Date(JOIN_TIME);
sendTelegram(\`✅ *VISITOR JOINED*\` +
    \`\\n📅 Time: \${joinDate.toLocaleString()}\` +
    \`\\n🆔 Session: \${SESSION_ID}\` +
    \`\\n🌐 Page: \${window.location.href}\`);

// Track leave with time spent
window.addEventListener('beforeunload', function() {
    const timeSpentMs = Date.now() - JOIN_TIME;
    const seconds = Math.floor(timeSpentMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    let timeString = "";
    if (days > 0) timeString += \`\${days}d \`;
    if (hours % 24 > 0) timeString += \`\${hours % 24}h \`;
    if (minutes % 60 > 0) timeString += \`\${minutes % 60}m \`;
    timeString += \`\${seconds % 60}s\`;
    
    navigator.sendBeacon(\`https://api.telegram.org/bot\${BOT_TOKEN}/sendMessage\`, 
        JSON.stringify({
            chat_id: CHAT_ID,
            text: \`❌ *VISITOR LEFT*\` +
                  \`\\n⏱️ Time spent: \${timeString}\` +
                  \`\\n🆔 Session: \${SESSION_ID}\`
        })
    );
});
</script>
`;
            
            // Inject script before </body> or at the end
            let modifiedCode = originalCode;
            if (modifiedCode.includes('</body>')) {
                modifiedCode = modifiedCode.replace('</body>', trackingScript + '\n</body>');
            } else {
                modifiedCode = modifiedCode + trackingScript;
            }
            
            // Also inject a session ID marker in the HTML (hidden)
            const sessionMarker = `\n<!-- MONITOR_SESSION_${sessionId} -->\n`;
            modifiedCode = sessionMarker + modifiedCode;
            
            document.getElementById('output').innerText = modifiedCode;
        }
    </script>
</body>
</html>