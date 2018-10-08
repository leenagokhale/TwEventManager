import React, {Component} from 'react';
import { View, Text, Button} from 'react-native';

class MockCreateEvent extends Component {
    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Mock Create Event</Text>
        <Button
          title="Go to Register"
          onPress={() => this.props.navigation.navigate('MockRegister')}
          //other available properties are this.props.navigation.goBack()
          // and navigation.popToTop()
        />
      </View>
     );
    }
  }

export default MockCreateEvent;