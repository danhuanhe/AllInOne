const http = require("http");
const fs = require("fs");

const server = http.createServer(function(req, resp) {
  fs.readFile(`${__dirname}/${req.url}`, function(error, html) {
    if (error) {
      resp.writeHead(404);
      resp.write("Not Found");
    } else if (req.url === '/icons.svg') {
      resp.writeHead(200, { "Content-Type": "image/svg+xml" });
      resp.write(html);
    } else {
      resp.writeHead(200);
      resp.write(html);
    }

    resp.end();
  });
});
server.listen(5050);

console.log("Server Started listening on 5050");
