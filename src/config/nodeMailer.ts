import nodemailer from 'nodemailer';
// Generate test SMTP service account from ethereal.email

// create reusable transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true, // true for 465, false for other ports
	auth: {
		user: 'walter.valdivia.personal@gmail.com', // generated ethereal user
		pass: 'opgobtpaynxnvcyl', // password generated from verificatio two steps in Gmail Google account for walter.valdivia.personal
	},
});

// await transporter.verify().then(() => {
// 	// console.log('Ready to send email');
// });
