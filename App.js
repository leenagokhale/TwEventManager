/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput } from 'react-native';
import RegisterForm from './Components/RegisterForm';
import ListRegistrations from './Components/ListRegistrations';
import CreateEvent from './Components/CreateEvent';
import EventsHome from './Components/EventsHome';
import RegisterForEvent from './Components/RegisterForEvent';

import { createStackNavigator } from 'react-navigation';


const NewRootStack = createStackNavigator({
  EventsHome: {screen: EventsHome},
  CreateEvent: { screen: CreateEvent },
  RegisterForEvent: { screen: RegisterForEvent },
 // ListRegistrations: {screen: ListRegistrations}
},
  {
    initialRouteName: 'EventsHome',
  }
);


export default class App extends Component {
  render() {
    return (
     // <View style={styles.container}>
       // { 
          // <RegisterForm /> 
          // <ListRegistrations /> 
          // <CreateEvent />
          <NewRootStack /> 
       // } 
      //</View> 
    /*  <NewTabs /> */
      
    );
  }
}

