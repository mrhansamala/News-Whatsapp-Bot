const { makeWASocket, fetchLatestBaileysVersion, WA_DEFAULT_EPHEMERAL, makeInMemoryStore, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");
const hirunewsScrap = require('hirunews-scrap');
const esanaNewsScraper = require('esana-news-scraper');
const deranaNews = require('@kaveesha-sithum/derana-news');

async function MRhansamala() {
    
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/ADD-CRED-JSON');
    const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });
    const { version } = await fetchLatestBaileysVersion();

    try {
        // Create WhatsApp socket
        const session = makeWASocket({
            logger: pino({ level: 'fatal' }),
            printQRInTerminal: true,
            browser: ['MR-Hansamala', 'safari', '1.0.0'],
            fireInitQueries: false,
            shouldSyncHistoryMessage: false,
            downloadHistory: false,
            syncFullHistory: false,
            generateHighQualityLinkPreview: true,
            auth: state,
            version: version,
            getMessage: async key => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
                    return msg.message || undefined;
                }
                return { conversation: 'An Error Occurred, Repeat Command!' };
            }
        });

        store.bind(session.ev);

       
        session.ev.on("connection.update", async (s) => {
            const { connection, lastDisconnect } = s;
            if (connection === "open") {
                async function fetchAndSendNews() {
                    try {
                        let data;
                        
                        try {
                            data = await hirunewsScrap.getLatestNews(); 
                        } catch (error) {
                            console.error("Failed with hirunews-scrap, trying other scrapers:", error);
                            try {
                                data = await esanaNewsScraper.getLatestNews(); 
                            } catch (error) {
                                console.error("Failed with esana-news-scraper, trying last scraper:", error);
                                try {
                                    data = await deranaNews.getLatestNews(); 
                                } catch (error) {
                                    console.error("All scrapers failed:", error);
                                    return;
                                }
                            }
                        }

                       
                        let message = `*${data.title}* 
●━━━━━━━━━━━━━━━━━━━━━●  
${data.time} 
●━━━━━━━━━━━━━━━━━━━━━● 
${data.desc}
●━━━━━━━━━━━━━━━━━━━━━●

📍 *SL News*

👤 *Owner No* :- http://wa.me/94701197452

🔗 *Create By MR-Hansamala*

●━━━━━━━━━━━━━━━━━━━━━●`;

                        
                        await session.sendMessage("120363307730093301@g.us", { image: { url: data.image }, caption: message }, { ephemeralExpiration: WA_DEFAULT_EPHEMERAL });
                    } catch (error) {
                        console.error("Failed to fetch or send news:", error);
                    }
                }

                
                setInterval(fetchAndSendNews, 10000);
            }

            
            if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode !== 401) {
                MRhansamala();
            }
        });

       
        session.ev.on('creds.update', saveCreds);
        session.ev.on("messages.upsert", () => {});

    } catch (err) {
        console.error(err + " 😪Error Occurred Please report to Owner and Stay tuned");
    }
}


MRhansamala();
 
