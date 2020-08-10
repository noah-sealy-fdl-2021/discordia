module.exports.run = async (client, message, args) => {

    mysql = require("mysql");

    let found = 0

    client.loggedIn.forEach(element => {
        if (element == message.author.id) {
            found = 1;
            if (args.length != 1) {
                message.channel.send("Invalid !Equip");
                message.channel.send('Please use the commmand - "!Equip weapon_name"');
                message.channel.send('For example, "!Equip GreatAxeOfDespair"');
                message.channel.send('Note: the weapon you are trying to equip must already exist in your inventory');
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

                    con.query(`SELECT * FROM discordiadb.weapon WHERE characterId = (SELECT id FROM discordiadb.character WHERE playerId = ${message.author.id} and name = '${client.activeCharacter.get(message.author.id)}') and name = '${args[0]}';`, (err, rows) => {
                        if (err) throw err;
                        let sql;  
                        // insert new user info into player db
                        if (rows.length > 0) {
                            // set character to active
                            sql = `UPDATE discordiadb.character SET weaponId = ${rows[0].id} WHERE playerId = ${message.author.id} and name = '${client.activeCharacter.get(message.author.id)}';`;
                            con.query(sql);
                            message.channel.send(`Weapon equipped! ${rows[0].name} is now your active weapon!`).catch(err);
                        } else {
                            message.channel.send("That weapon does not exist!");
                            message.channel.send("If you are having issues with equiping a weapon, please see Admin :)");
                        }
                    }); 
                } else {
                    message.channel.send(`Please select an active character in order to equip a weapon (!Select)`);
                    message.channel.send("If you are having issues with equiping a weapon, please see Admin :)");
                }
            }
        }
    });

    if (found == 0) {
        message.channel.send(`Please log into an account before trying to create a character!`);        
    }
}