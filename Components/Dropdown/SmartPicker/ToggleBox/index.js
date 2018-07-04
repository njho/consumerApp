import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableWithoutFeedback, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles.js';

class ToggleBox extends Component {
    constructor(props) {
        super(props);

        this.icons = {
            up: this.props.arrowUpType,
            down: this.props.arrowDownType,
        };

        this.state = {
            expanded: this.props.expanded,
        };
    }

    componentDidMount = () => {
        this.props.getToggle(this.externalToggle);
    };

    setMaxHeight = (event) => {
        if (!this.state.maxHeight) {
            this.setState({
                maxHeight: event.nativeEvent.layout.height,
            });
        }
    };

    setMinHeight = (event) => {
        if (!this.state.animation) {
            this.setState({
                animation: this.state.expanded
                    ? new Animated.Value()
                    : new Animated.Value(parseInt(event.nativeEvent.layout.height)),
            });
        }
        this.setState({
            minHeight: event.nativeEvent.layout.height,
        });
    };

    toggle = () => {
        const initialValue = this.state.expanded
            ? this.state.maxHeight + this.state.minHeight
            : this.state.minHeight;
        const finalValue = this.state.expanded
            ? this.state.minHeight
            : this.state.minHeight + this.state.maxHeight;

        this.setState({
            expanded: !this.state.expanded,
        });

        this.state.animation.setValue(initialValue);
        Animated.spring(this.state.animation, {
            toValue: finalValue,
            bounciness: 0,
        }).start();
    };

    externalToggle = () => {
        setTimeout(this.toggle, 500);
    };

    render() {
        const icon = this.icons[this.state.expanded ? 'up' : 'down'];

        return (
            <Animated.View
                style={[styles.box, this.props.style, { height: this.state.animation }]}
            >
                <TouchableWithoutFeedback
                    onPress={this.toggle}
                    onLayout={this.setMinHeight}
                >
                    <View style={styles.titleContainer}>
                        <Text style={styles.label}>{this.props.label}</Text>
                        {this.props.value ? (
                            <Text style={styles.value}>{this.props.value}</Text>
                        ) : null}
                        <Icon
                            name={icon}
                            color={this.props.arrowColor}
                            style={styles.buttonImage}
                            size={this.props.arrowSize}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.body} onLayout={this.setMaxHeight}>
                    {this.props.children}
                </View>
            </Animated.View>
        );
    }
}

ToggleBox.propTypes = {
    getToggle: PropTypes.func.isRequired,
    style: PropTypes.object,
    arrowColor: PropTypes.string,
    arrowSize: PropTypes.number,
    arrowDownType: PropTypes.string,
    arrowUpType: PropTypes.string,
    children: PropTypes.element.isRequired,
    expanded: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ToggleBox.defaultProps = {
    arrowColor: 'rgb(178, 178, 178)',
    arrowSize: 30,
    arrowDownType: 'keyboard-arrow-down',
    arrowUpType: 'keyboard-arrow-up',
    expanded: false,
    style: {},
    value: null,
};

export default ToggleBox;