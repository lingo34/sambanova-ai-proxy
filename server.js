const http = require('http');
const https = require('https');

const PORT = 11435;
const TARGET_URL = 'https://fast.snova.ai/api/completion';
// use model override to disregard the model specified in the request and use the model specified here
// for example, you can set it to 'llama3-405b', so that even if the request said it want to use gpt-4o, it will use llama3-405b
const MODEL_OVERRIDE = ''; // Set this to null or an empty string if you don't want to override

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/v1/chat/completions') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const originalPayload = JSON.parse(body);
        
        // Override the model if MODEL_OVERRIDE is set
        if (MODEL_OVERRIDE && MODEL_OVERRIDE.trim() !== '') {
          originalPayload.model = MODEL_OVERRIDE;
        }

        const modifiedPayload = {
          body: {
            ...originalPayload,
            stop: ["<|eot_id|>"]
          },
          env_type: "tp16405b"
        };

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        };

        const proxyReq = https.request(TARGET_URL, options, proxyRes => {
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          proxyRes.pipe(res);
        });

        proxyReq.on('error', error => {
          console.error('Error forwarding request:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        });

        proxyReq.write(JSON.stringify(modifiedPayload));
        proxyReq.end();
      } catch (error) {
        console.error('Error processing request:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Bad Request' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Model override: ${MODEL_OVERRIDE || 'Not set'}`);
});