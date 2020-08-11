// require discord.js to use it for the discord.js node modules
const Discord = require('discord.js');
// require for commands data structure
const Enmap = require("enmap");
// required for command manager
const fs = require("fs");
// create Discord bot, it's commonly called a client
const client  = new Discord.Client();

var version = '1.0.0';

/* BOT DATA STRUCTURES */
client.commands = new Enmap();
client.loggedIn = new Array();
client.activeCharacter = new Enmap();

/* EVENTS */
// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      // If the file is not a JS file, ignore it (thanks, Apple)
      if (!file.endsWith(".js")) return;
      // Load the event file itself
      const event = require(`./events/${file}`);
      // Get just the event name from the file name
      let eventName = file.split(".")[0];
      // super-secret recipe to call events with all their proper arguments *after* the `client` var.
      // without going into too many details, this means each event will be called with the client argument,
      // followed by its "normal" arguments, like message, member, etc etc.
      // This line is awesome by the way. Just sayin'.
      client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(`./events/${file}`)];
    });
  });

/* COMMANDS */
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  console.log("Loading " + files.length + " commands...");
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    // Load the command file itself
    let props = require(`./commands/${file}`);
    // Get just the command name from the file name
    let commandName = file.split(".")[0];
    console.log(`${commandName} has loaded!`);
    // Here we simply store the whole thing in the command Enmap. We're not running it right now.
    client.commands.set(commandName, props);
  });
});

// main function
client.once('ready', (message) => {
    console.log("Discordia is online!");
});

// log into Bot, must be kept at end of file
client.login('NzQwNjUzODQ2MTE1NjQ3NTU5.XysJpQ.eQ_tIBs39sw4TpvSExaZ44mcp6I');