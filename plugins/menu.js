module.exports = {
    command: 'menu',
    aliases: ['help', 'aide'],
    description: 'Affiche le menu des commandes',
    category: 'general',
    async execute({ m, config }) {
        const text = `
╭─❖ *${config.BOT_NAME}* ❖─╮

👋 Salut *${m.pushName}* !
Préfixe actuel : *${config.PREFIX}*

*📂 GÉNÉRAL*
${config.PREFIX}menu — ce menu
${config.PREFIX}ping — teste la vitesse du bot
${config.PREFIX}owner — contacter le propriétaire
${config.PREFIX}setpp — changer la photo de profil (réponds à une image, admin)

*🎨 MÉDIAS*
${config.PREFIX}sticker — image/vidéo → sticker

*🛡️ MODÉRATION*
${config.PREFIX}antilink on/off — anti-lien du groupe
${config.PREFIX}kick @membre — expulser un membre (admin)

*🎮 JEUX*
${config.PREFIX}math — mini calcul rapide
${config.PREFIX}devine — jeu du nombre mystère

*🔧 OUTILS*
${config.PREFIX}traduire <texte> — traduction simple

Canal : ${config.CHANNEL_LINK}
`.trim();

        await m.reply(text);
    },
};
