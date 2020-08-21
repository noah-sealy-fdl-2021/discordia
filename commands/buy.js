module.exports.run = async (client, message, args) => {
    mysql = require("mysql");

    let found = 0

    client.loggedIn.forEach(element => {
        if (element == message.author.id) {
            found = 1;
            if (args.length != 1) {
                message.channel.send("Invalid !Buy");
                message.channel.send('Please use the commmand - "!Buy item_name, where item_name is an existing item in the shop"');
                message.channel.send('For example, "!Buy PoolNoodle"');
            } else {
                if (client.activeCharacter.get(message.author.id) != undefined) {
                    // creates a connect to local db and stores it in the con variable
                    var con = mysql.createConnection({
                        host: "localhost",
                        user: "root",
                        password: "@Brit1967",
                        database: "discordiadb"
                    });

                    // run when db is first connected
                    con.connect(err => {
                        if (err) throw err;
                    });

                    con.query(`SELECT * FROM discordiadb.shop;`, (err, rows) => {
                        if (err) throw err;

                        if (rows.length > 0) {
                            rows.forEach(async element => {
                                if (element.name == args[0]) {
                                    message.channel.send(`Are you sure you want to buy ${args[0]} for $${element.value}? Yes or No`);               
                                    // await messages
                                    const filter = msg => msg.author.id == message.author.id;
                                    const msgs = await message.channel.awaitMessages(filter, { time: 15000 })                        
                                        .then(collected => {
                                            if (collected.first().content == "Yes") {
                                                message.channel.send("Transaction processing...");
                                                con.query(`SELECT * FROM discordiadb.character WHERE playerId = '${message.author.id}' and name = '${client.activeCharacter.get(message.author.id)}'`, (err, row) => {
                                                    if (err) throw err;
                                                    if (row.length > 0) {
                                                        con.query(`SELECT * FROM discordiadb.inventory WHERE characterId = '${row[0].id}'`, (err, ro) => {
                                                            if (err) throw err;
                                                                if (ro[0].goldCoins > element.value) {
                                                                    con.query(`INSERT INTO discordiadb.weapon (name, description, characterId, dice, modifier, value) VALUES ('${element.name}', '${element.description}', '${row[0].id}', ${element.dice}, ${element.modifier}, ${element.value});`, (err) => {
                                                                        if (err) throw err;
                                                                        let remaining = ro[0].goldCoins - element.value;
                                                                        con.query(`UPDATE discordiadb.inventory SET goldCoins = ${remaining} WHERE characterId = ${row[0].id};`, (err) =>{
                                                                            if (err) throw err;
                                                                            message.channel.send(`Transaction complete! ${args[0]} can be found in your inventory. You spent $${element.value}, you have $${remaining} remaining.`);
                                                                        });
                                                                    });
                                                                } else {
                                                                    message.channel.send(`Seems as though you lack the funds to buy ${args}`);
                                                                }
                                                            });
                                                    } else {
                                                        message.channel.send(`Please select an active character to buy ${args[0]}.`);
                                                    }
                                                });
                                            } else if (collected.first().content == "No") {
                                                message.channel.send(`You did not buy ${args[0]}`);
                                            }
                                        })
                                        .catch(collected => {
                                            message.channel.send(`No answer after 15 seconds, transaction cancelled!`);
                                        });
                                } else {
                                    message.channel.send(`Unable to find ${args[0]} in the shop!`);
                                }
                            });

                        } else {
                            message.channel.send("Looks like the shop is empty right now!");
                        }

                    }); 
                } else {
                    message.channel.send(`Please select an active character in order to buy from the shop (!Select)`);
                }
            }
        }
    });

    if (found == 0) {
        message.channel.send(`Please log into an account and select an active character in order to buy items!`);        
    }
}