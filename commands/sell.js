module.exports.run = async (client, message, args) => {
    mysql = require("mysql");

    let found = 0
    let weapon_found = 0;

    client.loggedIn.forEach(element => {
        if (element == message.author.id) {
            found = 1;
            if (args.length != 1) {
                message.channel.send("Invalid !Sell");
                message.channel.send('Please use the commmand - "!Sell item_name, where item_name is an existing item in your inventory"');
                message.channel.send('For example, "!Sell PoolNoodle"');
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

                    con.query(`SELECT * FROM discordiadb.character WHERE playerId = '${message.author.id}' and name = '${client.activeCharacter.get(message.author.id)}';`, (err, rows) => {
                        if (err) throw err;
                        // check for weapon in inventory
                        con.query(`SELECT * FROM discordiadb.weapon WHERE characterId = '${rows[0].id}';`, (err, row) => {
                            if (err) throw err;
                            row.forEach(element => {
                                if (element.name == args[0]) {
                                    weapon_found = 1;
                                    // if the weapon is named StarterSword, do not sell it
                                    if (element.name != "StarterSword") {
                                        // if the weapon is equipped, remove the equip
                                        con.query(`UPDATE discordiadb.character SET weaponId = (SELECT id FROM discordiadb.weapon WHERE characterId='${rows[0].id}' and name='StarterSword') WHERE id = '${rows[0].id}';`, (err) => {
                                            if (err) throw err;
                                            // add weapon to the shop
                                            con.query(`INSERT INTO discordiadb.shop (name, description, dice, modifier, value) VALUES ('${element.name}', '${element.description}', ${element.dice}, ${element.modifier}, ${element.value})`, (err) => {
                                                if (err) throw err;
                                                // add weapon.value to inventory
                                                con.query(`SELECT * FROM discordiadb.inventory WHERE characterId = ${rows[0].id};`, (err, ro) => {
                                                    if (err) throw err;
                                                    let gold = ro[0].goldCoins + element.value;
                                                    con.query(`UPDATE discordiadb.inventory SET goldCoins = ${gold} WHERE characterId = '${rows[0].id}';`, (err) => {
                                                        if (err) throw err;
                                                        // remove weapon from inventory
                                                        con.query(`DELETE from discordiadb.weapon WHERE characterId = '${rows[0].id}' and name = '${args[0]}';`, (err) => {
                                                            if (err) throw err;
                                                            message.channel.send(`Transaction complete. You sold ${element.name} for ${element.value} gold coins!`);
                                                        });
                                                    });
                                                });
                                            }); 
                                        });
                                    } else {
                                        message.channel.send(`The shop down not want to buy your StarterSword, trust me, we have enough...`);
                                    }
                                } 
                                if (weapon_found == 0) {
                                    message.channel.send(`Unable to sell ${args[0]}, it was not found in your inventory.`)
                                }
                            });
                        });
                    });

                } else {
                    message.channel.send(`You must select a character in order to sell an item.`);
                }
            }
        }
    });

    if (found == 0) {
        message.channel.send(`Please log into an account and select an active character in order to sell items!`);        
    }
}