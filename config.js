require('dotenv').config();

module.exports = {
    BOT_NAME: process.env.BOT_NAME || 'OWEN XMD V1',
    PORT: process.env.PORT || 3000,
    OWNER_NUMBER: process.env.OWNER_NUMBER || '2250000000000',
    PREFIX: process.env.PREFIX || '.',
    MODE: process.env.MODE || 'public', // public | self
    CHANNEL_LINK: process.env.CHANNEL_LINK || 'https://whatsapp.com/channel/xxxxxxxxxxxxxxxxxx',
    SESSION_ID: process.env.SESSION_ID || '',
    // Chemin local vers l'image à utiliser comme photo de profil au démarrage
    // (ex: ./assets/profile.jpg) — laisse vide pour ne rien changer automatiquement.
    BOT_PP: process.env.BOT_PP || './assets/profile.jpg',
    VERSION: '1.0.0',
};
