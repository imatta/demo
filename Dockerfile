# Filename: Dockerfile
# Version: 1.0
# Author: Isaac 
# Date: 09/02/2026

# Use the lightweight Alpine-based Nginx image
FROM docker.io/library/nginx:alpine

# Copy local static files into Nginx's default public directory
COPY ./html/index.html /usr/share/nginx/html/
COPY ./css/style.css /usr/share/nginx/html/
COPY ./scripts/script.js /usr/share/nginx/html/

# Expose port 9009 to allow web traffic
EXPOSE 9009

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
