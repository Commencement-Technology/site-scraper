import http from 'http';
import { URL } from 'url';

export async function startServer(register) {
  const server = http.createServer(async (req, res) => {
    const route = new URL(req.url, `http://${req.headers.host}/`).pathname;

    if (route === '/metrics') {
      res.setHeader('Content-Type', register.contentType);
      res.end(await register.metrics());
    }

    if (route === '/health/liveness') {
      res.statusCode = 200;
      res.write(JSON.stringify({ currentTime: new Date() }));
      res.end();
    }

    if (route === '/health/readiness') {
      res.statusCode = 204;
      res.write(JSON.stringify({ currentTime: new Date() }));
      res.end();
    }
  });

  server.listen(process.env.PORT);
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${process.env.PORT}`);
}
