# Use a lightweight Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the source code to the working directory
COPY . .

# Build the React app
RUN yarn build

# Expose the port that the app will run on
EXPOSE 4173

# Start the app
CMD ["yarn", "preview"]
