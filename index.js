const http = require('http');
const url = require('url');
const port = 3000;

const requestHandler = (request, response) => {
    console.log(request.url);
    const myUrl = url.parse(request.url);

    const options = {
        host: myUrl.hostname,
        port: myUrl.port,
        path: myUrl.pathname,
        method: request.method,
        headers: request.headers,
    };

    const proxyRequest = http.request(options, (proxyResponse) => {
        response.writeHead(proxyResponse.statusCode, proxyResponse.headers);
        proxyResponse.pipe(response);
    });

    proxyRequest.on("error", (err) => {
        console.log(`Http proxyRequest error: ${err}`);
    });

    request.pipe(proxyRequest);
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened in listen', err)
    }    console.log(`server is listening on ${port}`)
});