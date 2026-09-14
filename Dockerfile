# Filename: Dockerfile
# Version: 1.0
# Author: Rohith 
# Date: 09/14/2026

# Use the lightweight Alpine-based Nginx image
FROM docker.io/library/nginx:alpine

COPY ./HTML/index.html /usr/share/nginx/html/index.html
COPY ./CSS /usr/share/nginx/html/CSS
COPY ./scripts /usr/share/nginx/html/Scripts

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
