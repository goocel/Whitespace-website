FROM nginx:1.27-alpine

# nginx official image renders /etc/nginx/templates/*.template with env vars
# (Railway injects PORT at runtime).
ENV PORT=8080
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

COPY index.html about.html careers.html contact.html engage.html industries.html insights.html services.html favicon.ico icon-192.png icon-512.png apple-touch-icon.png /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY insights /usr/share/nginx/html/insights
COPY practices /usr/share/nginx/html/practices

EXPOSE 8080
