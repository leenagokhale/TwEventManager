import React, {Component} from 'react';
import {  View, Text, Button } from 'react-native';

class MockListRegistrations extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>View Registrations</Text>
      <Button
        title="Go to Create Event"
        onPress={() => this.props.navigation.navigate('MockCreateEvent')}
      />
    </View>
  );
  }
}
export default MockListRegistrations; 