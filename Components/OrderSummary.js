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

class OrderSummary extends React.Component {
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
                    <View style={{flexDirection: 'row',}}>

                        <TouchableOpacity style={{marginRight: 20,}} onPress={() => this.props.navigation.goBack()}>
                            <Icon name="ios-arrow-back" size={35} color={'rgba(255,255,255,0.9)'}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.headerTitle}>ORDER OVERVIEW</Text>

                <Text style={styles.contentText}>Please review your order items.</Text>
                <View style={styles.serviceContainer}>
                    <View style={styles.serviceItem}>
                        <View>
                            <Text style={styles.serviceTitle}>FILL</Text>
                            <Text style={{color: 'white', fontSize: 12,}}>(PRE-AUTHORIZATION)</Text>
                        </View>
                        <View>
                            <Text style={{color: 'white', fontSize: 16}}>$50</Text>
                        </View>
                    </View>
                    <View style={{width: width * 0.8, height: 1, backgroundColor: '#92b7b9', marginBottom: 30}}>
                        <View style={{width: width * 0.7, height: 1, backgroundColor: 'white'}}>
                        </View>
                    </View>
                    <View style={styles.serviceItem}>
                        <View>
                            <Text style={styles.serviceTitle}>WINDSHIELD FLUID TOP-UP</Text>
                        </View>
                        <View>
                            <Text style={{color: 'white', fontSize: 16}}>$50</Text>
                        </View>
                    </View>
                    <View style={{width: width * 0.8, height: 1, backgroundColor: '#92b7b9', marginBottom: 35}}>
                        <View style={{width: width * 0.2, height: 1, backgroundColor: 'white'}}>
                        </View>
                    </View>
                    <View style={{position: 'absolute', bottom: 5, alignItems: 'center'}}>
                        <View style={[styles.serviceItem,]}>
                            <View>
                                <Text style={[styles.serviceTitle, {fontWeight: 'bold', fontSize: 22} ]}>TOTAL</Text>
                            </View>
                            <View>
                                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 22}}>$150</Text>
                            </View>
                        </View>
                        <View style={{width: width * 0.8, height: 1, backgroundColor: '#92b7b9', marginBottom: 35}}>
                            <View style={{width: width * 0.8, height: 1, backgroundColor: 'white'}}>
                            </View>
                        </View>
                    </View>

                </View>
                <TouchableOpacity style={{marginBottom: 30}}>

                    <Text style={{color: 'white',}}>CONFIRM ORDER</Text>
                </TouchableOpacity>


            </View>




        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderSummary);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height,
        alignItems: 'center',
        backgroundColor: '#2ba2ad',
        justifyContent: 'flex-start'
    },
    header: {
        width: width,
        paddingTop: 20,
        paddingHorizontal: 30,
        justifyContent: 'flex-start',
        flexDirection: 'column',
    },
    headerTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
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
    serviceItem: {
        flexDirection: 'row',
        width: width,
        paddingHorizontal: 30,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    serviceTitle: {
        color: 'white',
        fontSize: 18
    },
    serviceContainer: {
        width: width,
        marginTop: 40,
        alignItems: 'center',
        flex: 1
    },
    contentText: {
        alignItems: 'flex-start',
        textAlign: 'left',
        color: 'white',
        fontSize: 13,
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

