# Filename: Dockerfile
# Author: Likhitha
# Date: 09/04/2026

# Small, official Nginx image (Alpine = lightweight Linux)
FROM docker.io/library/nginx:alpine

# Copy our website files into Nginx's default serving folder
COPY ./html/index.html /usr/share/nginx/html
COPY ./css/style.css /usr/share/nginx/html
COPY ./scripts/test.js /usr/share/nginx/html/
COPY ./"architecture.png" /usr/share/nginx/html/

# Document that this container uses port 9001
EXPOSE 9001

# Run Nginx in the foreground (required so the container stays alive)
CMD ["nginx", "-g", "daemon off;"]
