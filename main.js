const { Client, Events, GatewayIntentBits} = require('discord.js');
const env = require('dotenv').config();
const sheets = require('./sheets.json');

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

if (env.error) {
    throw env.error;
}

if (!process.env.EMAIL || !process.env.PKEY_GOOGLE || !process.env.TOKEN) {
    throw new Error("Missing environment variables");
}

if (process.argv.length != 3) {
    `Nombre invalide d'arguments. Usage: node main.js <commande>
    Commandes:
    - "data" : envoie les données des feuilles de calculs sur le serveur Discord
    - "classement" : envoie le classement des pays sur le serveur Discord
    `;
}

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const key = JSON.parse(Buffer.from(process.env.PKEY_GOOGLE, 'base64').toString());
const jwt = new JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: SCOPES
});

const client = new Client({intents: [GatewayIntentBits.Guilds]});

function round(value, decimals) {
    return Number(value.toPrecision(decimals));
}

async function sendSheetData(){
    for (documentId in sheets) {
        const doc = new GoogleSpreadsheet(documentId, jwt);
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        await sheet.loadCells("A1:CE121");
        let nomOfficiel = "non implémenté";
        let regime = "error";
        let autorite = "error";
        let orientationPolitique = "error";
        let ethniePrincipale = "error";
        let niveauCivilisationnel = "error";
        let relationsCommerciales = "non implémenté";
        let relationsDiplomatiques = "non implémenté";
        if (sheet.getCellByA1("AF3").value){
            regime = sheet.getCellByA1("AG3").value;
        } else {
            regime = sheet.getCellByA1("AG4").value;
        }
        for (let i = 5; i < 8; i++){
            if (sheet.getCell(i, 31).value){
                autorite = sheet.getCell(i, 32).value;
            }
        }
        for (let i = 8; i < 15; i++){
            if (sheet.getCell(i, 31).value){
                orientationPolitique = sheet.getCell(i, 32).value;
            }
        }
        for (let i = 55; i < 109; i++){
            let backgroundColour = sheet.getCell(i, 27).backgroundColor;
            if (!backgroundColour.blue && !backgroundColour.green && !backgroundColour.red){
                ethniePrincipale = sheet.getCell(i, 27).value;
            }
        }
        for (let i = 52; i < 57; i++){
            if (sheet.getCell(i, 31).value){
                niveauCivilisationnel = sheet.getCell(i, 32).value;
            }
        }
        let publicData = doc.sheetsByIndex[2];
        await publicData.loadCells("A1:AA121");
        nomOfficiel = publicData.getCellByA1("C3").value;
        relationsCommerciales = "";
        relationsDiplomatiques = "";
        for (let i = 29; i < 85; i += 2){
            relationsCommerciales += `${publicData.getCell(i, 22).value}\n`;
            relationsDiplomatiques += `${publicData.getCell(i, 14).value}\n`;
        }
        niveauCivilisationnel = niveauCivilisationnel.replace(/ \d+$/, "");
        message = `**Nom officiel :** ${nomOfficiel}
                   **Population :** ${round(sheet.getCellByA1("F3").value, 2)}
                   **Régime :** ${regime}
                   **Autorité :** ${autorite}
                   **Orientation :** ${orientationPolitique}
                   **Capitale :** ${sheet.getCellByA1("N20").value}
                   **Niveau de Développement :** ${round(sheet.getCellByA1("U79").value, 2)}
                   **Ethnie principale :** ${ethniePrincipale}
                   **Niveau Civilisationnel :** ${niveauCivilisationnel}

                   **Relations commerciales :**
                   ${relationsCommerciales}

                   **Relations diplomatiques :**
                   ${relationsDiplomatiques}`;
        client.channels.cache.get(sheets[documentId]).send(message);
    }
}

client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}`);
    
    if (process.argv[2] == "data") {
        sendSheetData();
    } else if (process.argv[2] == "classement") {
        sendClassement();
    }
    else {
        console.log(`Commande inconnue : ${process.argv[2]}`);
    }

    client.destroy();
});

client.login(process.env.TOKEN);
