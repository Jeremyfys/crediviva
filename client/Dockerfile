# Base image
FROM node:20.16.0-alpine3.19

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

CMD [ "npm", "run", "dev" ]