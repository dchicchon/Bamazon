var sql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var c = require("ansi-colors")

var connection = sql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Lost4815162342',
    database: 'bamazon_db'
})
connection.connect(function (err) {
    if (err) throw err;

    var choices = ['View Products for Sale', 'View Low Inventory', "Add to Inventory", "Add New Product", "Exit"]
    var idList = []
    function menu() {
        inquirer.prompt([
            {
                type: 'list',
                name: 'command',
                message: 'What would you like to do?',
                choices: choices
            }
        ]).then(response => {
            switch (response.command) {
                case choices[0]:
                    console.clear();
                    tableInit();
                    break;
                case choices[1]:
                    console.clear();
                    lowInventory();
                    break;
                case choices[2]:
                    console.clear();
                    addToInventory();
                    break;
                case choices[3]:
                    console.clear
                    addNewProduct();
                    break;
                case choices[4]:
                    console.clear();
                    connection.end();
            }
        })

    }

    function tableInit() {
        console.log("anything?")
        console.log(c.yellow("\n------------------------------------------------------------------"));
        console.log(c.yellow("------------------------PRODUCTS FOR SALE---------------------------"));
        console.log(c.yellow("------------------------------------------------------------------\n"));

        var table = new Table({
            head: ["ID", "ITEM", "TYPE", "PRICE", "QUANTITY"]
            , colWidths: [5, 20, 15, 13, 10]
        })


        // Here we select all from our database and push those values into the table
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;

            for (var i = 0; i < res.length; i++) {
                table.push(
                    [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price + " wibs", res[i].stock_quantity]
                );
            }
            console.log(table.toString());
            menu()
        });

    }

    function lowInventory() {
        console.log(c.yellow("\n------------------------------------------------------------------"));
        console.log(c.yellow("------------------------LOW INVENTORY---------------------------"));
        console.log(c.yellow("------------------------------------------------------------------\n"));
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;

            for (var i = 0; i < res.length; i++) {
                if (res[i].stock_quantity < 5) {
                    if(res[i].product_name.length > 9) {
                        console.log(c.yellow("Item:"),res[i].product_name,c.yellow("\tStock:") ,res[i].stock_quantity)
                    } else {
                        console.log(c.yellow("Item:"),res[i].product_name,c.yellow("\t\tStock:") ,res[i].stock_quantity)

                    }
                }

            }
            console.log("")
            menu();

        })
    }

    function addToInventory() {
        console.log(c.yellow("\n------------------------------------------------------------------"));
        console.log(c.yellow("------------------------ADD TO INVENTORY---------------------------"));
        console.log(c.yellow("------------------------------------------------------------------\n"));
        var table = new Table({
            head: ["ID", "ITEM", "TYPE", "PRICE", "QUANTITY"]
            , colWidths: [5, 20, 15, 13, 10]
        })
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;

            for (var i = 0; i < res.length; i++) {
                idList.push(res[i].item_id)
                table.push(
                    [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price + " wibs", res[i].stock_quantity]
                );
            }

            console.log(table.toString());
            inquirer.prompt([
                {
                    type: 'number',
                    name: 'id',
                    message: 'Please input the ID of the item you would like to resupply.',
                    validate: function checkID(input) {
                        if (idList.includes(input)) {
                            return true
                        }
                        return "That is not a valid input."
                    }
                },
                {
                    type: 'number',
                    name: 'quantity',
                    message: 'How much do we wanna add?',
                    validate: function checkQuant(input) {
                        if(input > 0) {
                            return true
                        }
                        return "That is not a valid input."
                    }
                }
            ]).then(response => {

                var query = `UPDATE products SET stock_quantity = stock_quantity + ${response.quantity}  WHERE item_id = ${response.id}`
                connection.query(query, function (err, res) {
                    console.clear();
                    if (err) throw err;
                    console.log("Stock Updated");
                    menu()
                })

            });
        });

    }

    function addNewProduct() {
        console.log(c.yellow("\n------------------------------------------------------------------"));
        console.log(c.yellow("------------------------ADD NEW PRODUCT---------------------------"));
        console.log(c.yellow("------------------------------------------------------------------\n"));
        inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What product do you wanna add?'
            },
            {
                type: 'input',
                name: 'type',
                message: 'What kind of product is it?'
            },
            {
                type: 'number',
                name: 'price',
                message: 'What should we set the price to?',
                validate: function checkPrice(input) {
                    if (input > 0) {
                        return true
                    }
                    return "That is not a valid input."
                }
            },
            {
                type: 'number',
                name: 'quantity',
                message: 'How many should we have?',
                validate: function checkQuant(input) {
                    if (input > 0) {
                        return true
                    }
                    return "That is not a valid input."
                }
            }
        ]).then(response => {
            var query = `INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?);`

            connection.query(query, [response.name, response.type, response.price, response.quantity], function (err, res) {
                if (err) throw err
                console.log("Item added!");
                setTimeout(menu, 3000)
            })


        })
    };

    menu()
});
