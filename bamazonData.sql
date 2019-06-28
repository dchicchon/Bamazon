DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR (255) NULL,
    department_name VARCHAR(255) NULL,
    price INT NULL,
    stock_quantity INT NULL,
    
    PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Jib Matherson", "Crew", 50, 1);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Oola Bing Bong", "Crew", 80, 1);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Phu Yit", "Crew", 70, 1);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Bob Robert", "Crew", 20, 1);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Fuel", "Ship Needs", 5, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Spare Parts", "Ship Needs", 10, 300);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Rations", "Ship Needs", 1, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Wib", "Pet", 1000,1);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Glowing Rock", "Miscellaneous", 150, 2);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("W33 Ion Cannon", "Ship Weapons", 150, 2);







