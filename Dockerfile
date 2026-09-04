# Filename: Dockerfile
# Author: Likhitha
# Date: 09/04/2026

# Small, official Nginx image (Alpine = lightweight Linux)
FROM docker.io/library/nginx:alpine

# Copy our website files into Nginx's default serving folder
COPY ./html/index.html /usr/share/nginx/html
COPY ./html/style.css /usr/share/nginx/html

# Document that this container uses port 8001
EXPOSE 8001

# Run Nginx in the foreground (required so the container stays alive)
CMD ["nginx", "-g", "daemon off;"]
