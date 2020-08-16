module.exports.run = async (client, message, args) => {

    mysql = require("mysql");

    let found = 0
    let char_found = 0;

    client.loggedIn.forEach(element => {
        if (element == message.author.id) {
            found = 1;
            if (args.length != 2) {
                message.channel.send("Invalid !Combat");
                message.channel.send('Please use the commmand - "!Combat character_name life_points"');
                message.channel.send('For example, "!Create StrongBelvas 200"');
                message.channel.send('Note: the character you are challenging must be online, and both characters must have the specified life points to wager them');
                message.channel.send('If issues persist, please see Admin :)');
            } else {
                // cycles through the loggedIn ids, if any ids match up in the enmap to the name, then we know that player is playing that character
                client.loggedIn.forEach(async el => {
                    if (client.activeCharacter.get(el) == args[0]) {
                        char_found = 1;
                        // players and characters who are involved in combat
                        let accept = 0;
                        let offenderPlayer = message.author.id;
                        let offenderCharacter = client.activeCharacter.get(message.author.id);
                        let defenderPlayer = el;
                        let defenderCharacter = client.activeCharacter.get(el);
                        message.channel.send(`${defenderCharacter}! ${offenderCharacter} of the mighty house ${message.author.username} challenges you to one on one combat!`);
                        message.channel.send(`${defenderCharacter}, you have 15 seconds to accept this challenge!`);               

                        // await messages
                        const filter = msg => msg.author.id == defenderPlayer;
                        const msgs = await message.channel.awaitMessages(filter, { time: 15000 })                        
                            .then(collected => {
                                if (collected.first().content == "Accept") {
                                    message.channel.send(`${defenderCharacter} has accepted the duel! Letttttttttttt's RUMBLE!!`);
                                    accept = 1;
                                } else if (collected.first().content == "Deny") {
                                    message.channel.send(`${defenderCharacter} has denied the challenge! Probably because ${message.author.username} smells bad or something...`);
                                }
                            })
                            .catch(collected => {
                                message.channel.send(`No answer after 15 seconds, no fighting for now!`);
                            });

                        battle_end = 0;
                        turn = 0
                        if (accept == 1) {

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

                            // offending player track
                            let off_level = 0;
                            let off_health = 0;
                            let off_weapon = "";
                            let off_dice = 0
                            let off_mod = 0
                            // defending player track
                            let def_level = 0;
                            let def_health = 0;
                            let def_weapon = "";
                            let def_dice = 0
                            let def_mod = 0       

                            con.query(`SELECT * FROM discordiadb.character WHERE playerId = '${offenderPlayer}' and name = '${offenderCharacter}';`, (err, rows) => {
                                if (err) throw err;

                                off_level = rows[0].level;
                                off_health = rows[0].health;     
                                off_lifepoints = rows[0].lifepoints;

                                con.query(`SELECT * FROM discordiadb.weapon WHERE id = '${rows[0].weaponId}' AND characterId = '${rows[0].id}';`, (err, row) => {
                                    if (err) throw err;
    
                                    off_weapon = row[0].name;
                                    off_dice = row[0].dice;
                                    off_mod = row[0].modifier;

                                    con.query(`SELECT * FROM discordiadb.character WHERE playerId = '${defenderPlayer}' and name = '${defenderCharacter}';`, (err, ro) => {
                                        if (err) throw err;
        
                                        def_level = ro[0].level;
                                        def_health = ro[0].health;     
                                        def_lifepoints = ro[0].lifepoints;
        
                                        con.query(`SELECT * FROM discordiadb.weapon WHERE id = '${ro[0].weaponId}' AND characterId = '${ro[0].id}';`, async (e, r) => {
                                            if (err) throw err;
            
                                            def_weapon = r[0].name;
                                            def_dice = r[0].dice;
                                            def_mod = r[0].modifier;

                                            if (off_lifepoints < args[1]) {
                                                battle_end = 1;
                                                message.channel.send(`${offenderCharacter} does not have enough life points to wager!`);
                                            } else {
                                                message.channel.send(`${offenderCharacter} has ${off_health} hp and is level ${off_level}. They fight with a ${off_weapon} that has (rand(1, ${off_dice}) + ${off_mod}) damage!`);
                                                message.channel.send(`${defenderCharacter} has ${def_health} hp and is level ${def_level}. They fight with a ${def_weapon} that has (rand(1, ${def_dice}) + ${def_mod}) damage!`);
                                                message.channel.send(`Let the battle begin!`);
                                            }

                                            while (battle_end == 0) {
                                                if (turn % 2 == 0) {
                                                    message.channel.send(`${offenderCharacter}, it is your turn! Offense! Will you attack or yield?`);

                                                   const filter = msg => msg.author.id == offenderPlayer;
                                                   const msgs = await message.channel.awaitMessages(filter, { time: 15000 })                        
                                                       .then(collected => {
                                                           if (collected.first().content == "Attack") {
                                                                let damage = Math.floor(Math.random() * (((off_dice - 1) + 1) + 1));
                                                                damage = damage + off_mod;
                                                                def_health = def_health - damage;
                                                                //let attack = Math.floor(Math.random() * ((r[0].dice - 1) + 1) + 1);
                                                                message.channel.send(`${offenderCharacter} attacks! They deal ${damage} damage. ${defenderCharacter} has ${def_health} hp left!`);
                                                           } else if (collected.first().content == "Yield") {
                                                               message.channel.send(`${offenderCharacter} has yielded! (chicken noises) The fight ends.`);
                                                           }
                                                       })
                                                       .catch(collected => {
                                                           message.channel.send(`No answer after 15 seconds, you choose to do nothing!`);
                                                       });

                                                } else {
                                                    message.channel.send(`${defenderCharacter}, it is your turn! Defend! Will you attack or yield?`);

                                                   const filter = msg => msg.author.id == defenderPlayer;
                                                   const msgs = await message.channel.awaitMessages(filter, { time: 15000 })                        
                                                       .then(collected => {
                                                           if (collected.first().content == "Attack") {
                                                                let damage = Math.floor(Math.random() * (((def_dice - 1) + 1) + 1));
                                                                damage = damage + def_mod;
                                                                off_health = off_health - damage;
                                                                message.channel.send(`${defenderCharacter} attacks! They deal ${damage} damage. ${offenderCharacter} has ${off_health} hp left!`);
                                                           } else if (collected.first().content == "Yield") {
                                                               message.channel.send(`${defenderCharacter} has yielded! (chicken noises) The fight ends.`);
                                                           }
                                                       })
                                                       .catch(collected => {
                                                           message.channel.send(`No answer after 15 seconds, you choose to do nothing!`);
                                                       });
                                                }
                
                                                // win and lose conditions, db updates for life points (and death check)
                                                if (off_health <= 0) {
                                                    message.channel.send(`The battle has ended! ${defenderCharacter} is victorious, they win ${args[1]} lifepoints!!`);
                                                    battle_end += 1;
                                                    // take away life points from loser
                                                    if ((off_lifepoints - Number(args[1])) > 0) {
                                                        sql = `UPDATE discordiadb.character SET lifepoints = ${off_lifepoints - Number(args[1])} WHERE playerId = '${offenderPlayer}' AND name = '${offenderCharacter}';`;
                                                        con.query(sql, (err) => {
                                                            if (err) throw err;
                                                        });
                                                    } else {
                                                        sql = `UPDATE discordiadb.character SET lifepoints = 0, alive = 0 WHERE playerId = '${offenderPlayer}' AND name = '${offenderCharacter}';`;
                                                        con.query(sql, (err) => {
                                                            if (err) throw err;
                                                        });
                                                        client.activeCharacter.delete(offenderPlayer);
                                                        message.channel.send(`It appears ${offenderCharacter} has died...`);
                                                    }

                                                    // add life points to winner
                                                    sql = `UPDATE discordiadb.character SET lifepoints = ${def_lifepoints + Number(args[1])} WHERE playerId = '${defenderPlayer}' AND name = '${defenderCharacter}';`;
                                                    con.query(sql, (err) => {
                                                        if (err) throw err;
                                                    });
                                                } else if (def_health <= 0) {
                                                    message.channel.send(`The battle has ended! ${offenderCharacter} is victorious, they win ${args[1]} lifepoints!!!!`);
                                                    battle_end += 1;
                                                    // take away life points from loser
                                                    if ((def_lifepoints - Number(args[1])) > 0) {
                                                        sql = `UPDATE discordiadb.character SET lifepoints = ${def_lifepoints - Number(args[1])} WHERE playerId = '${defenderPlayer}' AND name = '${defenderCharacter}';`;
                                                        con.query(sql, (err) => {
                                                            if (err) throw err;
                                                        });
                                                    } else {
                                                        sql = `UPDATE discordiadb.character SET lifepoints = 0, alive = 0 WHERE playerId = '${defenderPlayer}' AND name = '${defenderCharacter}';`;
                                                        con.query(sql, (err) => {
                                                            if (err) throw err;
                                                        });
                                                        client.activeCharacter.delete(defenderPlayer);
                                                        message.channel.send(`It appears ${defenderCharacter} has died...`);
                                                    }
                                                    // add life points to winner
                                                    sql = `UPDATE discordiadb.character SET lifepoints = ${off_lifepoints + Number(args[1])} WHERE playerId = '${offenderPlayer}' AND name = '${offenderCharacter}';`;
                                                    con.query(sql, (err) => {
                                                        if (err) throw err;
                                                    });
                                                } else {
                                                    turn += 1;
                                                }
                                            }

                                        });
                                    });                            
                                });
                            });
                            
                        }

                    } 
                    
                });

                if (char_found == 0) {
                    message.channel.send(`Doesn't seem as though ${args[0]} is online at the moment!`);
                }
            }
        }
    });


    if (found == 0) {
        message.channel.send(`Please log into an account before trying to create a character!`);        
    }

}