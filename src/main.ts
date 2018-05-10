import { Transporter, createTransport } from 'nodemailer';
import * as SerialPort from 'serialport';

// シリアルポートに定期的に書き込んではデータを受け取る
// パーストークンは \n
// 1秒おき送信

var flag: boolean = true; // 絶起メールをまだ送っていなければtrue

// mail settings
const mailSettings = {
    service: 'Gmail',
    auth: {
        user : '<your mail address>',
        pass : '<password>',
        port : 25
    }
};

// mail information
const mailOptions = {
    to          : 'aqla114next@gmail.com',
    subject : 'Send mail by Node.js ',
    text       : "本文",                    //テキストメールの場合
    html      : '<b>本文</b>',  //HTMLメールの場合
    form     : 'Node.js'
};

// portのpath
const portPath: string = '/dev/cu.usbmodem14131';

// smtpのセッティングを初期化
const smtp: Transporter = createTransport(mailSettings);

// portの設定
const port = new SerialPort(portPath, {
    baudRate: 9600
});

port.on('open', function() {
    console.log('Serial open.');
});

port.on('data', function(data) {
    if (flag) {
        console.log('Data:' + data);
        smtp.sendMail(mailOptions, function(error, result) {
            if (error) {
                console.log(error);
            } else {
                console.dir(result);
            }
            smtp.close();
        });
        write('OK\n');
        flag = false;
    }
});

function write(data) {
    console.log('Write: ' + data);
    port.write(new Buffer(data), function(err, results) {
      if(err) {
        console.log('Err: ' + err);
        console.log('Results: ' + results);
      }
  });
}