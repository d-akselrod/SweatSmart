#!/bin/bash

cd src/app-ui
if [ -f package.json ]; then
    echo "Running Prettier and ESLint for app-ui..."
    npm run format:fix
fi
cd ../..

cd test/test-ui
if [ -f package.json ]; then
    echo "Running Prettier and ESLint for test-ui..."
    npm run format:fix
fi
cd ../..

cd src/app-service
if [ -f app-service.csproj ]; then
    echo "Running dotnet format for app-service..."
    dotnet format
fi
cd ../..

cd test/test-service
if [ -f test-service.csproj ]; then
    echo "Running dotnet format for test-service..."
    dotnet format
fi
cd ../..

echo "Formatting completed!"