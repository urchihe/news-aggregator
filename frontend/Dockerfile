FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy only package.json and yarn.lock to leverage Docker's caching
COPY package.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install

# Copy the rest of the application code
COPY . .

# Start the application
CMD ["yarn", "start"]

