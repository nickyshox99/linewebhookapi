FROM node:18-alpine

# Install system dependencies
# RUN apk add --no-cache \
#     cairo-dev \
#     cairomm-dev \
#     libjpeg-turbo-dev \
#     pango-dev \
#     pangomm-dev \
#     giflib-dev \
#     python3-dev \
#     make \
#     g++

WORKDIR /linewebhookapi

COPY package.json package-lock.json /linewebhookapi/

RUN npm install

COPY . .

CMD node app.js

EXPOSE ${PORT}
