const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//const functions = require('firebase-functions');
var nodemailer=require('nodemailer');

//var transporter = nodemailer.createTransport('smtps://username@gmail.com:password@smtp.gmail.com');

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.newSendMail = functions.https.onRequest((req, res) =>{
    var mailOptions={
        to: 'gokhale.leena@gmail.com',
        subject: 'Test Mail',
        html: 'Testing the Mail'
    }
    transporter.sendMail(mailOptions,function(err,response){
        if(err){
            res.end('Mail not sent');
        }
        else{
            res.end('Mail sent');
        }
    });
});


// const gmailEmail = functions.config().gmail.email;
// const gmailPassword = functions.config().gmail.password;
// const mailTransport = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: gmailEmail,
//     pass: gmailPassword,
//   },
// });

// Your company name to include in the emails
// const APP_NAME = 'TW events registration';

// const mailOptions = {
//             from: 'gokhale.leena@gmail.com',
//             to: 'gokhale.leena@gmail.com'
//           };
        
//           // The user subscribed to the newsletter.
//           mailOptions.subject = `Welcome to ${APP_NAME}!`;
//           mailOptions.text = `Hey ${displayName || ''}! Welcome to ${APP_NAME}. I hope you will enjoy our service.`;
//           return mailTransport.sendMail(mailOptions).then(() => {
//             return console.log('New welcome email sent to:', email);
//           });
    






//https://stackoverflow.com/questions/47980573/sending-mail-from-firebase-webapp
// Now when you want to send a message, 
//you can use this url: https://us-central1-<project-id>.cloudfunctions.net/sendMail
// Replace <project-id> with your Firebase Project ID.

//https://us-central1-tweventmanager-db.cloudfunctions.net/sendMail

//https://us-central1-tweventmanager-db.cloudfunctions.net/newSendMail

//Billing account not configured. 
//External network is not accessible and quotas are severely limited. 
//Configure billing account to remove these restrictions

//to deploy specific function
//firebase deploy --only functions:sendMail

//set email ID and password in config of functions
// $ firebase functions:config:set gmail.email="myusername@gmail.com" gmail.password="secretpassword"

// Project name
// tweventmanager-db
// Project ID 
// tweventmanager-db
// Cloud Firestore location
// us-central
// Web API Key
// AIzaSyBNO-gyQ3XXbd2wtDvDysE23EPcKKWyH3U
// Public settings
// These settings control instances of your project shown to the public
// Public-facing name 
// project-870347395030
// Support email 
// gokhale.leena@gmail.com	

//good article on fireBase cloud functions 
// https://aaronczichon.de/2017/03/13/firebase-cloud-functions/


// fireBase cloud functions hosting
//https://firebase.google.com/docs/functions/get-started#top_of_page

//firebase cloud functions - what I tried

// goto project directory
//1. $ npm install -g firebase-tools
//2. $ firebase login

//3. $ firebase init 

//4. write yor function or code

//5. $ cd /TwEventManager/
//6. $ firebase deploy --only functions:sendMail
//7. For nodemailer make sure you go to functions directory and 
//npm install nodemailer --save

//  https://us-central1-tweventmanager-db.cloudfunctions.net/sendMail

//To enable google billing account
// https://console.cloud.google.com/home/dashboard?project=neon-griffin-206910


// https://console.cloud.google.com/functions/list?project=tweventmanager-db


// Firebase console :
// https://console.cloud.google.com/home/dashboard?project=tweventmanager-db&_ga=2.118900481.-900820003.1539680228

/* Hi Aniket,

I am working on an assignment from recruitment team.  
I need few things set up for the same. How do i initiate this ? 
pls guide 

The project needs 
1. iPad device for testing (for a week). (The application is supposed to work on iPad.)
2. One generic email account creation like  - 'TwRecruitment' or similar 
(This is needed to give then access to project database.)

*/