import React, {Component} from 'react';
import { View, Text, Button} from 'react-native';

class CreateEvent extends Component {
    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
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

export default CreateEvent;