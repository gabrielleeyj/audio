# audio


Note: To run the production version (served by Nginx), you can build and run the prod stage of your Dockerfile:

```bash
docker build -t frontend --target prod ./frontend
docker run -p 80:80 frontend
```

This will serve the production-ready build on port 80 using Nginx.
