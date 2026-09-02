# Use the lightweight Alpine-based Nginx image
FROM docker.io/library/nginx:alpine

# Copy local static files into Nginx's default public directory
COPY ./index.html /home/isaac/app/dist/

# Expose port 9009 to allow web traffic
EXPOSE 9009

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
