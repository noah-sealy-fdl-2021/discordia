module.exports.run = async (client, message, args) => {
    console.log(client.loggedIn);
    if (client.loggedIn.includes(message.author.id)) {
        console.log(`We got em! ${message.author.id}`);
    }
}