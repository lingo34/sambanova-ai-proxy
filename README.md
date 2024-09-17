# sambanova-ai-proxy

[中文](https://github.com/lingo34/sambanova-ai-proxy/blob/main/README.cn.md)

❌ (2024.09.17) **This project no longer works**. Sambanova AI changed their UI and now requires user login for the chat interface, and I havn't added the feature to use cookies.

>  ⚠️ All content in this repository is for experimental purposes

>  ⚠️ In using this program, you agree to Sambanova [Terms of Use](https://sambanova.ai/model-demo-tou) and [Privacy Policy](https://sambanova.ai/privacy-policy), which allows them to use anything you send to their server according to these policies. Therefore, you should not use it to process any sensitive information.

sambanova-ai-proxy is a very simple http proxy server that reroutes your OpenAI-compatible chat completion requests to [sambanova](https://sambanova.ai/). Sambanova provides a free-without-login web page to use the llama3.1 405B model, but why not just give us the free API so we can try the models in our favorite apps and chat interface? Well, here it is.

This repository fills the gap between the Sambanova web page and programs that use LLM APIs, allowing us to understand better the services provided by Sambanova.



To run this program, clone the repo and run `server.js` with `node`

~~~sh
node server.js
~~~

This server will default listen to `localhost:11435/v1/api/completion`. The `/v1/api/completion` is the only supported route. 

To use the server in your applications to replace OpenAI API or Ollama API, replace the base_url with `http://localhost:11435/v1/`. It will be a drop-in replacement.



This program also allows you to override the model name received by the server and replace it with the one specified in the server program. This feature is helpful because some programs that use OpenAI API do not allow you to change the model name, which stops us from testing these open-source models. 



To achieve this, you can modify the `MODEL_OVERRIDE` parameter at the top of the `server.js`. If `MODEL_OVERRIDE` contains any value, when proxying the request, the server will replace the original value in the model parameter with the value of `MODEL_OVERRIDE`.


## Run this on Cloudflare Worker

Copy and paste the content of `cf-worker.js` into your cloudflare worker and deploy. The Sambanova AI Proxy Server will be on your cloudflare worker as a serverless endpoint!


## Docker

The docker image for this project is hosted on GitHub Container Registry and automatically build via GitHub action.

docker run
~~~sh
docker run -d\
  --name sambanova-ai-proxy \
  -p 11435:11435 \
  --read-only \
  ghcr.io/lingo34/sambanova-ai-proxy:main
~~~

if you want to enable model override and specified a model, you can pass it as an environment variable.
~~~sh
docker run -d\
  --name sambanova-ai-proxy \
  -p 11435:11435 \
  --read-only \
  -e MODEL_OVERRIDE="llama3-405b" \
  ghcr.io/lingo34/sambanova-ai-proxy:main
~~~

or you can you docker compose: in the project directory, execute:
~~~sh
docker compose up -d
~~~

Here is the docker compose file
~~~yaml
version: '3.8'

services:
  node-server:
    image: ghcr.io/lingo34/sambanova-ai-proxy:main
    container_name: sambanova-ai-proxy
    ports:
      - "11435:11435"
    environment:
      - MODEL_OVERRIDE=""
    read_only: true
    restart: unless-stopped
~~~

or if you want to build the image yourself

~~~sh
docker build -t sambanova-ai-proxy .
~~~
