FROM nginx:stable-alpine

COPY ./*.conf.template /etc/nginx/templates/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
