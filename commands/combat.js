module.exports.run = async (client, message, args) => {

    mysql = require("mysql");

    let found = 0

    client.loggedIn.forEach(element => {
        if (element == message.author.id) {
            found = 1;
            if (args.length != 1) {
                message.channel.send("Invalid !Combat");
                message.channel.send('Please use the commmand - "!Combat character_name life_points"');
                message.channel.send('For example, "!Create StrongBelvas 200"');
                message.channel.send('Note: the character you are challenging must be online, and both characters must have the specified life points to wager them');
                message.channel.send('If issues persist, please see Admin :)');
            } else {
                // cycles through the loggedIn ids, if any ids match up in the enmap to the name, then we know that player is playing that character
                client.loggedIn.forEach(el => {
                    if (client.activeCharacter.get(el) == args[0]) {
                        // players and characters who are involved in combat
                        let accept = 0;
                        let offenderPlayer = message.author.id;
                        let offenderCharacter = client.activeCharacter.get(message.author.id);
                        let defenderPlayer = el;
                        let defenderCharacter = client.activeCharacter.get(el);
                        message.channel.send(`${defenderCharacter}! ${offenderCharacter} of the mighty house ${message.author.username} challenges you to one on one combat!`);
                        message.channel.send(`${defenderCharacter}, you have 15 seconds to accept this challenge!`);

                        // message collector
                        const filter = m => m.author.id == defenderPlayer;
                        const collector = message.channel.createMessageCollector(filter, { time: 15000 });

                        collector.on('collect', m => {
                            if (m.content == 'Accept') {
                                message.channel.send(`${defenderCharacter} has accepted the duel! Letttttttttttt's RUMBLE!!`);
                                accept = 1;
                                collector.stop();
                            } else if (m.content == 'Deny') {
                                message.channel.send(`${defenderCharacter} has denied the challenge! Probably because ${message.author.username} smells bad or something...`);
                                collector.stop();
                            } else {
                                message.channel.send(`${defenderPlayer}, seriously please respond to the challenge!`);
                                message.channel.send('Please respond with "Accept" or "Deny", duh');
                            }
                        });

                        collector.on('end', collected => {
                            console.log(`Collected ${collected.size} items`);
                        });

                        // TO DO: need to await the above so the code below executes on time...
                        console.log(accept);
                        // TODO: this is where the battle will occur!!!!
                        if (accept == 1) {
                            message.channel.send(`The battle happens here!`);
                        }

                    } else {
                        message.channel.send(`Doesn't seem as though ${args[0]} is online at the moment`);
                    }
                });
            }
        }
    });


    if (found == 0) {
        message.channel.send(`Please log into an account before trying to create a character!`);        
    }

}