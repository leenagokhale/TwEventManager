import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, Button} from 'react-native';
import firebase from '../Config/FireBaseConfig'
//We have put firebase apiKey related details in a seperate file. 
//That file is not put on git. 

import { writeFile, DocumentDirectoryPath } from 'react-native-fs';
import XLSX from 'xlsx'

const output = str => str;
const DDP = DocumentDirectoryPath + "/";

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

    exportToExcel = () => {

        console.log("In export to excel")
        let dtlParticipantData =[]; //fill this array with all participant details to send to excel

        this.state.data.forEach((participant) => {
           
            tmp = 'registrations/' + participant._key;
            eventRegRef = firebase.database().ref().child(tmp);
        
            eventRegRef.once('value', (snap) => {
                
                let dtlEntry = [
                    snap.val().name,
                    snap.val().email,
                    snap.val().mobile,
                    snap.val().employer,
                    snap.val().jobTitle,
                    snap.val().regDate,
                    snap.val().notiJob,
                    snap.val().notiTech,
                    snap.val().notiNews];

                dtlParticipantData.push(dtlEntry); });
        });

        console.log(dtlParticipantData);

        // To Do: Now push this data to excel file.
        // const wb = XLSX.utils.book_new()
        // const wsAll = XLSX.utils.aoa_to_sheet(dtlParticipantData)
        
        // XLSX.utils.book_append_sheet(wb, wsAll, "Attendance for TW event")
        // XLSX.writeFile(wb, "tw-export-demo.xlsx")



        /* original data */
        // var data1 = [
        //     {"name":"John", "city": "Seattle"},
        //     {"name":"Mike", "city": "Los Angeles"},
        //     {"name":"Zach", "city": "New York"}
        // ];

        
        // var data1 = [["John", "Seattle"]];
        // /* this line is only needed if you are not adding a script tag reference */
        // //if(typeof XLSX == 'undefined') XLSX = require('xlsx');

        // /* make the worksheet */
        // //var ws = XLSX.utils.json_to_sheet(data1);
        // var ws = XLSX.utils.aoa_to_sheet(data1);

        // /* add to workbook */
        // var wb = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(wb, ws, "People");

        // /* generate an XLSX file */
        // XLSX.writeFile(wb, "mysheetjs.xlsx");

        let data2=[[1,2,3],[4,5,6]];
        /* convert AOA back to worksheet */
        const ws = XLSX.utils.aoa_to_sheet(data2);

        /* build new workbook */
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");

        /* write file */
        const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});
        const file = DDP + "sheetjsw.xlsx";
        writeFile(file, output(wbout), 'ascii').then((res) =>{
                Alert.alert("exportFile success", "Exported to " + file);
        }).catch((err) => { Alert.alert("exportFile Error", "Error " + err.message); });
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
                            // email: child.val().email
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
                    <Text style={styles.formHeading}>Participants Present for</Text>
                    {/* <Text>eventID: {this.state.eventID}</Text> */}
                    <Text style={{fontSize:18}}>{JSON.stringify(this.state.eventName)}</Text>
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
                            // ListHeaderComponent={this.Render_FlatList_Sticky_header}
                            // stickyHeaderIndices={[0]}
                        />
                        :
                        <FlatList style={styles.listStyle}
                            marginBottom={10}
                            data={[]}
                            ListEmptyComponent={this.ListEmptyView} /> }
                </View>

                <Button
                    title="Save (Excel Format)"
                        onPress={() => this.exportToExcel()}
                    />   

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
        padding: 5,
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