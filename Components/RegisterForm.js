import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Picker, Button, Switch } from 'react-native';
import firebase from '../Config/FireBaseConfig'

export default class RegisterForm extends Component {

    constructor(props) {
        super(props);
        this.eventsRef = firebase.database().ref().child('events');

        this.state = {
            selectedEvent: '',
            eventList: [],
            name: '',
            email: '',
            mobile: '',
            employer: '',
            jobTitle: '',
            notificationJobOp: true
        }
    }

    // This function writes data to fireBase using fetch API.
    // It is not called anymore. We use function that uses freBase API. But keep it forreference
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
        .catch(error => {
            console.log('Error in fecth in RegisterForm' + error);
          });
    }

    clearFormData = () =>{

        this.setState({
            name: '',
            email: '',
            mobile: '',
            employer: '',
            jobTitle: '',
            notificationJobOp: true
        }, () => {console.log(this.state.name);});
      }
    
    submitPressedFireBaseAPI = (txtName, txtEmail, txtMobile, txtEmployer, txtJobTitle, txtEventName) => {
      
        console.log(this.state.notificationJobOp);
        const regTimeStamp = new Date();
        // Write data to registrations node.
        newRef = firebase.database().ref().child('registrations').push({
            "name": txtName,
            "email": txtEmail,
            "mobile": txtMobile,
            "employer": txtEmployer,
            "jobTitle": txtJobTitle,
            "regDate": regTimeStamp.toString()});

        const newID = newRef.key; //fireBase generated key to save unders events

        //Find the right node under events to add the new participants's name/id.
        this.eventsRef.once('value', (snap) => {
            // get children as an array
            //console.log(snap.val())
            snap.forEach((child) => {
                console.log(child.val().eventName)
                if (child.val().eventName.localeCompare(txtEventName) === 0)
                {
                    //append eventName key to events node. set it to participants's name.
                    //update will not add fireBase generated uique key. 
                    this.eventsRef.child(child.key + '/registrations').update({[newID]: txtName}); 
                }
            });
        });

        this.clearFormData();
    }

    updateEvent = (eventName) => {
        this.setState({ selectedEvent: eventName })
    }

    loadEvents = (myref) => {
        myref.on('value', (snap) => {
        var items = [];
            // get children as an array
            snap.forEach((child) => {
                
                //set default selection for picker. First item in event list
                if (this.state.selectedEvent === '')
                 this.setState({ selectedEvent: child.val().eventName })
                 
                items.push({
                    eventName: child.val().eventName,
                    _key: child.key,
                });
            });

        //console.log(items)
        this.setState({
            eventList: [...this.state.eventList, ...items]
        });
       });
    }

    displayPickerItems = (events) => {
        return events.map((data) => { return (<Picker.Item label={data.eventName} value={data.eventName} key={data.eventName} />) })
    }

    componentDidMount() {
        this.loadEvents(this.eventsRef);
    }

    render() {
        return (
            <View style={styles.viewStyle}>

                <View style={{alignItems:'center'}}>
                    <Text style={styles.formHeading}>Registration for event</Text>
                </View>

                <View style={{padding:5, alignItems:'center'}}>
                    <Picker
                        style={styles.eventPicker} itemStyle={styles.eventPickerItem}
                        mode="dropdown"
                        selectedValue={this.state.selectedEvent} onValueChange={this.updateEvent}>
                        {this.displayPickerItems(this.state.eventList)}
                    </Picker>
                </View>

                <View style={{flex: 1, padding:10, alignItems:'center'}}>   
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

                    <Text style={{padding:10}}>Would you like to hear from Thoughtworks?</Text>

                     <View style={{flex:1, borderWIDTH: 1, bordercolor: 'red', flexDirection:"row"}}>
                        <Text style={{padding:5}}>Job Opportunities</Text>
                        <Switch 
                            style={{ transform: [{scaleX: .6}, { scaleY: .6}]}}
                            onValueChange={(boolVal) => { this.setState({ notificationJobOp: boolVal }) }}
                            value={this.state.notificationJobOp} /> 

                            <Text style={{padding:5}}>Job Opportunities</Text>
                        <Switch 
                            style={{ transform: [{scaleX: .6}, { scaleY: .6}]}}
                            onValueChange={(boolVal) => { this.setState({ notificationJobOp: boolVal }) }}
                            value={this.state.notificationJobOp} /> 
                            <Text style={{padding:5}}>Job Opportunities</Text>
                            
                        <Switch 
                            style={{ transform: [{scaleX: .6}, { scaleY: .6}]}}
                            onValueChange={(boolVal) => { this.setState({ notificationJobOp: boolVal }) }}
                            value={this.state.notificationJobOp} />    
                    </View>
   
                </View>
                
                {/* <Text>{this.state.selectedEvent}</Text> */}

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={
                        () => this.submitPressedFireBaseAPI(this.state.name, this.state.email, this.state.mobile, this.state.employer, this.state.jobTitle, this.state.selectedEvent)}>
                    <Text style={styles.submitButtonText}> Submit </Text>
                </TouchableOpacity>
                
                <Button
                    title="Go to View Registrations"
                    onPress={() => this.props.navigation.navigate('ListRegistrations')}
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
        height: 35,
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