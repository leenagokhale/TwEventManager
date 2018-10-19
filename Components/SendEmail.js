import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Alert } from 'react-native';


// const functions = require('../functions/node_modules/firebase-functions');
// const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
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
//const APP_NAME = 'TW events registration';


class SendEmail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      emailAddress: '',
      emailMsg: '',
    }
  }

  clearFormData = () =>{
    //calling console.log as call back in setState wil make sure it will display after state elemts are set
    this.setState({
        emailAddress: '',
        emailMsg: ''
    });
  }

//  sendEmailPressed = async() => {
  sendEmailPressed = async (email, displayName) => {

   Alert.alert("send Email pressed!");
    // const mailOptions = {
    //     from: `${APP_NAME} <noreply@firebase.com>`,
    //     to: email,
    //   };
    
    //   // The user subscribed to the newsletter.
    //   mailOptions.subject = `Welcome to ${APP_NAME}!`;
    //   mailOptions.text = `Hey ${displayName || ''}! Welcome to ${APP_NAME}. I hope you will enjoy our service.`;
    //   return mailTransport.sendMail(mailOptions).then(() => {
    //     return console.log('New welcome email sent to:', email);
    //   });

   // this.clearFormData();
  }

  render() {
    return (
      <View style={{flex:1}}>
       
        <View style={{flex:1}}> 

          <View style={{alignItems:'center'}}>
            <Text style={styles.formHeading}>Send Test Email</Text>
          </View>

          <TextInput
            style={styles.textInput}
            value={this.state.emailAddress}
            placeholder="  Enter email address"
            onChangeText={(text) => { this.setState({ emailAddress: text }) }}
          />
          <TextInput multiline
            style={styles.multilineText}
            value={this.state.emailMsg}
            placeholder="  Email Message"
            onChangeText={(text) => { this.setState({ emailMsg: text }) }} />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={ 
              () => this.sendEmailPressed(this.state.emailAddress, 'New Participant')}>
            <Text style={styles.submitButtonText}> Send Email </Text>
          </TouchableOpacity>
        </View>

           
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('EventsHome')}
        />
      </View >
    );
  }
}

const styles = StyleSheet.create({
  
  multilineText: {
    height: 100,
    margin: 15,
    backgroundColor: 'white',
    fontSize: 15
  },
  textInput: {
    margin: 15,
    height: 40,
    backgroundColor: 'white',
    fontSize: 15
  },
  submitButton: {
    backgroundColor: 'steelblue',
    alignItems: 'center',
    padding: 10,
    margin: 15,
    height: 40
  },
  submitButtonText: {
    color: 'white',
  },
  formHeading: {
    color: 'black',
    padding: 20,
    fontSize: 25,
  }
});

export default SendEmail;