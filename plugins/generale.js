module.exports = [
    {
        command: 'ping',
        description: 'Teste la vitesse de réponse du bot',
        category: 'general',
        async execute({ m }) {
            const start = Date.now();
            await m.reply('🏓 Pong...');
            const latency = Date.now() - start;
            await m.reply(`⚡ ${latency} ms`);
        },
    },
    {
        command: 'owner',
        description: "Affiche le contact du propriétaire",
        category: 'general',
        async execute({ m, config }) {
            await m.reply(`👤 Propriétaire de ${config.BOT_NAME} : wa.me/${config.OWNER_NUMBER}`);
        },
    },
    {
        command: 'runtime',
        aliases: ['uptime'],
        description: 'Temps depuis le démarrage du bot',
        category: 'general',
        async execute({ m }) {
            const sec = process.uptime();
            const h = Math.floor(sec / 3600);
            const min = Math.floor((sec % 3600) / 60);
            const s = Math.floor(sec % 60);
            await m.reply(`⏱️ En ligne depuis : ${h}h ${min}m ${s}s`);
        },
    },
];
