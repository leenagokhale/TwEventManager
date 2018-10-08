import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

export default class RegisterForm extends Component {
    state = {
        name: '',
        email: '',
        mobile: '',
        employer: '',
        jobTitle: ''
    }

    submitPressed = (txtName, txtEmail, txtMobile, txtEmployer, txtJobTitle) => {

        fetch('https://tweventmanager-db.firebaseio.com//registrations.json', {
            method:'POST',
            headers: {
            Accept:'application/json',
            'Content-Type':'application/json',
           },
            body:JSON.stringify({
             "name": txtName,
             "email": txtEmail,
             "mobile": txtMobile,
             "employer": txtEmployer,
             "jobTitle": txtJobTitle
             }),
            })
           .then((response) => response.json())
            //catch exception
     }

    render() {
        return (
            <View >
                <Text style={styles.formHeading}>Registration</Text>
                <Text>Event Name Here drop down</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="  Enter Name"
                    onChangeText={(text) => { this.setState({ name: text }) }}
                />
                <TextInput
                    style={styles.textInput}
                    keyboardType={'email-address'}
                    placeholder="  Email"
                    onChangeText={(text) => { this.setState({ email: text }) }} />
                <TextInput
                    style={styles.textInput}
                    placeholder="  Mobile Number"
                    onChangeText={(text) => { this.setState({ mobile: text }) }} />
                <TextInput
                    style={styles.textInput}
                    placeholder="  Current Employer"
                    onChangeText={(text) => { this.setState({ employer: text }) }} />
                <TextInput
                    style={styles.textInput}
                    placeholder="  Current Job Title"
                    onChangeText={(text) => { this.setState({ jobTitle: text }) }} />

                <Text>Would you like to here from Thoughtworks-Chk boxes</Text>

                <Text>{this.state.name}</Text>
                <Text>{this.state.email}</Text>
                <Text>{this.state.mobile}</Text>
                <Text>{this.state.employer}</Text>
                <Text>{this.state.jobTitle}</Text>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={
                        () => this.submitPressed(this.state.name, this.state.email, this.state.mobile, this.state.employer, this.state.jobTitle)}>
                    <Text style={styles.submitButtonText}> Submit </Text>
                </TouchableOpacity>

            </View >
        );
    }
}

const styles = StyleSheet.create({
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