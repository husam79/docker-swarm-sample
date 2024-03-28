# Docker Swarm Sample App
This a simple app to test Docker Swarm features. It consists of three parts: frontend, backend, and a PostgreSQL database.

The frontend displays a simple counter that you can increase or decrease using two buttons. The backend will interact with the frontend and the db. The database is just one table with one row to persist the value of the counter. Another database like MongoDB can be used alternatively, but Postgresql is used here intentionally.

Whenever the app is running it will check for the database existence, and it will generate a new database with one table and one row.

This app could also be used as a skeleton for other sample apps, because it has already basic tasks against a database. 

# Important files
- docker-compose.yml: using this file you can build the whole required containers for this application to work.
- stack-compose.yml: this file is required for creating a docker swarm stack.
