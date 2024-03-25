import { createServer } from 'http';
import { createWebSocketServer } from './wss';
import { PORT } from './config';

const server = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200);
    res.end('Ok');
    return;
  }

  // Handle other routes with 404
  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
  createWebSocketServer(server);
});
