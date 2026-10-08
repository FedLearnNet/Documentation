FROM cgr.dev/chainguard/nginx:latest
#FROM nginx:latest

COPY build/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
