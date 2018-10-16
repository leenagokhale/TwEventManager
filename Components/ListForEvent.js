import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, Button} from 'react-native';
import firebase from '../Config/FireBaseConfig'

//We have put firebase apiKey related details in a seperate file. 
//That file is not put on git. 

export default class ListRegistrations extends Component {

    constructor(props) {
        super(props);

        this.itemsRef = firebase.database().ref().child('registrations');

        this.state = {
            eventID: '',
            eventName: '',
            registrationsCount: 0,
            data: [],
        }
    }

    getParticipantsForEvent = (txtEventID) => {

        tmp = 'events/' + [txtEventID] + '/registrations';
        console.log("Inside getParticipantsForEvent" + tmp);
        eventRegRef = firebase.database().ref().child(tmp);
        eventRegRef.on('value', (snap) => {

            if (snap.val() == null){
                console.log("No registered participants for the event!")
                this.setState({registrationsCount: 0,
                    data: []});
            }
            else
                {
                    let itemsReg = [];
                    let temp =0;

                    snap.forEach((child) => {
                        temp++;
                        itemsReg.push({
                            name: child.val(),
                            _key: child.key,
                             email: child.val().email
                        });
                    });
                   
                    //console.log(itemsReg);
                    this.setState({
                        registrationsCount: temp,
                        data: itemsReg}, console.log(this.state.data));
                }
            });
    }

    componentDidMount() {
        const { navigation } = this.props;
        const txtEventID = navigation.getParam('eventID', '');
        const txtEventName = navigation.getParam('eventName', '');
        console.log("In Mount..." + txtEventID + txtEventName);

        this.setState({
            eventID: txtEventID,
            eventName: txtEventName
        }, this.getParticipantsForEvent(txtEventID));
    }

  
    GetItem(txtMsg) {
        Alert.alert(txtMsg);
        // Add code here to display participant details.
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

    Render_FlatList_Sticky_header = () => {
 
        var Sticky_header_View = (
        <View style={styles.header_style}>
          <Text style={{textAlign: 'center', fontSize: 15}}> Click on participant's name to see details </Text>
        </View>
        );
        return Sticky_header_View;
      };

      ListEmptyView = () => {
        return (
          <View style={{flex:1}}>
            <Text style={{textAlign: 'center'}}> Sorry, No registrations Present For this Event...</Text>
          </View>
     
        );
      }

    render() {

        return (
            <View style={styles.viewStyle}>
                <View style={{alignItems:'center'}}>
                    <Text style={styles.formHeading}>View Registrations</Text>
                    {/* <Text>eventID: {this.state.eventID}</Text> */}
                    <Text style={{fontSize:18}}>Event - {this.state.eventName}</Text>
                    <Text></Text>
                    <Text></Text>
                </View>

                <View style={{flex:1, alignItems:'center'}}>
               
                    <View style={{padding: 12, alignItems:'center', backgroundColor: 'steelblue'}}>
                        <Text>Registrations Count - {this.state.registrationsCount}</Text>
                    </View>
                
                    {this.state.registrationsCount > 0 ?  
                        <FlatList style={styles.listStyle}
                            marginBottom={10}
                            data={this.state.data}
                            //extraData={this.state.selectedEvent}
                            ItemSeparatorComponent = {this.FlatListItemSeparator}
                            renderItem={({item}) => <Text style={{padding:6}}onPress={this.GetItem.bind(this, item.name)} > {item.name} </Text>}
                            keyExtractor={(item, index) => index.toString()}
                            ListHeaderComponent={this.Render_FlatList_Sticky_header}
                            stickyHeaderIndices={[0]}
                        />
                        :
                        <FlatList style={styles.listStyle}
                            marginBottom={10}
                            data={[]}
                            ListEmptyComponent={this.ListEmptyView} /> }
                </View>

                <Button
                    title="Go to Home"
                    onPress={() => this.props.navigation.navigate('EventsHome')}
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
    
    header_style:{
        width: '100%', 
        fontSize:12,
        height: 30, 
       backgroundColor: 'lightgrey', 
        alignItems: 'center', 
        justifyContent: 'center'
      }

});