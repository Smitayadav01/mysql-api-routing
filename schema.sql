create table user(
    id int primary key,
    name varchar(50) unique,
    email varchar(100) unique not null,
    password varchar(255) not null
);