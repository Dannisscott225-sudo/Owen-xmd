// État en mémoire simple : groupes où l'anti-lien est activé.
// Pour une vraie prod, remplace ça par un petit fichier JSON ou une base de données.
const antilinkGroups = new Set();

const LINK_REGEX = /(https?:\/\/|chat\.whatsapp\.com|wa\.me)/i;

module.exports = [
    {
        command: 'antilink',
        description: 'Active/désactive la suppression automatique des liens dans le groupe',
        category: 'moderation',
        async execute({ m, args }) {
            if (!m.isGroup) return m.reply('⚠️ Commande valable uniquement dans un groupe.');
            const choice = (args[0] || '').toLowerCase();

            if (choice === 'on') {
                antilinkGroups.add(m.chat);
                await m.reply('🛡️ Anti-lien *activé* pour ce groupe.');
            } else if (choice === 'off') {
                antilinkGroups.delete(m.chat);
                await m.reply('🛡️ Anti-lien *désactivé* pour ce groupe.');
            } else {
                await m.reply('Utilise : .antilink on  |  .antilink off');
            }
        },
    },
    {
        command: 'checklink',
        description: "Vérifie si un message contient un lien interdit (utilisé en interne)",
        category: 'moderation',
        async execute({ sock, m }) {
            if (!m.isGroup || !antilinkGroups.has(m.chat)) return;
            if (LINK_REGEX.test(m.body)) {
                await sock.sendMessage(m.chat, { delete: m.key });
                await sock.sendMessage(m.chat, {
                    text: `🚫 Lien supprimé — envoyé par @${m.sender.split('@')[0]}`,
                    mentions: [m.sender],
                });
            }
        },
    },
    {
        command: 'kick',
        description: 'Expulse un membre mentionné (admin uniquement)',
        category: 'moderation',
        async execute({ sock, m }) {
            if (!m.isGroup) return m.reply('⚠️ Commande valable uniquement dans un groupe.');

            const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            if (!mentioned.length) return m.reply('📌 Mentionne le membre à expulser : .kick @membre');

            try {
                await sock.groupParticipantsUpdate(m.chat, mentioned, 'remove');
                await m.reply('✅ Membre expulsé.');
            } catch (err) {
                await m.reply("❌ Je n'ai pas les droits admin nécessaires.");
            }
        },
    },
];
