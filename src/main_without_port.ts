import { Transporter, createTransport } from 'nodemailer';
// import * as SerialPort from 'serialport';
import * as fs from 'fs';
import google = require('googleapis');
import {authorize} from './calender_function';
import {sendmail} from './sendmail_function';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

var description = '';
var addr;

var flag: boolean = true; // 絶起メールをまだ送っていなければtrue

// mail settings
const mailSettings = {
    service: 'Gmail',
    auth: {
        user : '<your email address>',
        pass : '<your password>',
        port : 25
    }
};

// mail information
var mailOptions = {
    to          : 'aqla114next@gmail.com',
    subject : '欠席連絡',
    text       : 'お世話になっております。本日、私用につき欠席させて頂きます。よろしくお願いします。',   //テキストメールの場合
    form     : 'Node.js'
};

fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Calendar API.
    authorize(JSON.parse(content.toString()), listEvents, TOKEN_DIR, TOKEN_PATH, SCOPES);
});

// portのpath
// const portPath: string = '/dev/cu.usbmodem14541';

// smtpのセッティングを初期化
const smtp: Transporter = createTransport(mailSettings);

// portの設定
// const port = new SerialPort(portPath, {
//     baudRate: 9600
// });

// port.on('open', function() {
//     console.log('Serial open.');
// });

// port.on('data', function(data) {

// });

// flag = sendmail(smtp, mailOptions, flag);

// function write(data) {
//     console.log('Write: ' + data);
//     port.write(new Buffer(data), function(err, results) {
//       if(err) {
//         console.log('Err: ' + err);
//         console.log('Results: ' + results);
//       }
//   });
// }

function listEvents(auth) {
    const calendar = google.calendar('v3');
    
    calendar.events.list({
        auth: auth,
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime'
    }, 
    function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }

        const events = response.items;

        if (events.length == 0) {
            console.log('予定入ってなくない？WOWOW');
        } else {
            var event = events[0];
            description = event.description;
            console.log(description);

            // descriptionを<>で分解
            var descriptionList = description.split('\n')
            .map((str: string) => str.split('>'))
            .reduce((a: string[]) => [].concat(a))
            .map((str: string) => str.split('<'))
            .reduce((a: string[], b: string[]) => a.concat(b));
            
            console.log(descriptionList);

            descriptionList.map(function(x) {
                if (x.match(/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/) !== null)
                    addr = x;
            });

            if (addr !== undefined) {
                mailOptions.to = addr;
                console.log(`Sending email to ${mailOptions.to}...`);
            } else {
                console.log('errror in getting mail address!');
                console.log(`So, sending email to ${mailOptions.to}`);
            }

            sendmail(smtp, mailOptions);
        }
    });
}