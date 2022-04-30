#which image should be pulled
FROM node:16.14.2  

#Working directory inside docker
WORKDIR ./dockerApp     

# Copy and download dependencies
COPY package.json ./

# Copy the source files into the image
COPY ./ ./

# run a command
RUN npm install

#expose a port
EXPOSE 8000

#command to run

CMD ["npm", "start"]
