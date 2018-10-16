import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Alert} from 'react-native';
import firebase from '../Config/FireBaseConfig'

class EventsHome extends Component {

  constructor(props) {
    super(props);

    this.state = {
        selectedEvent: '',
        eventList: []
    }
  }

  loadEvents = (myref) => {
    
    myref.on('value', (snap) => {
        let items = []; items.length=0;

        // get children as an array
        snap.forEach((child) => {
        
            //if (this.state.selectedEvent === '')
             //this.setState({ selectedEvent: child.key});

            items.push({
                eventName: child.val().eventName,
                _key: child.key,
            });
        });

        console.log(items)
        this.setState({
            //eventList: [...this.state.eventList, ...items]
            eventList: items
        }, ()=>console.log(this.state.eventList));
    });

}

  
componentDidMount() {
    console.log("In laod Events");
    this.loadEvents(firebase.database().ref().child('events'));
}

FlatListItemSeparator = () => {
    return (
        <View
        style={{
            height: 1,
            width: "100%",
            backgroundColor: "#607D8B",
        }}
        />
    );
}

GetItem(txtEventID, txtEventName) {
    Alert.alert(txtEventName);
    this.setState({
        selectedEvent: txtEventID
    });
}

GoToRegistration(txtEventID, txtEventName) {


}

render() {
    return (
    <View View style={styles.viewStyle}>
        <View style={{flex:1, alignItems:'center'}}> 

            <View style={{alignItems:'center'}}>
                <Text style={styles.formHeading}>External Events Orgnization</Text>
            </View>

            <FlatList style={styles.listStyle}
                marginBottom={10}
                data={this.state.eventList}
                // extraData={this.state.selectedEvent}
                ItemSeparatorComponent = {this.FlatListItemSeparator}
                renderItem={({item}) =>
                    (
                        <View style={{flex:1, flexDirection:"row"}}>
                            <Text style={{padding:6}}onPress={this.GetItem.bind(this, item._key, item.eventName)} > {item.eventName} </Text>
                            <Button 
                            value={item._key}
                            onPress={() => this.props.navigation.navigate('RegisterForEvent',
                                 {eventID:item._key ,eventName:item.eventName})} title="Register"/>
                            <Button onPress={() => this.props.navigation.navigate('ListForEvent',
                                 {eventID:item._key ,eventName:item.eventName})} title="View"/>
                        </View>)}    
                keyExtractor={(item, index) => index.toString()}
                // ListHeaderComponent={this.Render_FlatList_Sticky_header}
                // stickyHeaderIndices={[0]}
            />

            {/* <Text>Event ID - {this.state.selectedEvent}</Text> */}
          {/* <TouchableOpacity
            style={styles.submitButton}
            onPress={ 
              () => this.createEventPressed(this.state.eventName, this.state.eventDesc, this.state.chosenDate.toString())}>
            <Text style={styles.submitButtonText}> Create Event </Text>
          </TouchableOpacity> */}
        </View>
           
        <Button
          title="Go to Create New Event"
          onPress={() => this.props.navigation.navigate('CreateEvent')}
        />
    </View >
    );
  }
}

const styles = StyleSheet.create({

    formHeading: {
        color: 'black',
        padding: 20,
        fontSize: 25,
    },
    viewStyle: {
        flex: 1,
    },
    listStyle: {
        flex: 1,
        width: "90%",
        padding: 10,
        borderWidth: 0.5,
        borderColor: 'grey',
    },
});

export default EventsHome;
