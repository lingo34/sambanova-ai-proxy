# sambanova-ai-proxy

>  ⚠️ All content in this repository is for experimental purposes

>  ⚠️ In using this program, you are agreeing to Sambanova [Terms of Use](https://sambanova.ai/model-demo-tou) and [Privacy Policy](https://sambanova.ai/privacy-policy), which allows them to use anything you send to their server according to these policies. Therefore, you should not use it to process any sensitive information.

sambanova-ai-proxy is a very simple http proxy server that reroutes your OpenAI compatible chat completion requests to [sambanova](https://sambanova.ai/), providing a free-without-login web page to use the llama3.1 405B model. 

This repository fills the gap between the Sambanova web page and programs that use LLM APIs, allowing us to understand better the services provided by Sambanova.



To run this program, simply clone the repo and run `server.js` with `node`.

~~~sh
node server.js
~~~



This program also allows you to override the model name received by the server and replace it with the one specified in the server program. This is because some program that calls OpenAI API do not allow you to change the model name, which stops us from testing these open-source models. 



To achieve this, you can modify the `MODEL_OVERRIDE` parameter at the top of the `server.js`. If `MODEL_OVERRIDE` contains any value, when proxying the request, the server will replace the original value in the model parameter with the value of `MODEL_OVERRIDE`.

