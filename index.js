//getting dependencies
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

//setting client with intents
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

//getting data from news site
const url = 'https://nos.nl/nieuws';

axios(url)
.then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const titles = [];
    const urls = [];
    const descs = [];

    $('.list-items__title', html).each(function() {
        const title = $(this).text();
        titles.push({
            title
        });
    });

    $('.list-items__item', html).each(function() {
        const url = $(this).find('a').attr('href');
        urls.push({
            url
        });
    });

    $('.list-items__description', html).each(function() {
        const desc = $(this).text();
        descs.push({
            desc
        });
    });
})
.catch(err => console.log(err));


//running bot
const prefix = '!';

client.once('ready', () => {
    console.log('News Bot is online!');
});

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ + /);
    const command = args.shift().toLowerCase();

    if (command == 'news') {
        message.channel.send('not yet implemented');
    }
});

//must be last line
client.login('MTAzNTIwNzIxMjIzMjA4OTcyMQ.GaVwef.hKAbhJfIFeoD0A0bRJWAnKDI1NWNIP6QYJ7hpk');