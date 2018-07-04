import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, Picker, Platform, StyleSheet } from 'react-native';
import ToggleBox from './ToggleBox';
import styles from './styles.js';

class TogglePicker extends Component {
    state = {};

    renderPicker = () => (
        <Picker
            selectedValue={this.props.selectedValue}
            onValueChange={(value) => {
                this.props.onValueChange(value);
                if (this.state.toggle) this.state.toggle();
            }}
            style={
                Platform.OS === 'ios'
                    ? [styles.iosPicker, this.props.iosPickerStyle]
                    : [styles.androidPicker, this.props.androidPickerStyle]
            }
        >
            {this.props.children}
        </Picker>
    );

    renderIos = () => (
        <ToggleBox
            label={this.props.label}
            value={this.props.value}
            getToggle={toggle => this.setState({ toggle })}
            style={StyleSheet.flatten([styles.toggleBox, this.props.iosBoxStyle])}
        >
            <View style={this.props.iosPickerWrapperStyle}>
                {this.renderPicker()}
            </View>
        </ToggleBox>
    );

    renderAndroid = () => (
        <View style={[styles.androidBoxStyle, this.props.androidBoxStyle]}>
            <Text>{this.props.label}</Text>
            <View
                style={StyleSheet.flatten([
                    styles.androidPickerWrapper,
                    this.props.androidPickerWrapper,
                ])}
            >
                {this.renderPicker()}
            </View>
        </View>
    );

    render() {
        return Platform.OS === 'ios' ? this.renderIos() : this.renderAndroid();
    }
}


export default TogglePicker;