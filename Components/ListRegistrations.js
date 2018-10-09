import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import firebase from '../Config/FireBaseConfig'

//We have put firebase apiKey related details in a seperate file. 
//That file is not put on git. 

export default class ListRegistrations extends Component {

    constructor(props) {
        super(props);

    this.itemsRef = firebase.database().ref().child('registrations');

    this.state = {
            data: []
        }
    }

    /*
    listenForItems uses fireBase suported API to get data snapshot.
    It is easier to traverse through database using fireBase API.
    So currently using this.
    */ 

    listenForItems = (itemsRef)=> {
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
        fetchData is currently not called. (do not delete. keep as reference)
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
       // this.fetchData();  //- uses fetch API
       this.listenForItems(this.itemsRef); //Uses fireBase API. easier to traverse
    }

    renderItem({ item, index }) {
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.item}>{item.name} - </Text>
                <Text style={styles.subItem}>{item.email},</Text>
                <Text style={styles.subItem}>{item.mobile}</Text>
            </View>
        );
    }

    render() {
        return (
            <View >
                <Text style={styles.formHeading}>View Registrations</Text>
                <Text>Event Name Here drop down</Text>
                <FlatList
                    data={this.state.data}
                    //keyExtractor={(x, i) => i}
                    renderItem={this.renderItem}
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
    item: {
        padding: 5,
        fontSize: 18,
        height: 40,
    },

    subItem: {
        padding: 7,
        fontSize: 15,
        //    height: 20,
    }
});