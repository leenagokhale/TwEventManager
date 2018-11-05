import firebase from '../Config/FireBaseConfig'

class FirebaseStore {

  saveEventData = async (txteventName, txtDesc, txtDateTime) => {
    await fetch('https://tweventattendance-db.firebaseio.com//events.json', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "eventName": txteventName,
        "eventDesc": txtDesc,
        "eventTiming": txtDateTime
      }),
    })
      .catch((error) => {
        console.log(error);
      })
    console.log("Inside fetch block");
  }

    saveAttendanceData = (txtEventName, attndData) => {
  
    newRef = firebase.database().ref().child('registrations').push(attndData);

    const newID = newRef.key; //fireBase generated key to save unders events
    eventsRef = firebase.database().ref().child('events');
    eventsRef.once('value', (snap) => {
      //console.log(snap.val())
      snap.forEach((child) => {
        console.log(child.val().eventName)
        if (child.val().eventName.localeCompare(txtEventName) === 0) {
          //append eventName key to events node. set it to participants's name.
          //update will not add fireBase generated uique key. 
          eventsRef.child(child.key + '/registrations').update({ [newID]: attndData.name });
        }
      });
    });

  }
}

export default FirebaseStore;