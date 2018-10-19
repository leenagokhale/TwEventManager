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
    console.log("In laod Events");
    myref.on('value', (snap) => {

        let items = []; items.length=0;
        // get children as an array
        snap.forEach((childEvent) => {
            
            //below code is to get no of participants for each event
            let cnt = 0;
            regRef = myref.child(childEvent.key).child('registrations');
            regRef.once('value', (snap2) => {
                cnt = snap2.numChildren();
                console.log("Children : " + cnt);
            }); //
           
            items.push({
                eventName: childEvent.val().eventName,
                _key: childEvent.key,
                regCnt : cnt
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
    this.loadEvents(firebase.database().ref().child('events'));
}

removeFromFireBase = (myref)=>{
    myref.remove(function(error) {
            console.log(error ? "Uh oh, failed to delete!" : "Event deleted!")});
}

removeEventHandler = (txtEventID) =>{

    //console.log("In remove " +  txtEventID);
    temp = firebase.database().ref().child('events').child(txtEventID);

    //chk if there are any registrations under this event..
    // to give warning to user before deletion
    regRef = temp.child('registrations');
    regRef.once('value', (snap) => {

        if (snap.val() != null){ //delete comfirmation for event with registration 
            Alert.alert( 
                'Delete Confirmation',
                'Attendance already marked for this event..\n Do u still want to delete this event?',
                [
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: 'OK', onPress: () => this.removeFromFireBase(temp)},
                ],
                { cancelable: false }
              );
        }
        else //delete comfirmation for events without any registration 
        {
            Alert.alert(
                'Delete Confirmation',
                'Do u want to delete this event?',
                [
                  {text: 'Cancel', onPress: () => console.log('no registrations Cancel Pressed'), style: 'cancel'},
                  {text: 'OK', onPress: () => this.removeFromFireBase(temp)},
                ],
                { cancelable: false }
              );
        }
    });
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
                <Text style={styles.formHeading}>Event Attendance</Text>
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
                            <Text style={{padding:6, width:"55%"}} > {item.eventName} </Text>
                            
                            <View style={{flex:1, flexDirection:"row", padding:5}}>
                                <TouchableOpacity
                                    style={styles.registerButton}
                                    onPress={ 
                                    () => this.props.navigation.navigate('RegisterForEvent',
                                    {eventID:item._key ,eventName:item.eventName})}>
                                    <Text style={styles.listButtonText}>Attendance:{item.regCnt}</Text>
                                </TouchableOpacity>
                                 {/* <Text> </Text>            */}
                                <TouchableOpacity
                                    style={styles.viewButton}
                                    onPress={ 
                                    () => this.props.navigation.navigate('ListForEvent',
                                    {eventID:item._key ,eventName:item.eventName})}>
                                    {/* <Text style={styles.listButtonText}>View</Text> */}
                                    <Icon name="ios-list-box" color='royalblue' size={22} style={{justifyContent:'center',alignItems:'center',flex:1}}>
                                        {/* <Text style={styles.viewButtonText}> View</Text> */}
                                    </Icon>       
                                </TouchableOpacity>
                                {/* <Text></Text>            */}
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={ ()=> this.removeEventHandler(item._key)}>
                                    <Icon name="ios-remove-circle" color='maroon' size={22} style={{justifyContent:'center',alignItems:'center',flex:1}}>
                                        {/* <Text style={styles.viewButtonText}> View</Text> */}
                                    </Icon>       
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
        //backgroundColor: 'powderblue',
        alignItems: 'center',
        padding: 5,
        height: 30,
        borderRadius: 10
      },
      listButtonText: {
        color: 'white',
        fontSize: 12
      },

      viewButtonText: {
        color: 'white',
        fontSize: 12,
        padding: 5
      },
      removeButton:{
        //backgroundColor: 'powderblue',
        alignItems: 'center',
        padding: 5,
        height: 30,
        borderRadius: 10
      },
});

export default EventsHome;
