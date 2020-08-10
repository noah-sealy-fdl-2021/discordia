module.exports.run = async (client, message, args) => {

    mysql = require("mysql");

    let found = 0

    client.loggedIn.forEach(element => {
        if (element == message.author.id) {
            found = 1;
            if (args.length != 1) {
                message.channel.send("Invalid !Select");
                message.channel.send('Please use the commmand - "!Select character_name"');
                message.channel.send('For example, "!Select StrongBelvas"');
                message.channel.send('Note: the character you are trying to select must exist already');
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

                con.query(`SELECT * FROM discordiadb.character WHERE playerId = '${message.author.id}' and name = '${args[0]}';`, (err, rows) => {
                    if (err) throw err;
                    let sql;  
                    // insert new user info into player db
                    if (rows.length > 0) {
                        // set character to active
                        client.activeCharacter.set(rows[0].playerId, rows[0].name);
                        message.channel.send(`Character select sucessful! ${rows[0].name} is now your active character!`).catch(err);
                    } else {
                        message.channel.send("That character does not exist!");
                        message.channel.send("If you are having issues with character selection, please see Admin :)");
                    }
                }); 

            }
        }
    });

    if (found == 0) {
        message.channel.send(`Please log into an account before trying to create a character!`);        
    }
}