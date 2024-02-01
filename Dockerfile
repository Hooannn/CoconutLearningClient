# Use a lightweight Node.js image as the base
FROM node:18-alpine

ARG VITE_API_ENDPOINT
ARG VITE_FILE_HOST
ARG VITE_SOCKET_ENDPOINT
ARG VITE_NODE_ENV
ARG VITE_GG_CLIENT_ID

ENV VITE_API_ENDPOINT=$VITE_API_ENDPOINT
ENV VITE_FILE_HOST=$VITE_FILE_HOST
ENV VITE_SOCKET_ENDPOINT=$VITE_SOCKET_ENDPOINT
ENV VITE_NODE_ENV=$VITE_NODE_ENV
ENV VITE_GG_CLIENT_ID=$VITE_GG_CLIENT_ID
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
