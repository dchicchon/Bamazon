var sql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");


inquirer.prompt([
    {
        type: 'number',
        name: 'id',
        message: 'Welcome to the store! Which item would you like to buy?'
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
