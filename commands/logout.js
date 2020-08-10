module.exports.run = async (client, message, args) => {
    let found = 0
    client.loggedIn.forEach(element => {
        if (element == message.author.id) {
            // removes the author id by splicing its position! its position is found with indexOf()
            client.loggedIn.splice(client.loggedIn.indexOf(element), 1);
            found = 1;
            message.channel.send(`Logout successful! Bye for now!`);
        }
    });

    if (found == 0) {
        message.channel.send(`It doesn't seem like you were ever logged in!`);       
    }

}