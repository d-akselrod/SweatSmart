#!/bin/bash

cd src/SweatSmart-UI
if [ -f package.json ]; then
    echo "Running Prettier and ESLint for SweatSmart-UI..."
    npm run format:fix
    npm run lint:fix
fi
cd ../..

cd test/SweatSmart-UI
if [ -f package.json ]; then
    echo "Running Prettier and ESLint for SweatSmart-UI tests..."
    npm run format:fix
    npm run lint:fix
fi
cd ../..

cd src/SweatSmart-Service
if [ -f SweatSmart-Service.csproj ]; then
    echo "Running dotnet format for SweatSmart-Service..."
    dotnet format
fi
cd ../..

cd test/SweatSmart-Service
if [ -f SweatSmart-Service.test.csproj ]; then
    echo "Running dotnet format for SweatSmart-Service tests..."
    dotnet format
fi
cd ../..

echo "Formatting completed!"