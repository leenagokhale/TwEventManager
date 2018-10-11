import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, Picker, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import firebase from '../Config/FireBaseConfig'
import { Button } from 'react-native-elements';

//We have put firebase apiKey related details in a seperate file. 
//That file is not put on git. 

export default class ListRegistrations extends Component {

    constructor(props) {
        super(props);

        this.itemsRef = firebase.database().ref().child('registrations');

        this.state = {
            selectedEvent: '',
            registrationsCount: 0,
            eventList: [],
            data: [],
           // dummyItems: [{name:'Item1'}, {name:'Item2'}]

        }
    }

    /* 
        fetchData() is currently not called. (do not delete. keep as reference)
       For learning purpose, we tried fetching values directly by using GET request
       this used fetch API by mozilla. This works sucessfully.
    */

    fetchData = async () => {
        const response = await fetch('https://tweventmanager-db.firebaseio.com//registrations.json', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        });
        const json = await response.json();
        let arrayData = Object.entries(json).map(item => ({ ...item[1], key: item[0] }));
        this.setState({
            data: [...this.state.data, ...arrayData]
        });
    };

    /*
listenForItems uses fireBase suported API to get data snapshot.
It is easier to traverse through database using fireBase API.
So currently using this.
*/
    listenForItems = (itemsRef) => {
        itemsRef.on('value', (snap) => {

            // get children as an array
            var arrayItems1 = [];
            snap.forEach((child) => {

                arrayItems1.push({
                    name: child.val().name,
                    _key: child.key,
                    email: child.val().email,
                    mobile: child.val().mobile
                });
            });
            //console.log(items)
            this.setState({
                data: [...this.state.data, ...arrayItems1]
            });
        });
    }

    updateEvent = (eventName) => {
       // console.log(eventName);
       //this.setState({ dummyItems: [] })
        this.setState({ selectedEvent: eventName });
        this.getParticipantsForEvent(eventName);
    }

   

    getParticipantsForEvent = (txtEventID) => {

        //console.log(this.state.data);
        eventRegRef = firebase.database().ref().child('events/' + [txtEventID] + '/registrations');
        eventRegRef.once('value', (snap) => {

            if (snap.val() == null){
                this.setState({registrationsCount: 0});
                this.setState({data: [this.state.data.length, 0]});

                console.log("No registered participants for the event!")
            }
            else
                {
                    var itemsReg = [];
                    var temp =0;
            
                    //const temp = snap.getChildrenCount();
                    //this.state.data.length  = 0; 
                    snap.forEach((child) => {
                        temp++;
                        itemsReg.push({
                            name: child.val()
                        });
                    // For now we will not iterate through registrations node. 
                    //
                    // //iterate registrations node for ID
                    // refReg = this.itemsRef.child(child.key);
                    // refReg.once('value', (snap2) => {
                    //    // console.log(snap2.val().name + snap2.val().email + snap2.val().mobile);
                    //     //put these in state to display in flatList.
                    //     // directly writing to state is not correct. But setState in not working correctly.
                    //     // so forced to do it.
                    //    this.state.data.push({
                    //         name: snap2.val().name,
                    //         _key: child.key,
                    //         email: snap2.val().email,
                    //         mobile: snap2.val().mobile
                    //     });
                    // });
                    });
                    //console.log(itemsReg);

                    this.setState({registrationsCount: temp});
                    this.setState({data: [...this.state.data, ...itemsReg]});
                }
            });
    }

    loadEvents = (myref) => {
        myref.on('value', (snap) => {
            var items = [];
            // get children as an array
            snap.forEach((child) => {

                //set default selection for picker. First item in event list
                if (this.state.selectedEvent === '')
                    this.setState({ selectedEvent: child.key })

                items.push({
                    eventName: child.val().eventName,
                    _key: child.key,
                });
            });

            console.log(items)
            this.setState({
                eventList: [...this.state.eventList, ...items]
            });
        });

    }

    componentDidMount() {
        console.log("In Mount");
        this.loadEvents(firebase.database().ref().child('events'));

        // this.fetchData();  //- uses fetch API
        // this.listenForItems(this.itemsRef); //Uses fireBase API. easier to traverse

       // console.log(this.state.selectedEvent);
        this.getParticipantsForEvent(this.state.selectedEvent);
    }

    renderItem({ item, index }) {
        return (
            <View style={styles.separator}>
                <Text style={styles.item}>{item.name}</Text>
                {/* <Text style={styles.subItem}>{item.email} )</Text> */}
            </View>
        );
    }

    GetItem(txtMsg) {
        Alert.alert(txtMsg);
        // Add code here to display participant details.
    }

    renderNewItem({ item, index }) {
        return (
            <TouchableOpacity 
            onPress={this.GetItem.bind(this, item.name)}>
          <View
              style={{ flex: 1, padding:3 }}>
            <Text>{item.name}</Text>
          </View>
        </TouchableOpacity>
        );
    }


    displayPickerItems = (events) => {
        return events.map((data) => {
            return (
                <Picker.Item label={data.eventName}
                    value={data._key}
                    key={data._key} />)
        })
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
                <Text style={styles.formHeading}>View Registrations</Text>

                <Picker
                    style={styles.eventPicker} itemStyle={styles.eventPickerItem}
                    mode="dropdown"
                    selectedValue={this.state.selectedEvent} onValueChange={this.updateEvent}>
                    {this.displayPickerItems(this.state.eventList)}
                </Picker>

                <Text></Text>
                <Text>Registrations Count - {this.state.registrationsCount}</Text>
                <Text></Text>
                {this.state.registrationsCount > 0 ?  
                <FlatList style={styles.listStyle}
                    marginBottom={10}
                    data={this.state.data}
                    // extraData={this.state.selectedEvent}
                    // renderItem={this.renderNewItem}
                    ItemSeparatorComponent = {this.FlatListItemSeparator}
                    renderItem={({item}) => <Text style={{padding:6}}onPress={this.GetItem.bind(this, item.name)} > {item.name} </Text>}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={this.Render_FlatList_Sticky_header}
                    stickyHeaderIndices={[0]}
                    // ListEmptyComponent={this.ListEmptyView}
                />
                :
                <FlatList style={styles.listStyle}
                    marginBottom={10}
                    data={[]}
                   // renderItem={({item}) => <Text style={{padding:6}}onPress={this.GetItem.bind(this, item.name)} > {item.name} </Text>}
                    ListEmptyComponent={this.ListEmptyView} /> }
                
                <Text>Event ID - {this.state.selectedEvent}</Text>
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
        // marginBottom: 20, 
        //alignContent: 'center',
        justifyContent: 'center',
    },

    listStyle: {
        flex: 1,
        padding: 10,
        height: 100,
        borderWidth: 0.5,
        borderColor: 'grey',
        //backgroundColor: '#FFF0E0',
        //width : "90%",
        //left:10,
      //  position:"absolute",
    },
    separator: {
        //flex:1, 
        flexDirection: 'row',
        alignContent: 'center',
        //justifyContent: 'center',
        //  borderWidth: 0.5,
        //  borderColor: 'grey',
    },
    item: {
        padding: 5,
        fontSize: 15,
        //   height: 30,
    },
    subItem: {
        padding: 5,
        fontSize: 15,
        //    height: 20,
    },
    eventPicker: {
        // width: 200,
        height: 100,
        // backgroundColor: '#FFF0E0',
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 14,
    },
    eventPickerItem: {
        height: 100,
        fontSize: 15
    },
    header_style:{
        width: '100%', 
        //fontSize:12,
        height: 35, 
        backgroundColor: '#00BCD4', 
        alignItems: 'center', 
        justifyContent: 'center'
       
      }

});