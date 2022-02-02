cp .env.example .env

docker-compose up -d --build
docker-compose exec nodejs npm install
docker-compose down
docker-compose up -d
