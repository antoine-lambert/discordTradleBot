const mongoose = require('mongoose');
const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');
require('dotenv').config();

const token = process.env.DISCORD_TOKEN;
const dbPass = process.env.DB_PASS;

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

mongoose.connect('mongodb+srv://Alta:' + dbPass + '@discordtradlebot.zyfqbqr.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const Player = mongoose.model('Player', {
  username: String,
  victories: Number,
  gamesPlayed: Number,
});

client.on('message', async (user, userID, channelID, message, evt) => {
    const prefix = '!tradle';

  // Vérifie si le message commence par le préfixe
  if (message.startsWith(prefix)) {
    try {
        // Récupère tous les joueurs de la base de données
        const players = await Player.find();
  
        // Formate les données des joueurs en un message
        const playersMessage = players.map(player => `${player.username} : ${player.victories} victoires, ${player.gamesPlayed} parties jouées`).join('\n');
  
        // Envoie le message avec la liste des joueurs
        client.sendMessage({
          to: channelID,
          message: `Classement des joueurs :\n${playersMessage}`
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des joueurs depuis la base de données :', error);
      }
  
  }
  if (message.startsWith('#Tradle')) {
    try {
      let nbOfWins = 0;
      let nbOfGamesPlayed = 0;
      let hasWin = false;

      const lines = message.split('\n');
      nbOfGamesPlayed += 1;

      // Recherche le joueur dans la base de données
      const existingPlayer = await Player.findOne({ username: user });

      lines.forEach((line) => {
        if (line.trim().endsWith('🟩')) {
          nbOfWins++;
          hasWin = true;
        }
      });

      if (existingPlayer) {
        existingPlayer.victories += nbOfWins;
        existingPlayer.gamesPlayed += nbOfGamesPlayed;
        await existingPlayer.save();

        if (hasWin) {
          client.sendMessage({
            to: channelID,
            message: `<@${userID}> a gagné ! T'es un crackito de la géo :risicolombo: - Nombre de Victoires : ${existingPlayer.victories}, Nombre de Parties jouées : ${existingPlayer.gamesPlayed}`
          });
        } else {
          client.sendMessage({
            to: channelID,
            message: `<@${userID}> a perdu ! Fallait pas être desco :damn: - Nombre de Victoires : ${existingPlayer.victories}, Nombre de Parties jouées : ${existingPlayer.gamesPlayed}`
          });
        }
      } else {
        const newPlayer = new Player({
          username: user,
          victories: nbOfWins,
          gamesPlayed: nbOfGamesPlayed,
        });

        await newPlayer.save();

        if (hasWin) {
          client.sendMessage({
            to: channelID,
            message: `<@${userID}> a gagné ! Nombre de Victoires: ${newPlayer.victories}, Nombre de Parties jouées : ${newPlayer.gamesPlayed}`
          });
        } else {
          client.sendMessage({
            to: channelID,
            message: `<@${userID}> a perdu ! Tu auras plus de chances la prochaine fois ... Nombre de Victoires : ${newPlayer.victories}, Nombre de Parties jouées : ${newPlayer.gamesPlayed}`
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la base de données :', error);
    }


  }
});
