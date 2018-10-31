import React, { Component } from 'react';
import { Alert, View, StyleSheet, TextInput, Button, DatePickerIOS, TouchableOpacity, Text } from 'react-native';
import Heading from '../ViewComponents/Heading';
import FirebaseStore from '../Utils/FirebaseStore';

class CreateEvent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      eventName: '',
      eventNameValidated: true,
      eventDesc: '',
      chosenDate: new Date(),
    }
  }

  clearFormData = () => {
    this.setState({
      eventName: '',
      eventNameValidated: true,
      eventDesc: '',
      chosenDate: new Date()
    }, () => { Alert.alert("Event Creation Sucessful!") });
  }

  createEvent = async (txteventName, txtDesc, txtDateTime) => {
    if (this.state.eventName.trim() == '') {
      Alert.alert("Event Name can't be empty");
      return
    }
    if (!this.state.eventNameValidated) {
      Alert.alert("Enter valid inputs");
      return;
    }
    // today = new Date();
    // if (this.state.chosenDate.getTime() < today.getTime()) {
    //   Alert.alert("Sorry, can't create back dated event.");
    //   return;
    // }
    //save data to Firebase db
    firebaseStore = new FirebaseStore();
    firebaseStore.saveEventData(txteventName, txtDesc, txtDateTime);
    this.clearFormData(txteventName, txtDesc, txtDateTime);
  }

  setDate = (newDate) => {
    this.setState({ chosenDate: newDate });
  }

  validateInput = (txtInput, txtType) => {
    if (txtType == 'eventname') {
      if (txtInput.trim() != '')
        this.setState({ eventNameValidated: true, eventName: txtInput });
      else {
        this.setState({ eventNameValidated: false, eventName: txtInput });
      }
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Heading title={"Create New Event"} />
          {<TextInput
            style={[styles.textInput, !this.state.eventNameValidated ? styles.error : null]}
            value={this.state.eventName}
            placeholder="  Enter Event Name"
            onChangeText={(text) => { this.validateInput(text, 'eventname') }} />}
          <TextInput multiline
            style={styles.multilineText}
            value={this.state.eventDesc}
            placeholder="  Event Description"
            onChangeText={(text) => { this.setState({ eventDesc: text }) }} />
          <DatePickerIOS
            date={this.state.chosenDate}
            onDateChange={this.setDate} />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={ 
              () => this.createEvent(this.state.eventName, this.state.eventDesc, this.state.chosenDate.toString())}>
            <Text style={styles.submitButtonText}> Create Event </Text>
          </TouchableOpacity>

        </View>
        <Button
          title="Go to Home"
          value={this.state.chosenDate}
          onPress={() => this.props.navigation.navigate('EventsHome')} />
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
error: {
    borderColor: 'red',
    borderWidth: 2
}
});

export default CreateEvent;