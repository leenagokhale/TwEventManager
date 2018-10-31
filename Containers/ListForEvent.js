import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import firebase from '../Config/FireBaseConfig'

import Heading from '../ViewComponents/Heading';
import ListParticipants from '../ViewComponents/ListParticipants';
import SaveFile from '../Utils/SaveFile';

export default class ListForEvent extends Component {

    _isMounted = false;
    constructor(props) {
        super(props);

        this.itemsRef = firebase.database().ref().child('registrations');

        this.state = {
            eventID: '',
            eventName: '',
            registrationsCount: 0,
            data: [],
            attendanceData: [],
            xlsFileName: '',
        }
    }

    exportToExcel = () => {
        console.log("In export to excel");
        regIDs = this.state.data.map(function (obj) {
            return obj._key;
        });

        var names = [["Name", "Email", "Mobile", "Employer", "Job Title", "Date", "Notify Job", "Notify Tech", "Notify News"]];
        var promises = [];

        // Map the Firebase promises into an array. This is V imp or else 
        // right data won't go to saving of file.
        promises = regIDs.map(id => {
            return firebase.database().ref('registrations/' + id)
                .once('value', (s) => {
                    //console.log(s.val().name)
                    s.val()
                })
        })
        //once the promises are ready, now make an array of arrays that is needed
        //for excel saving.
        Promise.all(promises)
            .then(results => {
                results.forEach((snapshot) => {
                    const Name = [
                        snapshot.val().name,
                        snapshot.val().email,
                        snapshot.val().mobile,
                        snapshot.val().employer,
                        snapshot.val().jobTitle,
                        snapshot.val().regDate,
                        snapshot.val().notiJob,
                        snapshot.val().notiTech,
                        snapshot.val().notiNews
                    ];
                    names.push(Name);
                });
                console.log('Names: ' + names[1])

                const filnameNospaces = "tw-event-" + this.state.eventName.replace(/\s/g, "") + ".xls";
                this.setState({ xlsFileName: filnameNospaces });

                saveFile = new SaveFile();
                saveFile.toDevice(names, filnameNospaces);
            })
            .catch(err => {
                console.log(err)
            })
    }

    sendEmail = () => {
        if (this.state.xlsFileName === '') {
            Alert.alert("Click on Save before sending email");
            return;
        }
        saveFile = new SaveFile();
        saveFile.toEmail(this.state.eventName);
    }

    getParticipantsForEvent = (txtEventID) => {
        tmp = 'events/' + [txtEventID] + '/registrations';
        console.log("Inside getParticipantsForEvent" + tmp);
        eventRegRef = firebase.database().ref().child(tmp);
        eventRegRef.on('value', (snap) => {

            if (snap.val() == null) {
                console.log("No registered participants for the event!")
                this.setState({
                    registrationsCount: 0,
                    data: []
                });
            }
            else {
                let itemsReg = [];
                let temp = 0;

                snap.forEach((child) => {
                    temp++;
                    itemsReg.push({
                        name: child.val(),
                        _key: child.key,
                        // email: child.val().email
                    });
                });

                if (this._isMounted) {
                    //console.log(itemsReg);
                    this.setState({
                        registrationsCount: temp,
                        data: itemsReg
                    }, console.log(this.state.data));
                }
            }
        });
    }

    componentDidMount() {
        const { navigation } = this.props;
        const txtEventID = navigation.getParam('eventID', '');
        const txtEventName = navigation.getParam('eventName', '');
        console.log("In Mount..." + txtEventID + txtEventName);
        this._isMounted = true;

        this.setState({
            eventID: txtEventID,
            eventName: txtEventName,
            xlsFileName: '',
        }, this.getParticipantsForEvent(txtEventID));
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getItem = (txtMsg) => {
        Alert.alert(txtMsg);
    }

    render() {
        return (
            <View style={styles.viewStyle}>
                <Heading title={"Participants Present for"} subtitle={JSON.stringify(this.state.eventName)} />
                <Text></Text>
                <Text></Text>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{ padding: 12, alignItems: 'center', backgroundColor: 'steelblue' }}>
                        <Text>Registrations Count - {this.state.registrationsCount}</Text>
                    </View>
                    {this.state.registrationsCount > 0 ?
                        < ListParticipants data={this.state.data} getItem={this.getItem} />
                        :
                        < ListParticipants data={[]} getItem={this.getItem} />}
                </View>
                <Button
                    title="Save (Excel Format)" onPress={() => this.exportToExcel()} />
                <Button
                    title="Send Email" onPress={() => this.sendEmail()} />
                <Button
                    title="Go to Home" onPress={() => this.props.navigation.navigate('EventsHome')} />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
    }
});