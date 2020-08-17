module.exports.run = async (client, message, args) => {
    mysql = require("mysql");
    let found = 0
    client.loggedIn.forEach(async element => {
        if (element == message.author.id) {
            found = 1;
            if (args.length != 1) {
                message.channel.send("Invalid !Delete");
                message.channel.send('Please use the commmand - "!Delete character_name"');
                message.channel.send('For example, "!Delete StrongBelvas"');
            } else {
                message.channel.send(`Are you sure you want to delete ${args[0]}? Delete or Cancel, you have 15 seconds.`);
                let accept = 0;
                // await messages
                const filter = msg => msg.author.id == message.author.id;
                const msgs = await message.channel.awaitMessages(filter, { time: 15000 })                        
                    .then(collected => {
                        if (collected.first().content == "Delete") {
                            accept = 1;
                            message.channel.send(`Deleting ${args[0]}...`);
                        } else if (collected.first().content == "Cancel") {
                            message.channel.send(`Delete cancelled!`);                            
                        }
                    })
                    .catch(collected => {
                        message.channel.send(`No answer after 15 seconds, delete cancelled!`);
                    });

                if (accept == 1) {
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
                    /* TODO: COME BACK AND RANDOMIZE SOME STATS UPON CREATION??? */
                    con.query(`SELECT * FROM discordiadb.character WHERE playerId = '${message.author.id}' and name = '${args[0]}';`, (err, rows) => {
                        if (err) throw err;
                        if (rows.length > 0) {                      
                            // remove active char if it matchs
                            if (client.activeCharacter.get(message.author.id) == args[0]) {
                                client.activeCharacter.delete(message.author.id);
                            }
                            // delete weapon, inventory, then the character from db
                            con.query(`DELETE FROM discordiadb.weapon WHERE characterId = '${rows[0].id}'`, (err) => {
                                if (err) throw err;
                                con.query(`DELETE FROM discordiadb.inventory WHERE characterId = '${rows[0].id}';`, (err) => {
                                    if (err) throw err;
                                    con.query(`DELETE FROM discordiadb.character WHERE id = '${rows[0].id}'`, (err) => {
                                        if (err) throw err;
                                    });
                                });
                            });
                            message.channel.send(`Character deleted!`).catch(err);
                        } else {
                            message.channel.send(`${args[0]} does not exist! Try creating them before deleting them next time...`);
                        }
                    }); 
                }
            }
        }
    });
    if (found == 0) {
        message.channel.send(`Please log into an account before trying to delete a character!`);        
    }
}