var sql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var Color = require("color")

var connection = sql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Lost4815162342',
    database: 'bamazon_db'
})
connection.connect(function (err) {
    if (err) throw err;
    console.log("connection id",connection.threadId)
});

var table = new Table({
    head: ["ID", "ITEM", "TYPE", "PRICE", "QUANTITY"]
    , colWidths: [10, 20, 20, 10, 10]
})

// Here we select all from our database and push those values into the table
connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    
    for (var i = 0; i < res.length; i++) {
        table.push(
            [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
        );
    }
    console.log(table.toString());
    menu();
});

function menu() {
    var option = ["Yeah sure!", "No thanks", "THIS IS A ROBBERY! HANDS UP!", "Do you happen to have a restroom I could use?"]
    inquirer.prompt([
        {
            type: 'list',
            name: 'command',
            message: `Shop Keeper: `.green + `Welcome to Trade Post 4815 Traveler! We've got all sorts of goods from across this sector. Looking to buy an item?`,
            choices: option
        }
    ]).then(res => {
        switch (res.command) {
            case option[0] :

                break;
            case option[1] :
                console.log ('Shop Keeper: '.green+`Thanks for stopping by traveler! Keep an eye out for the nasty yigNops!!`)
                connection.end()
                break;
            case option[2] :
                break;
            case option[3] :
                break;
        }
    })
    
}




function buyItem() {
    inquirer.prompt([
        {
            type: 'number',
            name: 'id',
            message: "Select an item to purchase using the item ID!"
        },
        {
            type: 'number',
            name: 'quantity',
            message: "How many would you like to buy?"
        }
    ]).then(response => {
        console.log(response.id);
        console.log(response.quantity);
    })
}

