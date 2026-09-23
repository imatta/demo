FROM nginx:alpine

COPY html/index.html /usr/share/nginx/html/index.html
COPY css/style.css /usr/share/nginx/html/style.css
COPY scripts/script.js /usr/share/nginx/html/script.js

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
