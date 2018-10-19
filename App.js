/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import CreateEvent from './Components/CreateEvent';
import EventsHome from './Components/EventsHome';
import RegisterForEvent from './Components/RegisterForEvent';
import ListForEvent from './Components/ListForEvent';
import SendEmail from './Components/SendEmail';

import { createStackNavigator } from 'react-navigation';


const NewRootStack = createStackNavigator({
  EventsHome: {screen: EventsHome},
  CreateEvent: { screen: CreateEvent },
  RegisterForEvent: { screen: RegisterForEvent },
  ListForEvent: {screen: ListForEvent},
 //SendEmail: {screen: SendEmail}
},
  {
    initialRouteName: 'EventsHome',
  }
);


export default class App extends Component {
  render() {
    return (
      <NewRootStack /> 
    );
  }
}

