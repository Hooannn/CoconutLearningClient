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

# Set environment variables
ENV VITE_API_ENDPOINT ""
ENV VITE_FILE_HOST ""
ENV VITE_SOCKET_ENDPOINT ""
ENV VITE_NODE_ENV ""
ENV VITE_GG_CLIENT_ID ""

# Expose the port that the app will run on
EXPOSE 3000

# Start the app
CMD ["yarn", "preview"]
