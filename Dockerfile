# Filename: Dockerfile
# Version: 1.0
# Author: Isaac 
# Date: 09/02/2026

# Use the lightweight Alpine-based Nginx image
FROM docker.io/library/nginx:alpine

# Copy local static files into Nginx's default public directory
COPY ./html/index.html /usr/share/nginx/html

# Expose port 8009 to allow web traffic
EXPOSE 8009

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
