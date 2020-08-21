module.exports.run = async (client, message, args) => {
    mysql = require("mysql");

    let found = 0

    client.loggedIn.forEach(element => {
        if (element == message.author.id) {
            found = 1;
            if (args.length != 0) {
                message.channel.send("Invalid !Shop");
                message.channel.send('Please use the commmand - "!Shop"');
                message.channel.send('For example, "!Shop"');
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
                        let sql;  

                        if (rows.length > 0) {
                            rows.forEach(element => {
                                message.channel.send(`Name: ${element.name} | Description: ${element.description} | Hit Dice: ${element.dice} | Modifier: +${element.modifier} | Value: $${element.value}`);
                            });

                        } else {
                            message.channel.send("Looks like the shop is empty right now!");
                        }

                    }); 
                } else {
                    message.channel.send(`Please select an active character in order to view the shop (!Select)`);
                }
            }
        }
    });

    if (found == 0) {
        message.channel.send(`Please log into an account and select an active character in order to view the item shop!`);        
    }
}