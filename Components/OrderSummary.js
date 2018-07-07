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
    windshield: state.common.windshield,
    topUp: state.common.topUp,
    tire: state.common.tire,
    orderHour: state.common.orderHour,
    orderFill: state.common.orderFill,
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
    };

    static navigationOptions = {
        header: null,
        drawerLabel: 'Home',
        drawerIcon: ({tintColor}) => (
            <Icon name="ios-home" size={25} color={tintColor}/>
        ),
    };

    confirmOrder = () => {

    };

    calculateTotal = ()=> {
        let total = this.props.orderFill + this.props.servicesSelected[0]*this.props.topUp + this.props.servicesSelected[1]*this.props.windshield + this.props.servicesSelected[2]*this.props.tire
        console.log('This is the total ' + total);
        return total
    };
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>

                        <TouchableOpacity style={{marginRight: 20,}} onPress={() => this.props.navigation.goBack()}>
                            <Icon name="ios-arrow-back" size={35} color={'rgba(255,255,255,0.9)'}/>
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>ORDER OVERVIEW</Text>
                    </View>

                </View>
                <View style={styles.serviceContainer}>
                    <View style={styles.serviceItem}>
                        <View>
                            <Text style={styles.serviceTitle}>FILL</Text>
                            <Text style={{color: 'white', fontSize: 12,}}>(PRE-AUTHORIZATION)</Text>
                        </View>
                        <View>
                            <Text style={{color: 'white', fontSize: 14}}>${this.props.orderFill}</Text>
                        </View>
                    </View>
                    <View style={{width: width * 0.8, height: 1, backgroundColor: '#92b7b9', marginBottom: 30}}>
                        <View style={{width: width * (this.props.orderFill/this.calculateTotal()) * 0.8, height: 1, backgroundColor: 'white'}}>
                        </View>
                    </View>
                    {this.props.servicesSelected[0] ? <View style={styles.serviceItemContainer}>
                        <View style={styles.serviceItem}>
                            <View style={{flex: 1}}>
                                <Text style={styles.serviceTitle}>WINDSHIELD WASHER FLUID TOP-UP</Text>
                            </View>

                            <Text style={{color: 'white', fontSize: 14,marginLeft: 15}}>${this.props.topUp}</Text>
                        </View>
                        <View style={{width: width * 0.8, height: 1, backgroundColor: '#92b7b9', marginBottom: 35}}>
                            <View style={{width: width * (this.props.topUp/this.calculateTotal()) * 0.8, height: 1, backgroundColor: 'white'}}>
                            </View>
                        </View>
                    </View> : null}

                    {this.props.servicesSelected[1] ?
                        <View style={styles.serviceItemContainer}>
                            <View style={styles.serviceItem}>
                                <View>
                                    <Text style={styles.serviceTitle}>WINDSHIELD CHIP REPAIR</Text>
                                </View>
                                <View>
                                    <Text style={{color: 'white', fontSize: 14, marginLeft: 15}}>${this.props.windshield}</Text>
                                </View>
                            </View>
                            <View style={{width: width * 0.8, height: 1, backgroundColor: '#92b7b9', marginBottom: 35}}>
                                <View style={{width: width * (this.props.windshield/this.calculateTotal()) * 0.8, height: 1, backgroundColor: 'white'}}>
                                </View>
                            </View>
                        </View>
                        : null}

                    {this.props.servicesSelected[2] ?

                        <View style={styles.serviceItemContainer}>
                            <View style={styles.serviceItem}>
                                <View>
                                    <Text style={styles.serviceTitle}>TIRE CHECK & FILL</Text>
                                </View>
                                <View>
                                    <Text style={{color: 'white', fontSize: 14, marginLeft: 15}}>${this.props.tire}</Text>
                                </View>
                            </View>
                            <View style={{width: width * 0.8, height: 1, backgroundColor: '#92b7b9', marginBottom: 35}}>
                                <View style={{width: width * (this.props.tire/this.calculateTotal()) * 0.8, height: 1, backgroundColor: 'white'}}>
                                </View>
                            </View>
                        </View>
                        : null}

                    <View style={{position: 'absolute', bottom: 5, alignItems: 'center'}}>
                        <View style={[styles.serviceItem,]}>
                            <View>
                                <Text style={[styles.serviceTitle, {fontWeight: 'bold', fontSize: 22}]}>TOTAL</Text>
                            </View>
                            <View>
                                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 22, marginLeft: 10,}}>${this.calculateTotal()}</Text>
                            </View>
                        </View>
                        <View style={{width: width * 0.8, height: 1, backgroundColor: '#92b7b9', marginBottom: 20}}>
                            <View style={{width: width * 0.8, height: 1, backgroundColor: 'white'}}>
                            </View>
                        </View>
                    </View>

                </View>
                <TouchableOpacity style={{marginBottom: 30}} onPress={() => this.confirmOrder()}>

                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>CONFIRM ORDER</Text>
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
        paddingBottom: 10,
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
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
        width: width,
        justifyContent: 'flex-start'

    },
    serviceItem: {
        flexDirection: 'row',
        width: width, paddingHorizontal: 30,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    serviceTitle: {
        color: 'white',
        fontSize: 18,
        flexWrap: 'wrap'

    },
    serviceContainer: {
        width: width,
        marginTop: 40,
        alignItems: 'center',
        flex: 1
    },
    serviceItemContainer: {
        alignItems: 'center'
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

