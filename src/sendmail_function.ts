import { Transporter } from 'nodemailer';

export function sendmail(smtp: Transporter, mailOptions) {
        smtp.sendMail(mailOptions, function(error, result) {
            if (error) {
                console.log(error);
            } else {
                console.dir(result);
            }
            smtp.close();
        });
}