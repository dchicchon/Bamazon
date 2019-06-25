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
});

var shopkeep = c.green("Shop Keeper: ")
var money = 5000;
var total = 0;

function intro() {
    console.log(c.yellow.italic("\nYour ship drifts silently through the abyss of space, the expanse before you filled with an infinite number of stars, planets, and galaxies. Floating close to a nearby asteroid, you spot a battered trade post hitched to it with several metal tethers.\n"))
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Would you like to set course for the trade post?'
        }
    ]).then(response => {
        if (response.confirm === true) {
            console.log(c.yellow.italic("\nYour ship's navigator sets coordinates to bring the ship towards the trade post. The ship reaches 5 km away from the post until a hail from the post arrives on the coms. A cheery looking slug-alien, the assumed trade posts owner, is shown on the viewscreen.\n"))
            tableInit();
        } else {
            console.log("\nYou sail past the trade post and continue drifting toward your wayward destination.\n")
            connection.end();
        }
    })
}
function tableInit() {
    var table = new Table({
        head: ["ID", "ITEM", "TYPE", "PRICE", "QUANTITY"]
        , colWidths: [5, 20, 15, 13, 8]
    })


    // Here we select all from our database and push those values into the table
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price + " vks", res[i].stock_quantity]
            );
        }
        console.log(table.toString());
        menu()
    });

}

function menu() {
    var option = ["Yeah sure!", "No thanks", "THIS IS A ROBBERY! HANDS UP!", "Do you happen to have a restroom I could use?"]
    if (total > 0) {
        option.push('Checkout')
    }
    console.log(c.blueBright(`Total cost:`), total, "vks")
    console.log(c.cyanBright('Current vks: ') + money)
    console.log(shopkeep + `Welcome to Trade Post 4815 Traveler! We've got all sorts of goods from across this sector.\n`);
    inquirer.prompt([
        {
            type: 'list',
            name: 'command',
            message: shopkeep + `Looking to buy an item?\n`,
            choices: option
        }
    ]).then(res => {
        switch (res.command) {
            case option[0]:
                buyItem();
                break;
            case option[1]:
                console.log(shopkeep + `Thanks for stopping by traveler! Keep an eye out for the nasty yigNops!!\n`)
                connection.end()
                break;
            case option[2]:
                console.log("\n" + shopkeep + "RAIDER SCUM!\n");
                console.log(c.bold.yellow.italic("The trader presses an ominous glowing red button on his console and you hear a rumbling inside your ship. Within one second your ship explodes in a fiery blue ball, struck by the cannon from the Trade Post. Better luck next time!\n"))
                connection.end()
                break;
            case option[3]:
                // Going to the bathroom
                break;
            case option[4]:
                checkout();
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
        // To get the items left, you must get your total stock, subtract it by the quantity that you want.
        var query = "SELECT stock_quantity, price, item_id FROM products WHERE item_id = ?"
        connection.query(query, [response.id], function (err, res) {
            if (err) throw err;
            var itemQuantity = res[0].stock_quantity
            var itemID = res[0].item_id
            var newQuantity = itemQuantity - response.quantity
            var cost = res[0].price * response.quantity
            total = total + cost

            if (newQuantity >= 0) {
                if (money > total) {
                    console.log("Great buy!")
                    console.log(`The total of your cart is going to be ${total} vks`)
                    updateStock(newQuantity, itemID);
                } else {
                    console.log(shopkeep, "You don't have enough vks! Don't buy if you can't afford.")
                    buyItem()
                }


            } else {
                console.log(shopkeep, "We don't have that many! Jeez keep it reasonable.");
                buyItem()
            }
        })
    })
}

function checkOut() {

}

function updateStock(quant, id) {

    connection.query(`UPDATE products SET stock_quantity = ${quant} WHERE item_id = ${id}`,
        function (err, res) {
            if (err) throw err;
            tableInit()
        });
}

// This is what starts everything!
// tableInit();
intro()
