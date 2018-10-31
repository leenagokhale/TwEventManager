import React, { Component } from 'react';
import { Alert } from 'react-native';

import XLSX from 'xlsx';
import { writeFile, DocumentDirectoryPath } from 'react-native-fs';
const output = str => str;
const DDP = DocumentDirectoryPath + "/";

import Mailer from 'react-native-mail';

class SaveFile extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    toDevice = (mydata, filnameNospaces) => {
        const ws = XLSX.utils.aoa_to_sheet(mydata);

        /* build new workbook */
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");

        /* write file */
        const wbout = XLSX.write(wb, { type: 'binary', bookType: "xls" });
        console.log("file name : " + filnameNospaces);

        /* DDP for emulator saves in emulator path. While testing on emulator I have project directory path */
        //const file = "//Users//in-leenag//Development//React-Native//TwEventManager//" + filnameNospaces;

        /* On actual device, file will be saved in "Documents" directory under every app (sandbox structure in iOS) */
        const file = DDP + filnameNospaces;

        writeFile(file, output(wbout), 'ascii').then((res) => {
            Alert.alert("exportFile success", "Exported to " + file);
        }).catch((err) => { Alert.alert("exportFile Error", "Error " + err.message); });
    }


    toEmail = (eventName) => {

        // you need to be on actual device with apple's email app configured.
        // for using react-native-mail. https://github.com/chirag04/react-native-mail/issues/69
        // for now the code is commented but uncomment it to test
        Mailer.mail({
            subject: 'Attendance data for event - ' + eventName,
            recipients: ['twevents.attendance@gmail.com'],
            body: '<b>Please find details of participants who attendeded the event in .xls format</b>',
            isHTML: true,
            attachment: {
                path: DDP + "tw-event-" + eventName.replace(/\s/g, "") + ".xls",  // The absolute path of the file from which to read data. 
                type: "xls",   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
                name: "tw-event-" + eventName.replace(/\s/g, "") + ".xls",   // Optional: Custom filename for attachment
            }
        }, (error, event) => {
            Alert.alert(
                (error != null ? error + ' - Is your email setup on this device?' : error),
                event,
                [
                    { text: 'Ok', onPress: () => console.log('OK: Email Error Response') },
                ],
                { cancelable: true }
            )
        });

    }
}

export default SaveFile;