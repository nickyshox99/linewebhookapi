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

# Copy package files
COPY package.json package-lock.json /linewebhookapi/

# Install dependencies
RUN npm install

# Rebuild canvas package
# RUN npm install canvas --build-from-source

# Copy the rest of the application code
COPY . .

# Set the default command
CMD node app.js

# Expose the application port
EXPOSE ${PORT}
