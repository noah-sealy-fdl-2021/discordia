module.exports.run = async (client, message, args) => {
    mysql = require("mysql");

    let found = 0

    client.loggedIn.forEach(element => {
        if (element == message.author.id) {
            found = 1;
            if (args.length != 0) {
                message.channel.send("Invalid !Inventory");
                message.channel.send('Please use the commmand - "!Inventory"');
                message.channel.send('For example, "!Inventory"');
                message.channel.send('If issues persist, please see Admin :)');
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

                    con.query(`SELECT * FROM discordiadb.weapon WHERE characterId = (SELECT id FROM discordiadb.character WHERE playerId = ${message.author.id} and name = '${client.activeCharacter.get(message.author.id)}');`, (err, rows) => {
                        if (err) throw err;
                        let sql;  

                        con.query(`SELECT * FROM discordiadb.weapon WHERE id = (SELECT weaponId FROM discordiadb.character WHERE playerId = ${message.author.id} and name = '${client.activeCharacter.get(message.author.id)}');`, (err, r) => {
                            if (r[0].name != undefined) {
                                message.channel.send(`Active Weapon: ${r[0].name}`).catch(err);
                            } else {
                                message.channel.send(`You do not currently have an active weapon equipped!`);
                            }

                            if (rows.length > 0) {
                                // loop through rows and display each weapon!
                                rows.forEach(element => {
                                    message.channel.send(`Name: ${element.name} | Description: ${element.description} | Hit Dice: ${element.dice} | Modifier: +${element.modifier} | Value: ${element.value} gold coins`);
                                });
    
                            } else {
                                message.channel.send("Doesn't look like you have any weapons!");
                                message.channel.send("If you are having issues with inventory display, please see Admin :)");
                            }
    
                            con.query(`SELECT * FROM discordiadb.inventory WHERE characterId = ${rows[0].characterId}`, (err, r) => {
                                message.channel.send(`You have ${r[0].goldCoins} gold coins!`).catch(err);
                            }); 
                            
                        }); 

                    }); 
                } else {
                    message.channel.send(`Please select an active character in order to view their inventory (!Select)`);
                    message.channel.send("If you are having issues with inventory display, please see Admin :)");
                }
            }
        }
    });

    if (found == 0) {
        message.channel.send(`Please log into an account and select an active character in order to view their inventory!`);        
    }
}