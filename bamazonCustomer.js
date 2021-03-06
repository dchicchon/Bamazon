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

    var shopkeep = c.green("Shop Keeper: ")
    var money = 5000;
    var total = 0;
    var itemNumList = []
    var quantList = []

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
                console.clear();
                console.log(c.yellow.italic("\nYour ship's navigator sets coordinates to bring the ship towards the trade post. The ship reaches 5 km away from the post until a hail from the post arrives on the coms. A cheery looking slug-alien, the assumed trade posts owner, is shown on the viewscreen.\n"))
                var query = "SELECT * FROM products"
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    var hasStock = false;

                    for (var x = 0; x < res.length; x++) {
                        itemNumList.push(res[x].item_id)
                        quantList.push(res[x].stock_quantity)
                        if (res[x].stock_quantity > 0) {
                            hasStock = true;
                        }
                    }


                    // If the Store has stock for anything, we will return this message
                    if (hasStock) {
                        inquirer.prompt([
                            {
                                type: 'confirm',
                                name: 'confirm',
                                message: `${shopkeep} Hey there traveler! I've got plenty of supplies here to last you from Zeldon 5 to the Abyssal zone. Would you like to trade?`
                            }
                        ]).then(responseTwo => {
                            if (responseTwo.confirm === true) {
                                console.clear();

                                tableInit();
                            }
                            else {
                                console.log(shopkeep, "No worries! Safe Travels.");
                                connection.end();
                            }
                        })
                    } else {
                        inquirer.prompt([
                            {
                                type: 'confirm',
                                name: 'confirm',
                                message: `${shopkeep} Traveler! Thank goodness you're here. We've been robbed! If you have any supplies to sell we'll be forever in your debt.`
                            }
                        ]).then(responseTwo => {
                            if (responseTwo.confirm === true) {
                                console.clear();
                                tableInit();
                            }
                            else {
                                console.log(shopkeep, "Well, thanks anyways. What a jerk.");
                                connection.end();
                            }
                        })
                    }
                })


            } else {
                console.log(c.yellow.italic("\nYou sail past the trade post and continue drifting toward your wayward destination.\n"));
                connection.end();
            }
        })
    }
    function tableInit() {
        console.clear()
        console.log(c.yellow("\n------------------------------------------------------------------"));
        console.log(c.yellow("------------------------TRADE POST 4815---------------------------"));
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

    function menu() {
        var option = ["Yeah sure!", "No thanks", "THIS IS A ROBBERY! HANDS UP!", "I saw that you have a restroom here using the Where 2 p app, could I use it?"]
        if (total > 0) {
            option.push('CHECKOUT')
        }
        console.log(c.blueBright(`Total cost:`), total, "wibs")
        console.log(c.cyanBright('Current wibs: ') + money)
        console.log("\n" + shopkeep + `Welcome to Trade Post 4815 Traveler! We've got all sorts of goods from across this sector.\n`);
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
                    if (total > 0) {
                        console.log(shopkeep, "You can't leave til you pay for your items!")
                        setTimeout(tableInit, 3000)
                    } else {
                        console.log(shopkeep + `Thanks for stopping by traveler! Keep an eye out for the nasty yigUms!!\n`)
                        connection.end()
                    }
                    break;
                case option[2]:
                    console.clear();
                    raid();
                    break;
                case option[3]:
                    // Going to the bathroom
                    console.clear()
                    useBathroom();
                    break;
                case option[4]:
                    checkOut();
                    break;
            }
        })
    }

    function raid() {
        var chance = Math.floor(Math.random() * 2)
        if (chance === 1) {
            query = "UPDATE products SET stock_quantity = 0"
            connection.query(query, function (err, res) {
                if (err) throw err;
                console.log("\n" + shopkeep + "Don't hurt me! Please take everything, it's all counterfeit anyways.\n")
                console.log(c.bold.yellow.italic("\nYou and your crew take the looted items back and continue on your wayward course."))
                connection.end()
            })

        } else {
            console.log("\n" + shopkeep + "RAIDER SCUM!\n");
            console.log(c.bold.yellow.italic("The trader presses an ominous glowing red button on his console and you hear a rumbling inside your ship. Within one second your ship explodes in a fiery blue ball, struck by the cannon from the Trade Post. Better luck next time!\n"))
            connection.end()
        }
    }

    function useBathroom() {
        console.log("\n" + shopkeep + "Uh yeah sure, c'mon in");
        console.log(c.yellow.italic("\nYou enter into the trade post to find a pristine bathroom. After using it, a frangrance entered the air to give it a pleasant smell after your deed.\n"))
        setTimeout(tableInit, 4000)
    }


    function buyItem() {
        inquirer.prompt([
            {
                type: 'number',
                name: 'id',
                message: `\n ${shopkeep} Select an item to purchase using the item ID!\n`,
                validate: function checkID(input) {
                  if (itemNumList.includes(input)) {
                    return true            
                  }

                  return "Please enter a valid id number."
                }
                
            },
            {
                type: 'number',
                name: 'quantity',
                message: `\n ${shopkeep} How many would you like to buy?\n`,
                validate: function checkQuant(input) {
                    if (input) {
                        return true
                    }      
                    return "Please enter a valid number"
                }   
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
                        console.log("\n" + shopkeep, "A great buy!\n")
                        console.log(shopkeep, `The total of your cart is going to be ${total} wibs\n`)
                        updateStock(cost, newQuantity, itemID);
                    } else {
                        console.log(shopkeep, "You don't have enough wibs! Don't buy if you can't afford.\n")
                        buyItem()
                    }

                } else {
                    console.log(shopkeep, "We don't have that many! Jeez keep it reasonable.\n");
                    buyItem()
                }
            })
        })
    }


    function checkOut() {
        console.clear();
        money = money - total
        total = 0
        console.log(shopkeep, "Thank you!\n")
        tableInit();
    }

    function updateStock(sale, quant, id) {

        connection.query(`UPDATE products SET stock_quantity = ${quant} WHERE item_id = ${id}`,
            function (err, res) {
                if (err) throw err;
            });
        connection.query(`UPDATE products SET product_sales = product_sales + ${sale} WHERE item_id = ${id}`, function (err, res) {
            if (err) throw err;
            console.log("product sales updated!")
            setTimeout(tableInit, 3000)
        })
    }

    // This is what starts everything!
    // tableInit();
    intro()
});
