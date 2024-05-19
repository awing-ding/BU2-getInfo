const { Client, Events, GatewayIntentBits} = require('discord.js');
const env = require('dotenv').config();
const sheets = require('./sheets.json');

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

SALON_CLASSEMENT = "1239914067779391569";

if (env.error) {
    throw env.error;
}

if (!process.env.PKEY_GOOGLE || !process.env.TOKEN) {
    throw new Error("Missing environment variables");
}

if (process.argv.length < 3 || process.argv.length > 4) {
    `Nombre invalide d'arguments. Usage: node main.js <commande>
        Commandes:
        - "data <numéro du tour>" : envoie les données des feuilles de calculs sur le serveur Discord
        - "classement [channel]" : envoie le classement des pays sur le serveur Discord
    `;
}

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const key = JSON.parse(Buffer.from(process.env.PKEY_GOOGLE, 'base64').toString());
const jwt = new JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: SCOPES
});

const client = new Client({intents: [GatewayIntentBits.Guilds]});

async function getSheetClassementData(id){
    return new Promise(async (resolve, reject) => {
        const doc = new GoogleSpreadsheet(id, jwt);
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        const sheet3 = doc.sheetsByIndex[2];
        await sheet.loadCells("A1:CE121");
        let data = {};
        let nom = sheet3.getCellByA1("C3").value;
        data[nom] = {   "population": sheet.getCellByA1("F3").value,
            "revenu": sheet.getCellByA1("J8").value,
            "impots": sheet.getCellByA1("J3").value,
            "production": sheet.getCellByA1("J4").value,
            "exportation": sheet.getCellByA1("J6").value,
            "infrastructure": sheet.getCellByA1("J5").value,
            "income": sheet.getCellByA1("J16").value,
            "armeetot": sheet.getCellByA1("J10").value,
            "armee": sheet.getCellByA1("I32").value,
            "marine": sheet.getCellByA1("I42").value,
            "air": sheet.getCellByA1("I54").value,
            "brut_dev": sheet.getCellByA1("U76").value,
            "net_dev": sheet.getCellByA1("U79").value,

            "bois": sheet.getCellByA1("L60").value,
            "pierre": sheet.getCellByA1("L61").value,
            "plante": sheet.getCellByA1("L62").value,
            "sable": sheet.getCellByA1("L63").value,
            "alu": sheet.getCellByA1("L64").value,
            "carbone": sheet.getCellByA1("L65").value,
            "chromium": sheet.getCellByA1("L66").value,
            "cuivre": sheet.getCellByA1("L67").value,
            "fer": sheet.getCellByA1("L68").value,
            "charbon": sheet.getCellByA1("L69").value,
            "gaz": sheet.getCellByA1("L70").value,
            "petrole": sheet.getCellByA1("L71").value
        };
        resolve(data);
    });
}

async function sendClassement(){
    let fullData = [];
    for (let documentId in sheets){
        fullData.push(await getSheetClassementData(documentId));
    }
    Promise.all(fullData).then((data) => {
        outputClassement(data, "population", "population");
        outputClassement(data, "revenu", "revenu");
        outputClassement(data, "impots", "impots");
        outputClassement(data, "production", "production");
        outputClassement(data, "exportation", "exportation");
        outputClassement(data, "infrastructure", "infrastructure");
        outputClassement(data, "income", "income");
        outputClassement(data, "armeetot", "armée totale");
        outputClassement(data, "armee", "armée");
        outputClassement(data, "marine", "marine");
        outputClassement(data, "air", "armée de l'air");
        outputClassement(data, "brut_dev", "développement brut");
        outputClassement(data, "net_dev", "développement net");
        outputClassement(data, "bois", "industrie du bois");
        outputClassement(data, "pierre", "industrie de la pierre");
        outputClassement(data, "plante", "industrie de la plante");
        outputClassement(data, "sable", "industrie du sable");
        outputClassement(data, "alu", "industrie de l'aluminium");
        outputClassement(data, "carbone", "industrie du carbone");
        outputClassement(data, "chromium", "industrie du chrome");
        outputClassement(data, "cuivre", "industrie du cuivre");
        outputClassement(data, "fer", "industrie du fer");
        outputClassement(data, "charbon", "industrie du charbon");
        outputClassement(data, "gaz", "industrie du gaz");
        outputClassement(data, "petrole", "industrie du pétrole");
    });
}

async function outputClassement(data, variable, name, channel){
    data.sort((a, b) => {
        return data[a][variable] - data[b][variable];
    });
    let message = `**Classement des pays par ${name} :**\n`;
    for (let country in data){
        message += `${country} : ${round(data[country][variable], 2)}\n`;
    }
    client.channels.cache.get(channel).send(message);
}



    function round(value, decimals) {
        return Number(value.toPrecision(decimals));
    }

    async function sendSheetData(tour){
        for (let documentId in sheets) {
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
            let publicData = doc.sheetsByIndex[2];
            await publicData.loadCells("A1:AA121");
            nomOfficiel = publicData.getCellByA1("C3").value;
            regime = publicData.getCellByA1("C7").value;
            autorite = publicData.getCellByA1("C9").value;
            orientationPolitique = publicData.getCellByA1("C11").value;
            ethniePrincipale = publicData.getCellByA1("C17").value;
            niveauCivilisationnel = publicData.getCellByA1("C19").value;
            relationsCommerciales = "";
            relationsDiplomatiques = "";
            for (let i = 28; i < 85; i += 2){
                relationsDiplomatiques += `${publicData.getCell(i, 22).value}\n`.replace(/^null\n/, "");
                relationsCommerciales += `${publicData.getCell(i, 14).value}\n`.replace(/^null\n/, "");
            }
            ethniePrincipale = publicData.getCellByA1("C17").value;
            niveauCivilisationnel = niveauCivilisationnel.replace(/ \d+$/, "");
            message = `**Tour ${tour}**
                **Nom officiel :** ${nomOfficiel}
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

    client.on(Events.ClientReady, async () => {
        console.log(`Logged in as ${client.user.tag}`);
        
        if (process.argv[2] == "data") {
            await sendSheetData(process.argv[3]);
        } else if (process.argv[2] == "classement") {
            if (process.argv.length == 3) {
                argv[3] = SALON_CLASSEMENT;
            }
            await sendClassement();
        }
        else {
            console.log(`Commande inconnue : ${process.argv[2]}`);
        }
        await client.destroy();
    });

    client.login(process.env.TOKEN);
