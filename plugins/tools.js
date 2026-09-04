const axios = require('axios');

module.exports = [
    {
        command: 'traduire',
        aliases: ['translate'],
        description: 'Traduit un texte en français',
        category: 'tools',
        async execute({ m, args }) {
            const text = args.join(' ');
            if (!text) return m.reply('📌 Utilise : .traduire <texte>');

            try {
                const { data } = await axios.get('https://api.mymemory.translated.net/get', {
                    params: { q: text, langpair: 'auto|fr' },
                });
                const translated = data?.responseData?.translatedText;
                await m.reply(translated ? `🌐 ${translated}` : '❌ Traduction indisponible.');
            } catch (err) {
                await m.reply('❌ Erreur lors de la traduction.');
            }
        },
    },
];