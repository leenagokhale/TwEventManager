import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class Heading extends Component {
    render() {
        const { title, subtitle } = this.props;
        return (
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.titleHeading}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    titleHeading: {
        color: 'black',
        padding: 5,
        fontSize: 25
    },
    subtitle: {
        fontSize: 18
    }
}
);

export default Heading;