const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');

const config = require('./config');
const { loadPlugins } = require('./lib/pluginLoader');
const { serialize } = require('./lib/myfunc');

const SESSION_DIR = path.join(__dirname, 'session');
const logger = pino({ level: 'silent' });

/**
 * Applique la photo de profil définie dans config.BOT_PP au compte WhatsApp
 * du bot, une seule fois par démarrage (si le fichier existe).
 */
async function applyStartupProfilePicture(sock) {
    try {
        if (!config.BOT_PP) return;
        const ppPath = path.isAbsolute(config.BOT_PP)
            ? config.BOT_PP
            : path.join(__dirname, config.BOT_PP);

        if (!(await fs.pathExists(ppPath))) return;

        await sock.updateProfilePicture(sock.user.id, { url: ppPath });
        console.log(chalk.green(`✓ Photo de profil appliquée depuis ${config.BOT_PP}`));
    } catch (err) {
        console.log(chalk.yellow('⚠ Impossible de définir la photo de profil au démarrage :'), err.message);
    }
}

async function startBot() {
    await fs.ensureDir(SESSION_DIR);

    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: !fs.existsSync(path.join(SESSION_DIR, 'creds.json')),
        auth: state,
        browser: Browsers.macOS(config.BOT_NAME),
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
    });

    // Charge toutes les commandes du dossier /plugins
    const plugins = loadPlugins(path.join(__dirname, 'plugins'));
    console.log(chalk.green(`✓ ${plugins.length} plugin(s) chargé(s)`));

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log(chalk.yellow('QR reçu — scanne-le depuis WhatsApp > Appareils liés.'));
        }

        if (connection === 'close') {
            const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            console.log(chalk.red('Connexion fermée.'), 'Reconnexion :', shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log(chalk.green.bold(`✓ ${config.BOT_NAME} est connecté et en ligne !`));
            applyStartupProfilePicture(sock);
        }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        const rawMsg = messages[0];
        if (!rawMsg?.message || rawMsg.key.fromMe === undefined) return;

        try {
            const m = serialize(rawMsg, sock);
            if (!m.body) return;

            const isCmd = m.body.startsWith(config.PREFIX);
            if (!isCmd) return;

            const commandName = m.body.slice(config.PREFIX.length).trim().split(/ +/)[0].toLowerCase();
            const args = m.body.trim().split(/ +/).slice(1);

            const plugin = plugins.find(
                (p) => p.command === commandName || (p.aliases || []).includes(commandName)
            );
            if (!plugin) return;

            if (config.MODE === 'self' && !m.key.fromMe) return;

            await plugin.execute({ sock, m, args, config });
        } catch (err) {
            console.error(chalk.red('Erreur sur un message :'), err);
        }
    });

    // Modération anti-suppression / gestion des participants de groupe
    sock.ev.on('group-participants.update', async (evt) => {
        try {
            const welcomePlugin = plugins.find((p) => p.event === 'group-participants.update');
            if (welcomePlugin) await welcomePlugin.execute({ sock, evt, config });
        } catch (err) {
            console.error(chalk.red('Erreur événement groupe :'), err);
        }
    });

    return sock;
}

startBot().catch((err) => {
    console.error(chalk.red('Échec du démarrage du bot :'), err);
    process.exit(1);
});
