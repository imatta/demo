# Filename: Dockerfile
# Version: 1.0
# Author: Isaac 
# Date: 09/02/2026

# Use the lightweight Alpine-based Node.js image
FROM docker.io/library/node:22-alpine

WORKDIR /app

# Copy the static assets and the analytics API server
COPY ./html ./html
COPY ./css ./css
COPY ./scripts ./scripts
COPY ./server.js ./server.js

# Keep analytics data on the server side
VOLUME ["/data"]

# Listen on port 80 inside the container; map host port 9009 to it
EXPOSE 80

# Start the web and analytics server
CMD ["node", "server.js"]
