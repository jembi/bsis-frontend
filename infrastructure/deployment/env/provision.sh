#!/bin/bash

set -o errexit
set -o nounset

sudo apt-get update

# Set up the nodejs package repository
curl --silent --location https://deb.nodesource.com/setup_0.12 | sudo bash -

# Install packages
sudo apt-get install --quiet --assume-yes \
  nodejs \
  git \
  libfontconfig1 \
  apache2

if ! fgrep --silent ".npm-packages" ~/.profile; then
  # Configure the directory for global npm installs
  echo "prefix = ${HOME}/.npm-packages" > ~/.npmrc
  echo 'export PATH="${HOME}/.npm-packages/bin:${PATH}"' >> ~/.profile
  source ~/.profile
fi

# Install grunt and bower
npm install --global bower grunt-cli

if [ -d "/opt/bsis-frontend" ]; then
  # Checkout the latest version
  cd /opt/bsis-frontend
  git fetch
  git checkout ${1:-master}
  git merge --ff-only origin/${1:-master}
else 
  if [ "$(ssh-add -l)" == "The agent has no identities." ]; then
    # Fall back to http
    BSIS_REPOSITORY=https://github.com/jembi/bsis-frontend.git
  else
    # Use ssh
    BSIS_REPOSITORY=git@github.com:jembi/bsis-frontend.git
  fi
  # Clone the repository
  sudo mkdir --parents /opt/bsis-frontend
  sudo chown --recursive $(whoami):$(groups | awk '{print $1;}') /opt/bsis-frontend
  git clone --branch ${1:-master} --no-single-branch --depth=1 ${BSIS_REPOSITORY} /opt/bsis-frontend
  cd /opt/bsis-frontend
fi

# Install dependencies
npm install

# Build the app
grunt

# Copy the assets to the apache directory
sudo mkdir --parents /var/www/html/bsis
sudo cp --recursive dist/* /var/www/html/bsis
