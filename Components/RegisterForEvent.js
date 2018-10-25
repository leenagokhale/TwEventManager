import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Picker, Button, Switch } from 'react-native';
import firebase from '../Config/FireBaseConfig'

export default class RegisterForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            nameValidated: true,

            email: '',
            emailValidated: true,

            mobile: '',
            mobileValidated: true,

            employer: '',
            jobTitle: '',
            notificationJobOp: true,
            notificationTechRadar: true,
            notificationNewsletter: true
        }
    }

    clearFormData = (txtEventName) =>{

        this.setState({
            name: '',
            nameValidated: true,
            
            email: '',
            emailValidated: true,

            mobile: '',
            mobileValidated: true,

            employer: '',
            jobTitle: '',
            notificationJobOp: true,
            notificationTechRadar: true,
            notificationNewsletter: true

        }, () => {Alert.alert("Welcome to " + txtEventName + " !\n" + "\nYour attendance is marked")});
      }
    
    submitPressedFireBaseAPI = (txtEventName, txtName, txtEmail, txtMobile, txtEmployer, txtJobTitle, txtNotiJob, txtNotiTech, txtNotiNews) => {
      
        if (this.state.name.trim() == '' || this.state.email == '')
        {
            Alert.alert("Name and Email address can't be empty");
            return
        }

        if(! this.state.nameValidated || !this.state.emailValidated || !this.state.mobileValidated)
        {
            Alert.alert("Enter valid inputs");
            return;
        }

        const regTimeStamp = new Date();
        // Write data to registrations node.
        newRef = firebase.database().ref().child('registrations').push({
            "name": txtName.trim(),
            "email": txtEmail.trim(),
            "mobile": txtMobile.trim(),
            "employer": txtEmployer.trim(),
            "jobTitle": txtJobTitle.trim(),
            "regDate": regTimeStamp.toString().trim(),
            "notiJob": txtNotiJob.toString().trim(),
            "notiTech": txtNotiTech.toString().trim(),
            "notiNews": txtNotiNews.toString().trim()});

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

       this.clearFormData(txtEventName);
    }

    validateInput = (txtInput, txtType) => {

        if (txtType == 'name')
        {
            alph=/^[a-z A-Z]+$/;
            if(alph.test(txtInput))
                this.setState({nameValidated:true,name: txtInput});
            else{
                this.setState({nameValidated:false, name: txtInput});
                //console.warn("only alphabets please...");       
            }
        }
        if (txtType == 'email')
        {
            //alph=/^[0-9a-zA-Z_@.%+-]+$/;
            //if(alph.test(txtInput))
            if(txtInput.trim()!='')
                this.setState({emailValidated:true,email: txtInput});
            else{
                this.setState({emailValidated:false, email: txtInput});
                //console.warn("enter vald email address...");       
            }
        }
        if (txtType == 'mobile')
        {
            alph=/^[0-9+]+$/;
            if(alph.test(txtInput))
                this.setState({mobileValidated:true, mobile: txtInput});
            else{
                this.setState({mobileValidated:false, mobile: txtInput});
                //console.warn("only alphabets please...");       
            }
        }
    }
    render() {

        const { navigation } = this.props;
        const eventID = navigation.getParam('eventID', 'some ID');
        const eventName = navigation.getParam('eventName', 'some Name');

        return (
            <View style={styles.viewStyle}>

                <View style={{alignItems:'center'}}>
                    <Text style={styles.formHeading}>Attendance</Text>
                    {/* <Text>eventID: {JSON.stringify(eventID)}</Text> */}
                    <Text style={{fontSize:18}}>{JSON.stringify(eventName)}</Text>
                </View>
            
                
                <View style={{flex: 1, padding:20, alignItems:'center'}}>   
                <View style={{flex:3, width:"90%"}}>
                    <TextInput
                        style={[styles.textInput, !this.state.nameValidated?styles.error:null]}
                        autoCorrect={false}
                        value={this.state.name}
                        placeholder="  *Participant's Name"
                        // onChangeText={(text) => { this.setState({ name: text }) }}
                        onChangeText={(text) => { this.validateInput(text, 'name') }} />
                    <TextInput
                        style={[styles.textInput, !this.state.emailValidated?styles.error:null]}
                        autoCorrect={false}
                        value={this.state.email}
                        keyboardType={'email-address'}
                        placeholder="  *Email"
                       // onChangeText={(text) => { this.setState({ email: text }) }} />
                       onChangeText={(text) => { this.validateInput(text, 'email') }} />

                    <TextInput
                        style={[styles.textInput, !this.state.mobileValidated?styles.error:null]}
                        autoCorrect={false}
                        value={this.state.mobile}
                        placeholder="  Mobile Number"
                       // onChangeText={(text) => { this.setState({ mobile: text }) }} />
                       onChangeText={(text) => { this.validateInput(text, 'mobile') }} />

                    <TextInput
                        style={styles.textInput}
                        autoCorrect={false}
                        value={this.state.employer}
                        placeholder="  Current Employer"
                        onChangeText={(text) => { this.setState({ employer: text }) }} />
                    <TextInput
                        style={styles.textInput}
                        autoCorrect={false}
                        value={this.state.jobTitle}
                        placeholder="  Current Job Title"
                        onChangeText={(text) => { this.setState({ jobTitle: text }) }} />
                    </View>    
                    <View style={{flex:1, justifyContent:'flex-start'}}>
                        <Text style={{padding:10}}>Would you like to hear from Thoughtworks?   </Text>
                        <View style={{flex:1, flexDirection:"column", justifyContent:'flex-start'}}>
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
                    </View>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={
                        () => this.submitPressedFireBaseAPI(eventName, this.state.name, this.state.email, this.state.mobile, this.state.employer, this.state.jobTitle, this.state.notificationJobOp, this.state.notificationTechRadar, this.state.notificationNewsletter)}>
                    <Text style={styles.submitButtonText}> Mark My Attendance </Text>
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
        height: 40,
        backgroundColor: 'white',
        fontSize: 15,
        width: "90%"
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
    notificationSwitch:{
        margin:15,
    },
    error:{
        borderColor:'red',
        borderWidth:2
    }
});