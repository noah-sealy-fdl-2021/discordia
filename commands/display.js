module.exports.run = async (client, message, args) => {

    mysql = require("mysql");

    let found = 0

    client.loggedIn.forEach(element => {
        if (element == message.author.id) {
            found = 1;
            if (args.length != 0) {
                message.channel.send("Invalid !Display");
                message.channel.send('Please use the commmand - "!Display"');
                message.channel.send('For example, "!Display"');
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
                            let death = "";
                            if (element.alive == 1) {
                                death = "Alive";
                            } else {
                                death = "Dead";
                            }
                            message.channel.send(`Name: ${element.name} | Level: ${element.level} | Remaining Health: ${element.health} | Lifepoints: ${element.lifepoints} | Speed: ${element.speed} | Status: ${death}`);
                        });

                    } else {
                        message.channel.send("Doesn't look like you have any characers yet!");
                        message.channel.send("If you are having issues with character display, please see Admin :)");
                    }
                }); 

            }
        }
    });

    if (found == 0) {
        message.channel.send(`Please log into an account before trying to create a character!`);        
    }

}