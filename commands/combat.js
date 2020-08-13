module.exports.run = async (client, message, args) => {

    mysql = require("mysql");

    let found = 0

    client.loggedIn.forEach(element => {
        if (element == message.author.id) {
            found = 1;
            if (args.length != 1) {
                message.channel.send("Invalid !Combat");
                message.channel.send('Please use the commmand - "!Combat character_name life_points"');
                message.channel.send('For example, "!Create StrongBelvas 200"');
                message.channel.send('Note: the character you are challenging must be online, and both characters must have the specified life points to wager them');
                message.channel.send('If issues persist, please see Admin :)');
            } else {
                // cycles through the loggedIn ids, if any ids match up in the enmap to the name, then we know that player is playing that character
                client.loggedIn.forEach(async el => {
                    if (client.activeCharacter.get(el) == args[0]) {
                        // players and characters who are involved in combat
                        let accept = 0;
                        let offenderPlayer = message.author.id;
                        let offenderCharacter = client.activeCharacter.get(message.author.id);
                        let defenderPlayer = el;
                        let defenderCharacter = client.activeCharacter.get(el);
                        message.channel.send(`${defenderCharacter}! ${offenderCharacter} of the mighty house ${message.author.username} challenges you to one on one combat!`);
                        message.channel.send(`${defenderCharacter}, you have 15 seconds to accept this challenge!`);

/*
                        // message collector                    
                        const filter = m => m.author.id == defenderPlayer;
                        const collector = await message.channel.createMessageCollector(filter, { time: 15000 });

                        collector.on('collect', m => {
                            if (m.content == 'Accept') {
                                message.channel.send(`${defenderCharacter} has accepted the duel! Letttttttttttt's RUMBLE!!`);
                                accept = 1;
                                collector.stop();
                            } else if (m.content == 'Deny') {
                                message.channel.send(`${defenderCharacter} has denied the challenge! Probably because ${message.author.username} smells bad or something...`);
                                collector.stop();
                            } else {
                                message.channel.send(`${defenderPlayer}, seriously please respond to the challenge!`);
                                message.channel.send('Please respond with "Accept" or "Deny", duh');
                            }
                        });

                        collector.on('end', collected => {
                            console.log(`Collected ${collected.size} items`);
                        });
*/                        

                        // await messages
                        const filter = msg => msg.author.id == defenderPlayer;
                        const msgs = await message.channel.awaitMessages(filter, { time: 15000 })                        
                            .then(collected => {
                                if (collected.first().content == "Accept") {
                                    message.channel.send(`${defenderCharacter} has accepted the duel! Letttttttttttt's RUMBLE!!`);
                                    accept = 1;
                                    msgs.stop();
                                } else if (collected.first().content == "Deny") {
                                    message.channel.send(`${defenderCharacter} has denied the challenge! Probably because ${message.author.username} smells bad or something...`);
                                }
                            })
                            .catch(collected => {
                                message.channel.send(`No answer after 15 seconds, no fighting for now!`);
                            });

                        console.log(accept);
                        // TODO: this is where the battle will occur!!!!

                        battle_end = 0;
                        turn = 0
                        if (accept == 1) {
                            // TODO connect db
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

                            message.channel.send(`Let the battle begin!`);
                            while (battle_end == 0) {
                                if (turn % 2 == 0) {
                                    message.channel.send(`${offenderCharacter}, it is your turn!`);

                                    con.query(`SELECT * FROM discordiadb.character WHERE playerId = '${message.author.id}';`, (err, rows) => {
                                        if (err) throw err;
                                        let sql;  
                                        // insert new user info into player db
                                        if (rows.length > 0) {
                                            // loop through rows and display each character!
                                            // set character to active
                                            if (client.activeCharacter.get(message.author.id) != undefined) {
                                                message.channel.send(`Active Character: ${client.activeCharacter.get(message.author.id)}`);
                                            } else {
                                                message.channel.send(`No active character selected!`);
                                            }
                    
                                            rows.forEach(element => {
                                                message.channel.send(`Name: ${element.name} | Level: ${element.level} | Remaining Health: ${element.health} | Lifepoints: ${element.lifepoints} | Speed: ${element.speed}`);
                                            });
                    
                                        } else {
                                            message.channel.send("Doesn't look like you have any characers yet!");
                                            message.channel.send("If you are having issues with character display, please see Admin :)");
                                        }
                                    }); 
                                    /*
                                        TODO
                                            1. Combat Options -> messageAwait
                                            2. DB query + update for offender
                                    */
                                } else {
                                    message.channel.send(`${defenderCharacter}, it is your turn!`);
                                    /*
                                        TODO
                                            1. Combat Options -> messageAwait
                                            2. DB query + update for defender
                                    */
                                }

                                // temporary stop case...  
                                if (turn == 5) {
                                    battle_end += 1;
                                }

                                turn += 1;
                            }
                        }

                    } else {
                        message.channel.send(`Doesn't seem as though ${args[0]} is online at the moment`);
                    }
                });
            }
        }
    });


    if (found == 0) {
        message.channel.send(`Please log into an account before trying to create a character!`);        
    }

}