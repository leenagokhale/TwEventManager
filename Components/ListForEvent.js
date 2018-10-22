import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, Button, Linking} from 'react-native';
import firebase from '../Config/FireBaseConfig'
//We have put firebase apiKey related details in a seperate file. 
//That file is not put on git. 

import { writeFile, DocumentDirectoryPath } from 'react-native-fs';
import XLSX from 'xlsx';
import Mailer from 'react-native-mail';

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
            attendanceData: []
        }
    }

    actualSave = (mydata) => {

        console.log("In actual save");
        console.log(mydata);

        const ws = XLSX.utils.aoa_to_sheet(mydata);

        console.log("AT file write")
        /* build new workbook */
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");

        /* write file */
        const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});

        //DDP for emulator saves in emulator path. We need to test on actual device.
        //for Emulator I have given fixed path. Change this with DDP compile test on actual device
        //const file = DDP + "sheetjsw.xlsx"; 
       const file = "//Users//in-leenag//Development//React-Native//TwEventManager//twsheetjsw.xlsx";
        console.log("Just before writing ", mydata);

        writeFile(file, output(wbout), 'ascii').then((res) =>{
                Alert.alert("exportFile success", "Exported to " + file);
        }).catch((err) => { Alert.alert("exportFile Error", "Error " + err.message); });


    }
    
    exportToExcel = () => {

        console.log("In export to excel");

        //get array of registrations ID from json
        regIDs = this.state.data.map(function (obj) {
        return obj._key;
        });
        //console.log(regIDs);

        var names = [["Name", "Email", "Mobile", "Employer", "Job Title", "Date", "Notify Job", "Notify Tech", "Notify News"]];
        var promises = [];

        // Map the Firebase promises into an array. This is V imp or else 
        // right data won't go to saving of file.
        promises = regIDs.map(id => {
            return firebase.database().ref('registrations/' + id)
            .once('value', (s) => {
                //console.log(s.val().name)
                s.val()
                })
        })
        //once the promises are ready, now make an array of arrays that is needed
        //for excel saving.
        Promise.all(promises)
        .then(results => {
            results.forEach((snapshot) => {
                const Name = [
                            snapshot.val().name , 
                            snapshot.val().email,
                            snapshot.val().mobile,
                            snapshot.val().employer,
                            snapshot.val().jobTitle,
                            snapshot.val().regDate,
                            snapshot.val().notiJob,
                            snapshot.val().notiTech,
                            snapshot.val().notiNews
                        ];
                names.push(Name);
            }) ;
            console.log('Names: ' + names[1])
            this.actualSave(names);

        })
        .catch(err => {
              // handle error
              console.log(err)
            })
    
    }


    sendEmail = () => {

        // Alert.alert("In send email");
       Linking.openURL('https://mail.google.com/') 


      // you need to be on actual device with apple's email app configured.
      // for using react-native-mail. https://github.com/chirag04/react-native-mail/issues/69
      // for now the code is commented but uncomment it to test
      /*
      Mailer.mail({
        subject: 'Attendance ',
        recipients: ['gokhale.leena@gmail.com'],
        ccRecipients: ['gokhale.leena@gmail.com'],
        bccRecipients: ['gokhale.leena@gmail.com'],
        body: '<b>Attendance for Event</b>',
        isHTML: true,
        attachment: {
          path: '',  // The absolute path of the file from which to read data.
          type: '',   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
          name: '',   // Optional: Custom filename for attachment
        }
      }, (error, event) => {
        Alert.alert(
          error,
          event,
          [
            {text: 'Ok', onPress: () => console.log('OK: Email Error Response')},
            {text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response')}
          ],
          { cancelable: true }
        )
      }); */

        
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
                    title="Send Email"
                        onPress={() => this.sendEmail()}
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