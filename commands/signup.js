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
        console.log("Connected to database!");
    });

    if (args.length != 3) {
        message.channel.send("Invalid !SignUp");
        message.channel.send('Please use the commmand - "!SignUp player_name username password"');
        message.channel.send('For example, "!SignUp Noah noah_sealy Password1234"');
        message.channel.send('Note: spaces are not permitted in player_name, username, or password');
        message.channel.send('If issues persist, please see Admin :)');
    } else {
        // this will query the players with the id as the message author, in order to check if that author already has a player created
        con.query(`SELECT * FROM player WHERE id = ${message.author.id};`, (err, rows) => {
            if (err) throw err;
            let sql;  
            // insert new user info into player db
            if (rows.length < 1) {
                sql = `INSERT INTO player (id, name, username, password) VALUES ('${message.author.id}', '${args[0]}', '${args[1]}', '${args[2]}');`;
                con.query(sql);
                message.channel.send(`Sign up successful! Welcome to Discordia, ${args[0]}`).catch(err);
            } else {
                message.channel.send("Seems you've already made an account!");
                message.channel.send("If you aren't sure how to sign in with that account, or would like to edit that account, please see Admin :)");
            }
        }); 
    }
}