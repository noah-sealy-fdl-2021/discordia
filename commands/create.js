module.exports.run = async (client, message, args) => {

    mysql = require("mysql");

    let found = 0

    client.loggedIn.forEach(element => {
        if (element == message.author.id) {
            found = 1;
            if (args.length != 1) {
                message.channel.send("Invalid !Create");
                message.channel.send('Please use the commmand - "!Create character_name"');
                message.channel.send('For example, "!Create StrongBelvas"');
                message.channel.send('Note: spaces are not permitted in character_name, and it must be unique');
                message.channel.send('If issues persist, please see Admin :)');
            } else {
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
                        if (rows < 1) {
                            /* save the character! */
                            sql = `INSERT INTO discordiadb.character (playerId, weaponId, abilityId, name, level, health, lifepoints, speed, alive) VALUES ('${message.author.id}', '0', '0', '${args[0]}', 1, 15, 60, 30, 1);`;
                            con.query(sql);
                            // make inventory
                            con.query(`SELECT * FROM discordiadb.character WHERE playerId = '${message.author.id}' and name = '${args[0]}';`, (e, r) => {
                                if (e) throw e;
                                sql = `INSERT INTO discordiadb.inventory (characterId, goldCoins) VALUES ('${r[0].id}', 30);`;
                                con.query(sql);
                                sql = `INSERT INTO discordiadb.weapon (name, description, characterId, dice, modifier, value) VALUES ('StarterSword', 'A dull sword, will have to upgrade soon!', ${r[0].id}, 6, 2, 20);`;
                                con.query(sql);
                            });                         

                            message.channel.send(`Character created! Welcome to Discordia, ${args[0]}`).catch(err);
                        } else {
                            message.channel.send(`Character was not created. Seems as though you already have a character with the name ${args[0]}!`);
                        }
                    }); 

            }
        }
    });

    if (found == 0) {
        message.channel.send(`Please log into an account before trying to create a character!`);        
    }


}