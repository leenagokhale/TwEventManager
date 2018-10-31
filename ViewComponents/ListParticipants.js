import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

class ListParticipants extends Component {
    constructor(props) {
        super(props);
    }

    onItemClick(txtItem) {
        this.props.getItem(txtItem);
    }

    Render_FlatList_Sticky_header = () => {
        var Sticky_header_View = (
            <View style={styles.header_style}>
                <Text style={{ textAlign: 'center', fontSize: 15 }}> Click on participant's name to see details </Text>
            </View>
        );
        return Sticky_header_View;
    };

    FlatListItemSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#607D8B",
                }} />
        );
    }

    ListEmptyView = () => {
        return (
            <View style={{ flex: 1 }}>
                <Text style={{ textAlign: 'center' }}> Sorry, No registrations Present For this Event...</Text>
            </View>

        );
    }

    render() {
        const { data, getItem } = this.props;
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>

                {data.length > 0 ?
                    <FlatList style={styles.listStyle}
                        marginBottom={10}
                        data={data}
                        ItemSeparatorComponent={this.FlatListItemSeparator}
                        renderItem={({ item }) => <Text style={{ padding: 6 }} onPress={() => this.onItemClick(item.name)} > {item.name} </Text>}
                        keyExtractor={(item, index) => index.toString()}
                    // ListHeaderComponent={this.Render_FlatList_Sticky_header}
                    // stickyHeaderIndices={[0]}
                    />
                    :
                    <FlatList style={styles.listStyle}
                        marginBottom={10}
                        data={[]}
                        ListEmptyComponent={this.ListEmptyView} />}
            </View>);
    }
}

const styles = StyleSheet.create({
    listStyle: {
        flex: 1,
        //width: "90%",
        width: 500,
        padding: 10,
        borderWidth: 0.5,
        borderColor: 'grey',
    },
    header_style: {
        width: '100%',
        fontSize: 12,
        height: 30,
        backgroundColor: 'lightgrey',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default ListParticipants;