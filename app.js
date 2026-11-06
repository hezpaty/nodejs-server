const http = require("node:http");
const { WebSocketServer } = require("ws");

const PORT = Number(process.env.PORT || 8080);

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    return res.end(JSON.stringify({ status: "ok" }));
  }

  res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
  res.end("Node.js service is running.\n");
});

// Safe demo: echoes messages back to the same connected WebSocket client.
// It does not forward traffic to other hosts or act as a proxy.
const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (socket) => {
  socket.send("Connected to the demo WebSocket endpoint.");

  socket.on("message", (message) => {
    socket.send(`Echo: ${message.toString().slice(0, 1000)}`);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`HTTP server listening on port ${PORT}`);
});
