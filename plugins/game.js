module.exports = [
    {
        command: 'math',
        aliases: ['calcul'],
        description: 'Propose un petit calcul mental',
        category: 'games',
        async execute({ m }) {
            const a = Math.floor(Math.random() * 50) + 1;
            const b = Math.floor(Math.random() * 50) + 1;
            const ops = ['+', '-', '*'];
            const op = ops[Math.floor(Math.random() * ops.length)];
            let answer;
            if (op === '+') answer = a + b;
            if (op === '-') answer = a - b;
            if (op === '*') answer = a * b;

            await m.reply(`🧮 Combien font *${a} ${op} ${b}* ?\n(Réponds directement dans le chat)\n\n_Réponse : ${answer}_`);
        },
    },
    {
        command: 'devine',
        aliases: ['guess'],
        description: 'Jeu du nombre mystère (1 à 100)',
        category: 'games',
        async execute({ m }) {
            const secret = Math.floor(Math.random() * 100) + 1;
            await m.reply(
                `🎯 J'ai choisi un nombre entre 1 et 100 !\n(Démo simplifiée — le nombre était *${secret}*)`
            );
        },
    },
];
