/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import CreateEvent from './Containers/CreateEvent';
import EventsHome from './Containers/EventsHome';
import RegisterForEvent from './Containers/RegisterForEvent';
import ListForEvent from './Containers/ListForEvent';

import { createStackNavigator } from 'react-navigation';


const ScreenStack = createStackNavigator({
  EventsHome: {screen: EventsHome},
  CreateEvent: { screen: CreateEvent },
  RegisterForEvent: { screen: RegisterForEvent },
  ListForEvent: {screen: ListForEvent},
},
  {
    initialRouteName: 'EventsHome',
  }
);


export default class App extends Component {
  render() {
    return (
      <ScreenStack /> 
    );
  }
}

