import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import firebase from '../Config/FireBaseConfig'
import Heading from '../ViewComponents/Heading';
import ListEvents from '../ViewComponents/ListEvents';

class EventsHome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedEvent: '',
            eventList: []
        }
    }

    loadEvents = (myref) => {
        console.log("In laod Events");
        myref.on('value', (snap) => {
            let items = []; items.length = 0;
            snap.forEach((childEvent) => {
                let cnt = 0;
                regRef = myref.child(childEvent.key).child('registrations');
                regRef.once('value', (snap2) => {
                    cnt = snap2.numChildren();
                    console.log("Children : " + cnt);
                });
                items.push({
                    eventName: childEvent.val().eventName,
                    _key: childEvent.key,
                    regCnt: cnt
                });
            });
            console.log(items)
            this.setState({
                eventList: items
            }, () => console.log(this.state.eventList));
        });
    }

    componentDidMount() {
        this.loadEvents(firebase.database().ref().child('events'));
    }

    removeFromFireBase = (myref) => {
        /* iterate through children of this node, and delete entry under 'registrations' node.
        Just comment this code if you don't want to remove registrations data. */
        regRef = myref.child('registrations');
        regRef.once('value', (snap) => {
            if (snap.val() != null) {
                snap.forEach((child) => {
                    tempRef = firebase.database().ref('registrations/').child(child.key);
                    tempRef.remove(function (error) {
                        console.log(error ? "Uh oh, failed to delete!" : "Event deleted!")
                    });
                });
            }
        });
        /* Now remove child node from 'events'*/
        myref.remove(function (error) {
            console.log(error ? "Uh oh, failed to delete!" : "Event deleted!")
        });
    }

    removeEventHandler = (txtEventID) => {
        //console.log("In remove " +  txtEventID);
        temp = firebase.database().ref().child('events').child(txtEventID);

        /*  chk if there are any registrations under this event..
            to give warning to user before deletion */
        regRef = temp.child('registrations');
        regRef.once('value', (snap) => {

            if (snap.val() != null) { //delete comfirmation for event with registration 
                Alert.alert(
                    'Delete Confirmation',
                    'Attendance already marked for this event..\n Do u still want to delete this event?',
                    [
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'OK', onPress: () => this.removeFromFireBase(temp) },
                    ],
                    { cancelable: false }
                );
            }
            else //delete comfirmation for events without any registration 
            {
                Alert.alert(
                    'Delete Confirmation',
                    'Do u want to delete this event?',
                    [
                        { text: 'Cancel', onPress: () => console.log('no registrations Cancel Pressed'), style: 'cancel' },
                        { text: 'OK', onPress: () => this.removeFromFireBase(temp) },
                    ],
                    { cancelable: false }
                );
            }
        });
    }

    onAttendanceClick = (eventID, eventName) => {
        this.props.navigation.navigate('RegisterForEvent',
            { eventID: eventID, eventName: eventName });
    }

    onListAttendanceClick = (eventID, eventName) => {
        this.props.navigation.navigate('ListForEvent',
            { eventID: eventID, eventName: eventName });
    }

    render() {
        return (
            <View View style={styles.viewStyle}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Heading title={"Event Attendance"} />
                    <Text></Text>
                    <ListEvents data={this.state.eventList}
                        onAttendanceClick={this.onAttendanceClick}
                        onListAttendanceClick={this.onListAttendanceClick}
                        removeEventHandler={this.removeEventHandler} />
                </View>
                <Button
                    title="Go to Create New Event"
                    onPress={() => this.props.navigation.navigate('CreateEvent')} />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
    },
});

export default EventsHome;
