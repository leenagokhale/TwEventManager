import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

class CreateEvent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      eventName: '',
      eventDesc: '',
    }
  }

  createEventPressed = (txteventName, txtDesc) => {

    fetch('https://tweventmanager-db.firebaseio.com//events.json', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "name": txteventName,
        "email": txtDesc,
      }),
    })
      .then((response) => response.json())
    //catch exception
  }

  render() {
    return (
      <View >
        
        <Text style={styles.formHeading}>Create New Event</Text>
        <TextInput
          style={styles.textInput}
          placeholder="  Enter Event Name"
          onChangeText={(text) => { this.setState({ eventName: text }) }}
        />
        <TextInput
          style={styles.textInput}
          placeholder="  Event Description"
          onChangeText={(text) => { this.setState({ eventDesc: text }) }} />

        <Text>{this.state.eventName}</Text>
        <Text>{this.state.eventDesc}</Text>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={
            () => this.createEventPressed(this.state.eventName, this.state.eventDesc)}>
          <Text style={styles.submitButtonText}> Create Event </Text>
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

export default CreateEvent;