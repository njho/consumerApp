import React from 'react';
import {
    Animated,
    Text,
    View,
    StyleSheet,
    TextInput,
    Image,
    Dimensions,
    TouchableOpacity,
    TouchableHighlight,
    Button,
    Easing,
    FlatList,
    ScrollView,
    TouchableWithoutFeedback,
    ToastAndroid,
    Switch,
    Slider,
    Picker,
    Platform,
    StatusBar
} from 'react-native';


import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({

});


class ServiceListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false
        }}

    toggle() {
        this.props.callback(!this.props.selected);
    }

    _keyExtractor = (item, index) => item.id;

    render() {


        return (
            <View style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 20,
                backgroundColor: this.props.index % 2 === 0 ? 'rgba(250,250,250,0.4)' : 'rgba(250,250,250,0.1)'
            }}>
                <TouchableOpacity style={{flexDirection: 'row', flex: 1, alignItems: 'center'}} onPress={() => this.toggle()}>

                    <View style={{
                        flex: 4,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        paddingVertical: 10,
                        marginLeft: 20
                    }}>
                        <Text style={styles.titleText}>{this.props.name}</Text>
                    </View>
                    <View style={{flexDirection: 'column', alignItems: 'center'}}>
                        {this.props.selected ?
                            <Icon name="ios-checkmark-circle-outline" size={40} style={{marginRight: 30}} color="#00BBF5"/>
                            : <View>
                                <Text
                                    style={{
                                        color: '#00BBF5',
                                        marginRight: 30,
                                        fontSize: 14
                                    }}>
                                    Add</Text>
                            </View>
                        }
                    </View>
                </TouchableOpacity>
            </View>
        )
            ;
    }
}

const
    styles = StyleSheet.create({

        cardContainer: {
            elevation: 10,
            paddingVertical: 20,
            borderRadius: 10,
            marginTop: 30,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            marginBottom: 40,
        },
        titleText: {
            color: '#4D81C2',
            fontWeight: 'bold',
            fontSize: 18,
        },
        subText: {
            color: '#5690d8',
            fontSize: 12,

        },
        button: {
            backgroundColor: '#86E5C6',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            marginTop: 5,
            marginBottom: 5,
            paddingVertical: 7,
            marginRight: 5,
        },
        buttonText: {
            color: 'white',
            fontSize: 12,
            marginHorizontal: 15,
        }

    });


export default connect(mapStateToProps, mapDispatchToProps)(ServiceListItem);
//
