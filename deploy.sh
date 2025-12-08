cd /opt/myapp

echo Pulling latest images
sudo docker compose -f compose.prod.yaml pull

echo Building and running new containers
sudo docker compose -f compose.prod.yaml up --build -d --force-recreate

echo Cleaning up
sudo docker system prune -af --volumes

echo Great damn shit ngl !