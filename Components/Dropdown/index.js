import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Picker, ScrollView, View, Text } from 'react-native';
import SmartPicker from './SmartPicker';

class Dropdown extends Component {
    render() {
        const { onValueChange, placeholder, selectedValue, data } = this.props;

        const cleanData = data.map(item => ({
            label: item.label.toString(),
            value: item.value,
        }));

        const selected = selectedValue
            ? _.get(_.find(data, item => item.value === selectedValue), 'label')
            : ' ';

        return (
            <ScrollView>
                <View style={{ width: '100%' }}>
                    <ScrollView style={{ width: '100%' }}>
                        <SmartPicker
                            selectedValue={selected}
                            value={selected}
                            label={placeholder}
                            onValueChange={label =>
                                onValueChange(
                                    _.find(
                                        data,
                                        item => item.label.toString() === label.toString(),
                                    ).value,
                                )
                            }
                        >
                            {cleanData.map((item, index) => (
                                <Picker.Item
                                    key={index}
                                    label={`${item.label}`}
                                    value={item.label}
                                />
                            ))}
                        </SmartPicker>
                    </ScrollView>
                </View>
            </ScrollView>
        );
    }
}

Dropdown.propTypes = {
    placeholder: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.any),
    selectedValue: PropTypes.any,
    onValueChange: PropTypes.func.isRequired,
};

Dropdown.defaultProps = {
    placeholder: null,
    data: [],
    selectedValue: null,
    width: '100%',
};

export default Dropdown;