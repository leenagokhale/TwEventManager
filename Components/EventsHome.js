import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Alert, TouchableOpacity} from 'react-native';
import firebase from '../Config/FireBaseConfig'
import Icon from 'react-native-vector-icons/Ionicons';

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

render() {
    return (
    <View View style={styles.viewStyle}>
        <View style={{flex:1, alignItems:'center'}}> 

            <View style={{alignItems:'center'}}>
                <Text style={styles.formHeading}>External Events Orgnization</Text>
            </View>
            <Text></Text>
            {/* <Text></Text> */}
            <FlatList style={styles.listStyle}
                marginBottom={10}
                data={this.state.eventList}
                // extraData={this.state.selectedEvent}
                ItemSeparatorComponent = {this.FlatListItemSeparator}
                renderItem={({item}) =>
                    (
                        <View style={{flex:1, flexDirection:"row"}}>
                            <Text style={{padding:6, width:"60%"}} > {item.eventName} </Text>
                            
                            <View style={{flex:1, flexDirection:"row", padding:5}}>
                                <TouchableOpacity
                                    style={styles.registerButton}
                                    onPress={ 
                                    () => this.props.navigation.navigate('RegisterForEvent',
                                    {eventID:item._key ,eventName:item.eventName})}>
                                    <Text style={styles.listButtonText}>Register</Text>
                                </TouchableOpacity>
                                 <Text>    </Text>           
                                <TouchableOpacity
                                    style={styles.viewButton}
                                    onPress={ 
                                    () => this.props.navigation.navigate('ListForEvent',
                                    {eventID:item._key ,eventName:item.eventName})}>
                                    {/* <Text style={styles.listButtonText}>View</Text> */}
                                    {/* <Icon name="list" size={20} /> */}
                                    <Icon name="ios-list" color='blue' size={20} />
                                </TouchableOpacity>
                            </View>

                        </View>)}    
                keyExtractor={(item, index) => index.toString()}
            />
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
        padding: 5,
        fontSize: 25,
    },
    buttonInList:{
       // width: 50,
        textAlign: 'center',
        backgroundColor:'red',
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
    registerButton: {
        backgroundColor: 'steelblue',
        alignItems: 'center',
        padding: 7,
        //margin: 15,
        height: 30,
        borderRadius: 10
      },
      viewButton:{
        backgroundColor: 'powderblue',
        alignItems: 'center',
        padding: 5,
        height: 30,
        borderRadius: 10
      },
      listButtonText: {
        color: 'white',
        fontSize: 12
      },

});

export default EventsHome;
