import * as fs from 'fs';
import google = require('googleapis');
import {authorize} from './calender_function';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

var description = '';
var addr;

fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Google Calendar API.
  authorize(JSON.parse(content.toString()), listEvents, TOKEN_DIR, TOKEN_PATH, SCOPES);
});

function listEvents(auth) {
  var calendar = google.calendar('v3');
  calendar.events.list({
    auth: auth,
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var events = response.items;
    if (events.length == 0) {
      console.log('No upcoming events found.');
    } else {

    var event = events[0];
    var start = event.start.dateTime || event.start.date;
    var summary = event.summary;
    description = event.description;

    console.log(description);

    description = "<p>hoge</p><p>fuga</p><a ref=hogehoge>aqla115@yahoo.co.jp</a>";

    var descriptionList = description.split('\n');

    descriptionList.map(function(x) {
      if (x.match(/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/) !== null)
        addr = x;
    });

    descriptionList = descriptionList
      .map((str: string) => str.split('>'))
      .reduce((a: string[]) => [].concat(a))
      .map((str: string) => str.split('<'))
      .reduce((a: string[], b: string[]) => a.concat(b));
      
    console.log(descriptionList);

    descriptionList.map(function(x) {
      if (x.match(/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/) !== null)
        addr = x;
      
      return x;
    });

    console.log(addr);
    }
  });
}