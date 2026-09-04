const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
    command: 'sticker',
    aliases: ['s', 'stiker'],
    description: 'Convertit une image ou une courte vidéo (en réponse) en sticker',
    category: 'media',
    async execute({ sock, m }) {
        const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const target = quoted
            ? { message: quoted, key: { remoteJid: m.chat, id: m.id } }
            : m.message?.imageMessage || m.message?.videoMessage
            ? { message: m.message, key: m.key }
            : null;

        if (!target) {
            await m.reply('📌 Réponds à une image ou une vidéo avec *.sticker*, ou envoie-la avec cette légende.');
            return;
        }

        try {
            const buffer = await downloadMediaMessage(target, 'buffer', {});
            await sock.sendMessage(
                m.chat,
                {
                    sticker: buffer,
                },
                { quoted: { key: m.key, message: m.message } }
            );
        } catch (err) {
            await m.reply('❌ Impossible de créer le sticker. (' + err.message + ')');
        }
    },
};
