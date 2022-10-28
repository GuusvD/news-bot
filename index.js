//getting dependencies
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

//setting client with intents
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

//defining bot
const prefix = '!';

client.once('ready', () => {
    console.log('News Bot is online!');
});

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ + /);
    const command = args.shift().toLowerCase();

    //bot start command
    if (command == 'start') {
        message.channel.send('News Bot activated...');

        //getting data from news site
        const url = 'https://nos.nl/nieuws';
        const messageUrl = 'https://nos.nl';
        const interval = 1 * 60 * 1000;
        var first;

        setInterval(function() {
            const titles = [];
            const urls = [];
            const descs = [];

            axios(url)
            .then(response => {
                const html = response.data;
                const $ = cheerio.load(html);

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

                //checking if first title from previous run is same as first title from this run
                //if not so, send message
                if (urls[0].url != first) {
                    message.channel.send(
                        '>>> ' + titles[0].title + '\n' + '\n' + descs[0].desc + '\n' + '\n' + '<' + messageUrl + urls[0].url + '>'
                    );
                    message.channel.send('_ _');
                }

                first = urls[0].url;
            })
            .catch(err => console.log(err));
        }, interval);
    //bot stop command
    } else if (command == 'stop') {
        message.channel.send('News Bot deactivated...');
        return;
    }
});

//must be last line
client.login('MTAzNTIwNzIxMjIzMjA4OTcyMQ.GaVwef.hKAbhJfIFeoD0A0bRJWAnKDI1NWNIP6QYJ7hpk');