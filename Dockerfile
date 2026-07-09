FROM node:18-alpine
WORKDIR /usr/src/app
RUN npm install express
COPY app.js .
EXPOSE 5000
CMD ["node", "app.js"]
