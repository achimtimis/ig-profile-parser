FROM node:16 AS development
ENV NODE_ENV development
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package*.json ./
RUN npm install
# Copy app files
COPY . .

ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

# Expose port
EXPOSE $REACT_NODE_PORT

# Start the app
CMD [ "npm", "start" ]