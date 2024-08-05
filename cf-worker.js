const TARGET_URL = 'https://fast.snova.ai/api/completion';
// use model override to disregard the model specified in the request and use the model specified here
// for example, you can set it to 'llama3-405b', so that even if the request said it want to use gpt-4o, it will use llama3-405b
const MODEL_OVERRIDE = 'llama3-405b'; // Set this to null or an empty string if you don't want to override

export default {
  async fetch(request) {
    if (request.method === 'POST' && request.url.endsWith('/v1/chat/completions')) {
      try {
        const originalPayload = await request.json();

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
          },
          body: JSON.stringify(modifiedPayload)
        };

        const response = await fetch(TARGET_URL, options);

        // Recreate the Response to set the appropriate CORS headers
        const newResponse = new Response(response.body, {
          status: response.status,
          headers: {
            ...Object.fromEntries(response.headers),
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        });

        return newResponse;
      } catch (error) {
        console.error('Error processing request:', error);
        return new Response(JSON.stringify({ error: 'Bad Request' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
    } else {
      return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
  }
};
