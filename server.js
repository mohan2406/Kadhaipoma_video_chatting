import https from "https";
import fs from "fs";
import { WebSocketServer } from "ws";

const server = https.createServer({
  key: fs.readFileSync("192.168.1.19+2-key.pem"),
  cert: fs.readFileSync("192.168.1.19+2.pem"),
});

// Create secure WebSocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`New client: ${ip}`);

  ws.on("message", (msg) => {
    console.log(`Received: ${msg}`);
    
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(msg.toString());
      }
    });
  });
});

server.listen(8080, "0.0.0.0", () => {
  console.log("✅ Secure WebSocket (WSS) running at wss://192.168.1.19:8080");
});

