FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=photoapi

COPY data.sql /docker-entrypoint-initdb.d/
