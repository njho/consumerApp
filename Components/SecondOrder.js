import React from 'react';
import {StyleSheet, Platform, Image, Text, View, Button, TouchableOpacity, Dimensions, FlatList} from 'react-native';
import update from 'immutability-helper';


import {connect} from 'react-redux';


import MapView from 'react-native-maps';
import Interactable from 'react-native-interactable';
import Icon from 'react-native-vector-icons/Ionicons';
import ServiceListItem from './ServiceListItem'


import {AccessToken, LoginManager, LoginButton} from 'react-native-fbsdk';
import firebase from 'react-native-firebase';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const mapStateToProps = state => ({
    servicesSelected: state.common.servicesSelected,

});

const mapDispatchToProps = dispatch => ({
    octaneSelected: (value) => {
        dispatch({type: 'OCTANE_SELECTED', octane: value});
    },
    updateServicesSelected: (value) => {
        dispatch({type: 'UPDATE_SERVICES_SELECTED', value: value});
    }
});

class SecondOrder extends React.Component {
    constructor() {
        super();
        this.state = {
            services: [
                {
                    title: 'Windshield Washer Fluid Top Up',
                    description: 'Just as it sounds.',
                    price: '$5'
                },
                {
                    title: 'Windshield Chip Repair',
                    description: 'Our technician will take care of that nasty crack in your windshield for you.',
                    price: '$20'
                },
                {
                    title: 'Tire Check & Fill',
                    description: 'Tire looking flat? Our mobile compressor has you taken care of.',
                    price: '$50'
                }]
        }
    };


    static navigationOptions = {
        header: null,
        drawerLabel: 'Home',
        drawerIcon: ({tintColor}) => (
            <Icon name="ios-home" size={25} color={tintColor}/>
        ),
    };

    gasSelection = (value) => {
        this.interactable.snapTo({index: 1});
        this.props.octaneSelected(value);
    };

    pickerToggled(uid, value) {
        var newArray = [];
        if (value) {
            newArray = update(this.props.selected, {$push: [uid]});
        } else {
            // newArray = this.props.selected.filter(e => e !== uid);
            // console.log(this.props.selected);
        }
    };

    renderImage(index) {
        console.log(index);
        switch (index) {
            case 0:
                return <Image source={require('../assets/topup.png')}
                              style={{
                                  marginRight: 10,
                                  resizeMode: 'cover',
                                  width: width * 0.17,
                                  height: width * 0.17,
                              }}/>
            case 1:
                return <Image source={require('../assets/windshield.png')}
                              style={{
                                  marginRight: 10,
                                  resizeMode: 'cover',
                                  width: width * 0.17,
                                  height: width * 0.17,
                              }}/>
            case 2:
                return <Image source={require('../assets/tiregauge.png')}
                              style={{
                                  marginRight: 10,
                                  resizeMode: 'cover',
                                  width: width * 0.17,
                                  height: width * 0.17,
                              }}/>
        }
    }

    serviceSelection = (index) => {
        const newCollection = update(this.props.servicesSelected, {[index]: {$set: !this.props.servicesSelected[index]}});
        this.props.updateServicesSelected(newCollection);
    };

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.header}>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>

                        <TouchableOpacity style={{marginRight: 20,}} onPress={() => this.props.navigation.goBack()}>
                            <Icon name="ios-arrow-back" size={35} color={'rgba(255,255,255,0.9)'}/>
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>Additional Services</Text>
                    </View>

                    <Text style={styles.contentText}>Please choose from additional Sure Fuel services.</Text>

                </View>
                <FlatList
                    style={{flex: 1, width: width, backgroundColor: '#91a3ff'}}
                    data={this.state.services}
                    keyExtractor={this._keyExtractor}
                    renderItem={({item, index}) =>
                        <TouchableOpacity
                            onPress={() => this.serviceSelection(index)}
                            key={index} style={styles.serviceContainer}>

                            {this.props.servicesSelected[index] ? <View style={{
                                    width: width * 0.17,
                                    marginRight: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}><Icon name="ios-checkmark" size={60} color={'white'}/></View>
                                : this.renderImage(index)}


                            <View style={styles.titleContainer}>
                                <Text style={[styles.promotionText, {color: 'white'}]}>
                                    {item.title}
                                </Text>
                                <Text style={[styles.promotionText, {
                                    color: 'white',
                                    fontWeight: 'normal',
                                    fontSize: 12,
                                    textDecorationLine: 'none',
                                    marginTop: 2
                                }]}>
                                    {item.description}
                                </Text>
                            </View>

                            <View style={styles.priceMarker}>
                                <Text style={[{
                                    fontSize: 12,
                                    textDecorationLine: 'none',
                                    fontWeight: 'normal',
                                    color: 'white',
                                }]}>
                                    {item.price}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    }
                />
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('OrderSummary')} style={{marginBottom: 20, marginTop: 10}}>
                    <Text style={{color: 'white',}}>CONTINUE</Text>
                </TouchableOpacity>

            </View>




        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SecondOrder);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#91a3ff'
    },
    header: {
        width: width,
        paddingTop: 20,
        paddingBottom: 15,
        paddingHorizontal: 30,
        justifyContent: 'flex-start',
        flexDirection: 'column',
    },
    headerTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 25,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5
    },
    content: {
        alignItems: 'flex-start',
        paddingTop: 30,
        paddingBottom: 20,
        paddingHorizontal: 20,
        width: width,
        justifyContent: 'flex-start'

    },
    contentText: {
        alignItems: 'flex-start',
        textAlign: 'left',
        color: 'white',
        fontSize: 18,
        marginBottom: 10,
    },
    titleContainer: {
        padding: 10,
        alignSelf: 'flex-start',
        flex: 1
    },
    promotion: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center'

    },
    serviceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        // borderColor: '#92c1ff',
        // borderWidth: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 3,
        marginBottom: 3,
        marginHorizontal: 5,
        marginTop: 4,
        paddingLeft: 20,
        paddingRight: 30,

        paddingVertical: 20,
        elevation: 1,
    },
    priceMarker: {
        backgroundColor: '#92c1ff',
        borderRadius: 100,
        position: 'absolute',
        right: 5,
        bottom: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 35, height: 35
    },

    promotionText: {
        alignItems: 'flex-start',
        color: 'white',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        fontSize: 18,
    }
});

