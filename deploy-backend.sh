#!/bin/bash

dotnet publish MiniTaskHub.Api/MiniTaskHub.Api.csproj -c Release -o ./publish
cd ./publish
zip -r ../publish.zip .
cd ..
az webapp deploy --resource-group StudentResourceGroup --name minitaskhub-api --src-path ./publish.zip --type zip
rm -rf ./publish
rm ./publish.zip
