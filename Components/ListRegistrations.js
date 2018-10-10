import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, Picker } from 'react-native';
import firebase from '../Config/FireBaseConfig'

//We have put firebase apiKey related details in a seperate file. 
//That file is not put on git. 

export default class ListRegistrations extends Component {

    constructor(props) {
        super(props);

        this.itemsRef = firebase.database().ref().child('registrations');

        this.state = {
            selectedEvent: '',
            eventList: [],
            data: []
        }
    }

    updateEvent = (eventName) => {
        this.setState({ selectedEvent: eventName })
    }

    loadEvents = (myref) => {
        myref.on('value', (snap) => {
        var items = [];
            // get children as an array
            snap.forEach((child) => {
                
                //set default selection for picker. First item in event list
                if (this.state.selectedEvent === '')
                 this.setState({ selectedEvent: child.val().eventName })
                 
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

    displayPickerItems = (events) => {
        return events.map((data) => { return (<Picker.Item label={data.eventName} value={data.eventName} key={data.eventName} />) })
    }

    /*
    listenForItems uses fireBase suported API to get data snapshot.
    It is easier to traverse through database using fireBase API.
    So currently using this.
    */

    listenForItems = (itemsRef) => {
        itemsRef.on('value', (snap) => {

            // get children as an array
            var items = [];
            snap.forEach((child) => {

                items.push({
                    name: child.val().name,
                    _key: child.key,
                    email: child.val().email,
                    mobile: child.val().mobile
                });
            });
            //console.log(items)
            this.setState({
                data: [...this.state.data, ...items]
            });

        });
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

    componentDidMount() {

        this.loadEvents(firebase.database().ref().child('events'));

        // this.fetchData();  //- uses fetch API
        this.listenForItems(this.itemsRef); //Uses fireBase API. easier to traverse


    }

    renderItem({ item, index }) {
        return (
            <View style={styles.separator}>
                <Text style={styles.item}>{item.name} (</Text>
                {<Text style={styles.subItem}>{item.email} )</Text>
               /* <Text style={styles.subItem}>{item.mobile}</Text> */}
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

                { <FlatList style={styles.listStyle}
                    marginBottom={5}
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />}

                <Text>{this.state.selectedEvent}</Text>
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
        alignContent: 'center',
        justifyContent: 'center'
    },
    listStyle: {
        flex: 1,
        padding: 10,
        borderWidth: 0.5,
        borderColor: 'grey',
    },
    separator: {
        //flex:1, 
        flexDirection: 'row',
        alignContent: 'center',
        //justifyContent: 'center',
       // borderWidth: 0.5,
       // borderColor: 'grey',
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

});