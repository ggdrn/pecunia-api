const { google } = require('googleapis');
const credencials = require('../../credentials.json')
// console.log();
// Substitua estes valores com seus dados
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = '';
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

// Crie um objeto OAuth2
const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

// Defina o token de atualização
oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
});

// Crie um serviço Gmail
const gmail = google.gmail({
    version: 'v1',
    auth: oauth2Client
});

module.exports = gmail;