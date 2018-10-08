import React, {Component} from 'react';
import {  View, Text, Button } from 'react-native';

class MockRegister extends Component {
     render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Registrations</Text>
        <Button
          title="Go to Create Event"
          onPress={() => this.props.navigation.navigate('MockCreateEvent')}
        />
      </View>
      );
    }
  }
  
export default MockRegister;