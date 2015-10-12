#!/bin/bash

set -o errexit
set -o nounset

# Checkout the latest version
cd /opt/bsis-frontend
git fetch
git checkout ${1:-master}
git merge --ff-only origin/${1:-master}

# Install dependencies
npm install

# Build the app
grunt

# Copy the assets to the apache directory
sudo mkdir --parents /var/www/html/bsis
sudo cp --recursive dist/* /var/www/html/bsis
