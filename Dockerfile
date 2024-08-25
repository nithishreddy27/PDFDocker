# Dockerfile

FROM node:18.13.0

# Install system dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-dev make gcc g++ gnupg wget

# Install google-chrome-stable
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# Create a user with name 'app' and group that will be used to run the app
RUN groupadd -r app && useradd -rm -g app -G audio,video app

WORKDIR /home/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of your project files
COPY . .

# Remove the build step if not needed
# RUN yarn build

# Set permissions for the app user
RUN chown -R app:app /home/app

USER app

# Expose the port on which your app runs
EXPOSE 4000

# Command to start the application
CMD ["yarn", "start"]
