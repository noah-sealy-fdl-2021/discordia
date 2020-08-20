module.exports.run = async (client, message, args) => {
    mysql = require("mysql");

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

    if (args.length != 2) {
        message.channel.send("Invalid !LogIn");
        message.channel.send('Please use the commmand - "!LogIn username password"');
        message.channel.send('For example, "!SignUp noah_sealy Password1234"');
        message.channel.send('If issues persist, please see Admin :)');
    } else {
        // this will query the players with the id as the message author, in order to check if that author already has a player created
        con.query(`SELECT * FROM player WHERE id = ${message.author.id};`, (err, rows) => {
            if (err) throw err;
            let sql;  
            // insert new user info into player db
            if (rows.length > 0) {
                // if login matches, add to Client.loggedin?? - will have to store the author id in logged in for easy access to other things + checks!
                // else deny them entry with nice message
                if (rows[0].username === args[0] && rows[0].password === args[1]) {
                    client.loggedIn.push(message.author.id);
                    message.channel.send(`Log in successful! Welcome to Discordia, ${rows[0].name}!`).catch(err);
                } else {
                    message.channel.send(`Log In Failed! Please enter in the correct login information.`);
                }
            } else {
                message.channel.send("Seems you don't have an account!");
                message.channel.send("Please use the !SignUp command to create an account, if there are any issues please see Admin :)");
            }
        }); 
    }

}