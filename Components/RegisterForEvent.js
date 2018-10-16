import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Picker, Button, Switch } from 'react-native';
import firebase from '../Config/FireBaseConfig'

export default class RegisterForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            //selectedEvent: '',
            name: '',
            email: '',
            mobile: '',
            employer: '',
            jobTitle: '',
            notificationJobOp: true,
            notificationTechRadar: true,
            notificationNewsletter: true
        }
    }

    clearFormData = () =>{

        this.setState({
            name: '',
            email: '',
            mobile: '',
            employer: '',
            jobTitle: '',
            notificationJobOp: true,
            notificationTechRadar: true,
            notificationNewsletter: true

        }, () => {console.log(this.state.name);});
      }
    
    submitPressedFireBaseAPI = (txtEventName, txtName, txtEmail, txtMobile, txtEmployer, txtJobTitle, txtNotiJob, txtNotiTech, txtNotiNews) => {
      
        console.log(this.state.notificationJobOp);
        const regTimeStamp = new Date();
        // Write data to registrations node.
        newRef = firebase.database().ref().child('registrations').push({
            "name": txtName,
            "email": txtEmail,
            "mobile": txtMobile,
            "employer": txtEmployer,
            "jobTitle": txtJobTitle,
            "regDate": regTimeStamp.toString(),
            "notiJob": txtNotiJob.toString(),
            "notiTech": txtNotiTech.toString(),
            "notiNews":txtNotiNews.toString()});

        const newID = newRef.key; //fireBase generated key to save unders events

        //Find the right node under events to add the new participants's name/id.
        eventsRef = firebase.database().ref().child('events');
        eventsRef.once('value', (snap) => {
            // get children as an array
            //console.log(snap.val())
            snap.forEach((child) => {
                console.log(child.val().eventName)
                if (child.val().eventName.localeCompare(txtEventName) === 0)
                {
                    //append eventName key to events node. set it to participants's name.
                    //update will not add fireBase generated uique key. 
                    eventsRef.child(child.key + '/registrations').update({[newID]: txtName}); 
                }
            });
        });

       this.clearFormData();
    }

    // updateEvent = (eventName) => {
    //     this.setState({ selectedEvent: eventName })
    // }

    componentDidMount() {
       // this.loadEvents(this.eventsRef);
    }

    render() {

        const { navigation } = this.props;
        const eventID = navigation.getParam('eventID', 'some ID');
        const eventName = navigation.getParam('eventName', 'some Name');

        return (
            <View style={styles.viewStyle}>

                <View style={{alignItems:'center'}}>
                    <Text style={styles.formHeading}>Registration for event</Text>
                    <Text>eventID: {JSON.stringify(eventID)}</Text>
                    <Text>eventName: {JSON.stringify(eventName)}</Text>
                </View>

                <View style={{flex: 1, padding:5, alignItems:'center'}}>   
                    <TextInput
                        style={styles.textInput}
                        value={this.state.name}
                        placeholder="  Participant's Name"
                        onChangeText={(text) => { this.setState({ name: text }) }}
                    />
                    <TextInput
                        style={styles.textInput}
                        value={this.state.email}
                        keyboardType={'email-address'}
                        placeholder="  Email"
                        onChangeText={(text) => { this.setState({ email: text }) }} />
                    <TextInput
                        style={styles.textInput}
                        value={this.state.mobile}
                        placeholder="  Mobile Number"
                        onChangeText={(text) => { this.setState({ mobile: text }) }} />
                    <TextInput
                        style={styles.textInput}
                        value={this.state.employer}
                        placeholder="  Current Employer"
                        onChangeText={(text) => { this.setState({ employer: text }) }} />
                    <TextInput
                        style={styles.textInput}
                        value={this.state.jobTitle}
                        placeholder="  Current Job Title"
                        onChangeText={(text) => { this.setState({ jobTitle: text }) }} />

                    <View style={{flex:1, flexDirection:"column"}}>
                    <Text style={{padding:1}}>Would you like to hear from Thoughtworks?            </Text>
                        <View style={{flex:1, flexDirection:"row", padding:2}}>
                            <Text style={{padding:5}}>Job Opportunities</Text>
                            <Switch 
                                style={{ transform: [{scaleX: .6}, { scaleY: .6}]}}
                                onValueChange={(boolVal) => { this.setState({ notificationJobOp: boolVal }) }}
                                value={this.state.notificationJobOp} /> 
                            </View>
                        <View style={{flex:1, flexDirection:"row", padding:2}}>
                            <Text style={{padding:5}}>Tech Radar            </Text>
                            <Switch 
                                style={{ transform: [{scaleX: .6}, { scaleY: .6}]}}
                                onValueChange={(boolVal) => { this.setState({ notificationTechRadar: boolVal }) }}
                                value={this.state.notificationTechRadar} />
                                </View>
                        <View style={{flex:1, flexDirection:"row", padding:2}}>
                            <Text style={{padding:5}}>Newsletter             </Text>
                            <Switch 
                                style={{ transform: [{scaleX: .6}, { scaleY: .6}]}}
                                onValueChange={(boolVal) => { this.setState({ notificationNewsletter: boolVal }) }}
                                value={this.state.notificationNewsletter} />    
                        </View>
                    </View>
   
                </View>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={
                        () => this.submitPressedFireBaseAPI(eventName, this.state.name, this.state.email, this.state.mobile, this.state.employer, this.state.jobTitle, this.state.notificationJobOp, this.state.notificationTechRadar, this.state.notificationNewsletter)}>
                    <Text style={styles.submitButtonText}> Submit </Text>
                </TouchableOpacity>
                
                <Button
                    title="Go to Home"
                    onPress={() => this.props.navigation.navigate('EventsHome')}
                />

            </View >
        );
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
    },

    textInput: {
        margin: 8,
        height: 30,
        backgroundColor: 'white',
        fontSize: 15,
        width: "90%",
    
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
    },
    eventPicker: {
        width: "90%",
        height: 100,
        // backgroundColor: '#FFF0E0',
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 14,
    },
    eventPickerItem: {
        height: 100,
        fontSize: 15
    },
    notificationSwitch:{
        margin:15,
    }
});