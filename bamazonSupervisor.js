var sql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var c = require("ansi-colors")

var options = ["View Product Sales by Department", "Create New Department", "Exit"]

var connection = sql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Lost4815162342',
    database: 'bamazon_db'
})
connection.connect(function (err) {
    if (err) throw err;
});

function tableInit() {
    console.clear()
    console.log(c.yellow("\n------------------------------------------------------------------"));
    console.log(c.yellow("------------------------TRADE POST 4815---------------------------"));
    console.log(c.yellow("------------------------------------------------------------------\n"));

    var table = new Table({
        head: ["ID", "ITEM", "TYPE", "PRICE", "QUANTITY","PRODUCT SALES"]
        , colWidths: [5, 20, 15, 13, 10, 10]
    })


    // Here we select all from our database and push those values into the table
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price + " wibs", res[i].stock_quantity, res[i].product_sales]
            );
        }
        console.log(table.toString());
        menu()
    });

}

function menu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'command',
            message: "Please Select an action,",
            choices: options
        }
    ]).then(res => {
        switch (res.command) {
            case option[0]:
                productSales();
                break;
            case option[1]:
                newDept();
                break;
            case option[2]:
                connection.end();
                break;
        }
    });
}

function productSales() {

}

function newDept() {

}

tableInit();