import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Button, Switch } from 'react-native';
import Heading from '../ViewComponents/Heading';
import FirebaseStore from '../Utils/FirebaseStore';

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
            experienceInYrs: '',
            experienceValidated: true,
            additionalInfo : '',
            notificationJobOp: true,
            notificationTechRadar: true,
            notificationNewsletter: true
        }
    }

    clearFormData = (txtEventName, showWelcome) => {
        this.setState({
            name: '',
            nameValidated: true,
            email: '',
            emailValidated: true,
            mobile: '',
            mobileValidated: true,
            employer: '',
            jobTitle: '',
            experienceInYrs: '',
            experienceValidated: true,
            additionalInfo: '',
            notificationJobOp: true,
            notificationTechRadar: true,
            notificationNewsletter: true
            }, () => { 
                    if(showWelcome) 
                        Alert.alert("Welcome to " + txtEventName + " !\n" + "\nYour attendance is marked")});
    }

    saveAttendanceToDB = (txtEventName) =>{
        //save attendance data to Firebase db
        const regTimeStamp = new Date();
        const attendanceData = {
            "name": this.state.name.trim(),
            "email": this.state.email.trim(),
            "mobile": this.state.mobile.trim(),
            "employer": this.state.employer.trim(),
            "jobTitle": this.state.jobTitle.trim(),
            "experienceInYrs": this.state.experienceInYrs.trim(),
            "additionalInfo": this.state.additionalInfo.trim(),
            "regDate": regTimeStamp.toString().trim(),
            "notiJob": this.state.notificationJobOp.toString().trim(),
            "notiTech": this.state.notificationTechRadar.toString().trim(),
            "notiNews": this.state.notificationNewsletter.toString().trim()
        };
        firebaseStore = new FirebaseStore();
        firebaseStore.saveAttendanceData(txtEventName, attendanceData);
    }

    submitPressed = (txtEventName) => {
        if (this.state.name.trim() == '' || this.state.email == '') {
            Alert.alert("Name and Email address can't be empty");
            return
        }
        if (!this.state.nameValidated || !this.state.emailValidated || !this.state.mobileValidated) {
            Alert.alert("Enter valid inputs");
            return;
        }
        
        // Participant's consent here to save data with TW.
        Alert.alert(
            'User Consent',
            'I agree to share my information with you and understand it will be used as described in ThoughtWorks privacy policy: https://www.thoughtworks.com/privacy-policy',
            [
                { text: 'Cancel', onPress: () => {console.log('Cancel Pressed'); this.clearFormData(txtEventName, false);}, style: 'cancel' },
                { text: 'I agree', onPress: () => { 
                    this.saveAttendanceToDB(txtEventName);
                    this.clearFormData(txtEventName, true);
                } },
            ],
            { cancelable: false }
        );
    }

    validateInput = (txtInput, txtType) => {
        if (txtType == 'name') {
            alph = /^[a-z A-Z]+$/;
            if (alph.test(txtInput))
                this.setState({ nameValidated: true, name: txtInput });
            else {
                this.setState({ nameValidated: false, name: txtInput });
                //console.warn("only alphabets please...");       
            }
        }
        if (txtType == 'email') {
            if (txtInput.trim() != '')
                this.setState({ emailValidated: true, email: txtInput });
            else {
                this.setState({ emailValidated: false, email: txtInput });
                //console.warn("enter vald email address...");       
            }
        }
        if (txtType == 'mobile') {
            alph = /^[0-9+]+$/;
            if (alph.test(txtInput))
                this.setState({ mobileValidated: true, mobile: txtInput });
            else {
                this.setState({ mobileValidated: false, mobile: txtInput });
                //console.warn("only alphabets please...");       
            }
        }
        if (txtType == 'experience' ) {
            alph = /^[0-9]+$/;
            if (alph.test(txtInput))
                this.setState({ experienceValidated: true, experienceInYrs: txtInput });
            else {
                this.setState({ experienceValidated: false, experienceInYrs: txtInput });
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
                <Heading title={"Attendance"} subtitle={JSON.stringify(eventName)} />

                <View style={{ flex: 1, padding: 20, alignItems: 'center' }}>
                    <View style={{ flex: 3, width: "90%" }}>
                        <TextInput
                            style={[styles.textInput, !this.state.nameValidated ? styles.error : null]}
                            autoCorrect={false}
                            value={this.state.name}
                            placeholder="  *Participant's Name"
                            onChangeText={(text) => { this.validateInput(text, 'name') }} />
                        <TextInput
                            style={[styles.textInput, !this.state.emailValidated ? styles.error : null]}
                            autoCorrect={false}
                            value={this.state.email}
                            keyboardType={'email-address'}
                            placeholder="  *Email"
                            onChangeText={(text) => { this.validateInput(text, 'email') }} />
                        <TextInput
                            style={[styles.textInput, !this.state.mobileValidated ? styles.error : null]}
                            autoCorrect={false}
                            value={this.state.mobile}
                            placeholder="  Mobile Number"
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
                        <TextInput
                            style={[styles.textInput, !this.state.experienceValidated ? styles.error : null]}
                            autoCorrect={false}
                            value={this.state.experienceInYrs}
                            placeholder="  Experience in years"
                            onChangeText={(text) => { this.validateInput(text, 'experience') }} />
                        <TextInput
                            style={styles.textInput}
                            autoCorrect={false}
                            value={this.state.additionalInfo}
                            placeholder="  Additioanl Information (if any)"
                            onChangeText={(text) => { this.setState({ additionalInfo: text }) }} />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                        <Text style={{ padding: 10 }}>Would you like to hear from Thoughtworks?   </Text>
                        <View style={{ flex: 1, flexDirection: "column", justifyContent: 'flex-start' }}>
                            <View style={{ flex: 1, flexDirection: "row", padding: 2 }}>
                                <Text style={{ padding: 5 }}>Job Opportunities</Text>
                                <Switch
                                    style={{ transform: [{ scaleX: .6 }, { scaleY: .6 }] }}
                                    onValueChange={(boolVal) => { this.setState({ notificationJobOp: boolVal }) }}
                                    value={this.state.notificationJobOp} />
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", padding: 2 }}>
                                <Text style={{ padding: 5 }}>Tech Radar            </Text>
                                <Switch
                                    style={{ transform: [{ scaleX: .6 }, { scaleY: .6 }] }}
                                    onValueChange={(boolVal) => { this.setState({ notificationTechRadar: boolVal }) }}
                                    value={this.state.notificationTechRadar} />
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", padding: 2 }}>
                                <Text style={{ padding: 5 }}>Newsletter             </Text>
                                <Switch
                                    style={{ transform: [{ scaleX: .6 }, { scaleY: .6 }] }}
                                    onValueChange={(boolVal) => { this.setState({ notificationNewsletter: boolVal }) }}
                                    value={this.state.notificationNewsletter} />
                            </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={
                        () => this.submitPressed(eventName)}>
                    <Text style={styles.submitButtonText}> Mark My Attendance </Text>
                </TouchableOpacity>
                <Button
                    title="Go to Home"
                    onPress={() => this.props.navigation.navigate('EventsHome')} />
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
    notificationSwitch: {
        margin: 15,
    },
    error: {
        borderColor: 'red',
        borderWidth: 2
    }
});