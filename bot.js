const dbKey = process.env.DB_PASS
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Alta:"+dbKey+"@discordtradlebot.zyfqbqr.mongodb.net/?retryWrites=true&w=majority";
require('dotenv').config();

var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot

var client = new Discord.Client({
    token: auth.token,
    autorun: true
});
client.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.username + ' - (' + client.id + ')');
});
client.on('message', function (user, userID, channelID, message, evt) {

    // Divise le contenu du message en lignes
    const lines = message.split('\n');
  
    // Compte le nombre de lignes
    const numberOfLines = lines.length;
  
    console.log(`Le message de ${user} a ${numberOfLines} lignes.`);
    // Vérifie si le message contient l'emoji carré vert
    const hasGreenSquare = message.includes('🟩');
  
    if (hasGreenSquare) {
      // Le joueur a réussi
      console.log(user + " a réussi !");
      // Ajoute ici le code pour gérer les scores
    } else {
      // Le joueur a échoué
      console.log(user + " a échoué.");
      // Ajoute ici le code pour gérer les scores en cas d'échec
  
    
    }
});