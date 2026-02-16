Projektkonzeption Semester 5
Lagermanagementsytsem

How to Run?

1.install docker engine

2.clone repo

3.add .env file  with following context:
-----
VITE_GOOGLE_CLIENT_ID=""
#VITE immer zuerst
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/todos
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=secret

GOOGLE_CLIENT_ID=
JWT_SECRET=VGhpcy1pcy1hLXN1cGVyLXNlY3JldC1rZXktZm9yLUpXVA==
---

3.build backend folder with mvn clean package

4.docker compose up --build

--> open [http://localhost:5173](http://localhost:5173)
