import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, DatePickerIOS } from 'react-native';

class CreateEvent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      eventName: '',
      eventDesc: '',
      chosenDate: new Date(), //sets todays date.
    }
  }

  clearFormData = () =>{
    //calling console.log as call back in setState wil make sure it will display after state elemts are set
    this.setState({
      eventName: '',
      eventDesc: '',
      chosenDate: new Date()
    }, () => {console.log(this.state.eventName + this.state.eventDesc + this.state.chosenDate);});
  }

  createEventPressed = async(txteventName, txtDesc, txtDateTime) => {
    {
      await fetch('https://tweventmanager-db.firebaseio.com//events.json', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "eventName": txteventName,
          "eventDesc": txtDesc,
          "eventTiming" : txtDateTime
          }),
      })
      .catch((error) => {
        console.log(error);
      })

      console.log("Inside fetch block");
    }
    this.clearFormData();

  }

  setDate = (newDate) =>{
    this.setState({chosenDate: newDate});
  }

  render() {
    return (
      <View style={{flex:1}}>
       
        <View style={{flex:1}}> 

          <View style={{alignItems:'center'}}>
            <Text style={styles.formHeading}>Create New Event</Text>
          </View>

          <TextInput
            style={styles.textInput}
            value={this.state.eventName}
            placeholder="  Enter Event Name"
            onChangeText={(text) => { this.setState({ eventName: text }) }}
          />
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
              () => this.createEventPressed(this.state.eventName, this.state.eventDesc, this.state.chosenDate.toString())}>
            <Text style={styles.submitButtonText}> Create Event </Text>
          </TouchableOpacity>
        </View>
           
        <Button
          title="Go to Registration"
          value={this.state.chosenDate}
          onPress={() => this.props.navigation.navigate('RegisterForm')}
          //other available properties are this.props.navigation.goBack()
          // and navigation.popToTop()
        />
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
  formHeading: {
    color: 'black',
    padding: 20,
    fontSize: 25,
  }
});

export default CreateEvent;