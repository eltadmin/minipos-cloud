#!/bin/bash

# Install dependencies
npm install

# Create src directories
mkdir -p src/auth/strategies src/auth/dto \
         src/users/dto \
         src/accounts/entities \
         src/cash-registers/entities \
         src/common/entities

# Copy .env.example to .env if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env
fi

# Create dist directory
mkdir -p dist

echo "Setup completed successfully!" 