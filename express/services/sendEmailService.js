const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const sendEmail = async (email, subject, payload) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: process.env.HOST_EMAIL,
                pass: process.env.HOST_PASSWORD
            }
        });

        // will use templates later
        const options = () => {
            return {
                from: process.env.HOST_EMAIL,
                to: email,
                subject: subject,
                text: payload
            };
        };

        transporter.sendMail(options(), (error, info) => {
            if (error) {
                return error;
            } else {
                return res.status(200).json({
                    success: true
                });
            }
        });

    } catch (error) {
        return error;
    }
}

module.exports = sendEmail;