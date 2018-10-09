import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Picker } from 'react-native';
import firebase from '../Config/FireBaseConfig'

export default class RegisterForm extends Component {

    constructor(props) {
        super(props);

        this.itemsRef = firebase.database().ref().child('events');

        this.state = {
            selectedEvent: '',
            eventList: [],
            name: '',
            email: '',
            mobile: '',
            employer: '',
            jobTitle: ''
        }

    }

    submitPressed = (txtName, txtEmail, txtMobile, txtEmployer, txtJobTitle) => {

        fetch('https://tweventmanager-db.firebaseio.com//registrations.json', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "name": txtName,
                "email": txtEmail,
                "mobile": txtMobile,
                "employer": txtEmployer,
                "jobTitle": txtJobTitle
            }),
        })
            .then((response) => response.json())
        //catch exception

        //Also post data in eventsToregistrations table here.
    }

    updateEvent = (eventName) => {
        this.setState({ selectedEvent: eventName })
    }

    loadEvents = (myref) => {
        var items = [];
        myref.on('value', (snap) => {
            // get children as an array
            snap.forEach((child) => {
                items.push({
                    eventName: child.val().eventName,
                    _key: child.key,
                });
            });

        console.log(items)
        this.setState({
            eventList: [...this.state.eventList, ...items]
        });
       });
    }

    displayPickerItems = (events) => {
        return events.map((data) => { return (<Picker.Item label={data.eventName} value={data.eventName} key={data.eventName} />) })
    }

    componentDidMount() {
        this.loadEvents(this.itemsRef);
    }


    render() {
        return (
            <View style={styles.viewStyle}>
                <Text style={styles.formHeading}>Registration for event</Text>
                <Picker
                    style={styles.eventPicker} itemStyle={styles.eventPickerItem}
                    mode="dropdown"
                    selectedValue={this.state.selectedEvent} onValueChange={this.updateEvent}>

                    {this.displayPickerItems(this.state.eventList)}

                </Picker>

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

                <Text>{this.state.selectedEvent}</Text>
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
    viewStyle: {
        flex: 1,
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
        padding: 5,
        fontSize: 25,
        marginTop: 5,
        //fontWeight: 'bold',
    },
    eventPicker: {
        // width: 200,
        height: 100,
        // backgroundColor: '#FFF0E0',
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 14,
    },
    eventPickerItem: {
        height: 100,
        fontSize: 15
        //color: 'red'
    },
});