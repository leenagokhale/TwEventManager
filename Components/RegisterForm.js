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

    submitPressed = (msg) => {
        Alert.alert('Name:' + msg);
    }

    render() {
        return (
            <View >
                <Text>Event Name Here drop down</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="  Enter Name"
                    onChangeText={(text) => { this.setState({name: text}) }}
                     />
                <TextInput
                    style={styles.textInput}
                    keyboardType={'email-address'}
                    placeholder="  Email" />
                <TextInput
                    style={styles.textInput}
                    placeholder="  Mobile Number" />
                <TextInput
                    style={styles.textInput}
                    placeholder="  Current Employer" />
                <TextInput
                    style={styles.textInput}
                    placeholder="  Current Job Title" />
                <Text>Would you like to here from Thoughtworks-Chk boxes</Text>
                
                <Text>{this.state.name}</Text>
                
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={
                         () => this.submitPressed(this.state.name)
                        }>
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
    submitButtonText:{
        color: 'white',
     }
});