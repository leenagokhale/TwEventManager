import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

class ListEvents extends Component {
    constructor(props) {
        super(props);
    }

    onAttendanceClick(eventID, eventName) {
        this.props.onAttendanceClick(eventID, eventName);
    }

    onListAttendanceClick(eventID, eventName) {
        this.props.onListAttendanceClick(eventID, eventName);
    }

    removeEventHandler(txtEventID) {
        this.props.removeEventHandler(txtEventID);
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
        const { data, onAttendanceClick, onListAttendanceClick, removeEventHandler } = this.props;
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <FlatList style={styles.listStyle}
                    marginBottom={10}
                    data={data}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={({ item }) =>
                        (
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <Text style={{ padding: 6, width: "52%", fontSize: 20 }} > {item.eventName} </Text>

                                <View style={{ flex: 1, flexDirection: "row", padding: 5 }}>
                                    <TouchableOpacity
                                        style={styles.registerButton}
                                        onPress={
                                            () => this.onAttendanceClick(item._key, item.eventName)}>
                                        <Text style={styles.listButtonText}>Attendance:{item.regCnt}</Text>
                                    </TouchableOpacity>
                                    <Text> </Text>
                                    <TouchableOpacity
                                        style={styles.viewButton}
                                        onPress={
                                            () => this.onListAttendanceClick(item._key, item.eventName)}>
                                        <Icon name="ios-list-box" color='royalblue' size={26} style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                        </Icon>
                                    </TouchableOpacity>
                                    <Text></Text>
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={
                                            () => this.removeEventHandler(item._key)} >
                                        <Icon name="ios-remove-circle" color='maroon' size={26} style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                        </Icon>
                                    </TouchableOpacity>
                                </View>
                            </View>)}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>);
    }
}

const styles = StyleSheet.create({
    listStyle: {
        flex: 1,
        width: 700,
        padding: 10,
        borderWidth: 0.5,
        borderColor: 'grey',
    },
    registerButton: {
        backgroundColor: 'steelblue',
        padding: 7,
        height: 30,
        width: 100,
        borderRadius: 10
    },
    viewButton: {
        alignItems: 'center',
        padding: 5,
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
    removeButton: {
        alignItems: 'center',
        padding: 5,
    },

});

export default ListEvents;