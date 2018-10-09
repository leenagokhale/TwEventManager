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

import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';

import MockRegister from './Components/MockRegister';
import MockCreateEvent from './Components/MockCreateEvent';
import MockListRegistrations from './Components/MockListRegistrations';
import Icon from 'react-native-vector-icons/Ionicons';


const NewTabs = createBottomTabNavigator({
  MockCreateEvent: {
    screen: MockCreateEvent,
    navigationOptions: {
      tabBarLabel: 'Create New Event',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-home" color={tintColor} size={24} />
      )
    }
  },
  MockRegister: {
    screen: MockRegister,
    navigationOptions: {
      tabBarLabel: 'Register',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-settings" color={tintColor} size={24} />
      )

    }
  },
  MockListRegistrations: {
    screen: MockListRegistrations,
    navigationOptions: {
      tabBarLabel: 'View Regitrations',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-settings" color={tintColor} size={24} />
      )
    }
  },
},
  {
    initialRouteName: 'MockCreateEvent',
    tabBarOptions:{
      activeTintColor: 'blue',
      inactiveTintColor: 'grey',
      labelStyles:{ fontSize:20 },
    }
  }
);

const RootStack = createStackNavigator({
  CreateEvent: { screen: CreateEvent },
  MockRegister: { screen: MockRegister }
},
  {
    initialRouteName: 'CreateEvent',
  }
);

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        { 
           <RegisterForm /> 
           /* <ListRegistrations /> */
            /*<CreateEvent />*/
            } 
      </View> 
    /*  <NewTabs /> */
      /*<RootStack /> */
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    paddingTop: 30,
    alignItems: 'center',
    backgroundColor: 'powderblue',
  },
});
