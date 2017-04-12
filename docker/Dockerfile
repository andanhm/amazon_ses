FROM node:alpine
MAINTAINER Andan H M <andanhm3@gmail.com>

# Create app directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

ADD src /usr/src

# Install app dependencies
COPY src/package.json /usr/src
RUN npm install

# Bundle app source
COPY . /usr/src

EXPOSE 8080

CMD [ "npm", "start" ]