FROM node:20 AS node

WORKDIR /frontend
COPY . .
RUN npm ci
RUN npm run build --prod

FROM nginx:latest
COPY --from=node /frontend/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]
