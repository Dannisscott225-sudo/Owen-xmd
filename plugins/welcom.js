module.exports = {
    event: 'group-participants.update',
    description: 'Message de bienvenue / au revoir automatique',
    async execute({ sock, evt }) {
        const { id: groupId, participants, action } = evt;

        for (const participant of participants) {
            const name = participant.split('@')[0];
            if (action === 'add') {
                await sock.sendMessage(groupId, {
                    text: `👋 Bienvenue @${name} dans le groupe !`,
                    mentions: [participant],
                });
            } else if (action === 'remove') {
                await sock.sendMessage(groupId, {
                    text: `👋 @${name} a quitté le groupe.`,
                    mentions: [participant],
                });
            }
        }
    },
};
