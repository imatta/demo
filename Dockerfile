# Filename: Dockerfile
# Version: 1.0
# Author: Shirish
# Date: 10/07/2026

# Small, offical nginx image (Alpine = lightweight Linux
FROM docker.io/library/nginx:alpine

# Copy our website files into nginx's default serving folder
COPY ./html/index.html /usr/share/nginx/html
COPY ./html/style.css /usr/share/nginx/html


# Document that this container uses port 8005
EXPOSE 8005

# Run nginx in the foreground (required so the container stays alive)
CMD ["nginx", "-g", "Daemon off;"]
