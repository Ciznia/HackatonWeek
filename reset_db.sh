
docker stop db_6tm_cont
docker rm db_6tm_cont
docker image rm db_6tm
docker build -t db_6tm .
docker-compose up