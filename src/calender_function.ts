import * as fs from 'fs'
import * as readline from 'readline'
import GoogleAuth = require('google-auth-library')

export function authorize(credentials, callback, token_dir, token_path, scopes) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new GoogleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  
    // Check if we have previously stored a token.
    fs.readFile(token_path, function(err, token) {
      if (err) {
        getNewToken(oauth2Client, callback, token_dir, token_path, scopes);
      } else {
        oauth2Client.credentials = JSON.parse(token.toString());
        callback(oauth2Client);
      }
    });
}

function getNewToken(oauth2Client, callback, token_dir, token_path, scopes) {
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
      rl.close();
      oauth2Client.getToken(code, function(err, token) {
        if (err) {
          console.log('Error while trying to retrieve access token', err);
          return;
        }
        oauth2Client.credentials = token;
        storeToken(token, token_dir, token_path);
        callback(oauth2Client);
      });
    });
}

function storeToken(token, token_dir, token_path) {
    try {
      fs.mkdirSync(token_dir);
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(token_path, JSON.stringify(token), () => {});
    console.log('Token stored to ' + token_path);
}

