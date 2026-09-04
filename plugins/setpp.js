const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
    command: 'setpp',
    aliases: ['setprofile', 'changepp'],
    description: 'Change la photo de profil du bot (réponds à une image avec cette commande)',
    category: 'general',
    async execute({ sock, m, config }) {
        // Réservé au propriétaire, pour éviter que n'importe qui change la photo du bot
        const senderNumber = m.sender?.split('@')[0];
        if (senderNumber !== config.OWNER_NUMBER && !m.key.fromMe) {
            return m.reply('⛔ Seul le propriétaire peut changer la photo de profil.');
        }

        const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const target = quoted
            ? { message: quoted, key: { remoteJid: m.chat, id: m.id } }
            : m.message?.imageMessage
            ? { message: m.message, key: m.key }
            : null;

        if (!target) {
            return m.reply('📌 Réponds à une image avec *.setpp* pour changer la photo de profil du bot.');
        }

        try {
            const buffer = await downloadMediaMessage(target, 'buffer', {});
            await sock.updateProfilePicture(sock.user.id, buffer);
            await m.reply('✅ Photo de profil mise à jour !');
        } catch (err) {
            await m.reply('❌ Échec de la mise à jour. (' + err.message + ')');
        }
    },
};
