import React from 'react';
import {StyleSheet, Platform, ScrollView, Text, View, Button, TouchableOpacity, Dimensions,} from 'react-native';

import moment from 'moment';


import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import agent from '../Helpers/agent';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const mapStateToProps = state => ({
    user: state.auth.user,

    servicesSelected: state.common.servicesSelected,
    windshield: state.common.windshield,
    topUp: state.common.topUp,
    tire: state.common.tire,
    orderHour: state.common.orderHour,
    octane: state.common.octane,
    regular: state.common.regular,
    premium: state.common.premium,

    orderFill: state.common.orderFill,
    lat: state.common.lat,
    lng: state.common.lng
});

const mapDispatchToProps = dispatch => ({
    octaneSelected: (value) => {
        dispatch({type: 'OCTANE_SELECTED', octane: value});
    },
    confirmOrder: (uid, cardId) => {
        dispatch(agent.actions.createCharge(uid, cardId));
    },
    createOrder: (orderFill, octane, octanePrice, approximateLoad, start, end, orderHour, servicesSelected, windshield, tire, topUp, lat, lng, uid, total) => {
        dispatch(agent.actions.createOrder(orderFill, octane, octanePrice, approximateLoad, start, end, orderHour, servicesSelected, windshield, tire, topUp, lat, lng, uid, total));
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


    calculateTotal = () => {
        let total = this.props.orderFill + this.props.servicesSelected[0] * this.props.topUp + this.props.servicesSelected[1] * this.props.windshield + this.props.servicesSelected[2] * this.props.tire
        console.log('This is the total ' + total);
        return total
    };

    confirmOrder = () => {
        console.log('This is the current Date');
        console.log();
        let now = moment.unix(1531065175);
        console.log(now.format('DD MM YY H:MM'));
        let currentTime = now.format("HH:mm");
        let end = now.add(this.props.orderHour, 'h').format("HH:mm");
        console.log(currentTime, end);
        let octanePrice;

        if (this.props.octane === 87) {
            octanePrice = this.props.regular;
        } else {
            octanePrice = this.props.premium;
        }

        let approximateLoad = (this.props.orderFill - (this.props.servicesSelected[0] * this.props.topUp + this.props.servicesSelected[1] * this.props.windshield + this.props.servicesSelected[2] * this.props.tire)) / octanePrice;

        this.props.createOrder(this.props.orderFill, this.props.octane, octanePrice, approximateLoad, currentTime.toString(), end.toString(), this.props.orderHour, this.props.servicesSelected, this.props.windshield, this.props.tire, this.props.topUp, this.props.lat, this.props.lng, this.props.user.uid, this.calculateTotal());
        // this.props.confirmOrder('test', 'test');
    };

    // componentDidMount() {
    //     const vehicles =
    //         {
    //             id: "vehicle_1",
    //             start_location: {
    //                 id: "depot",
    //                 lat: 51.091617,
    //                 lng: -113.960600
    //             },
    //             end_location: {
    //                 id: "depot",
    //                 lat: 51.091617,
    //                 lng: -113.960600
    //             }
    //         }
    //     agent.actions.createDriver(vehicles)
    //
    // }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{position: 'absolute', left: 30, top: 15, elevation: 5}}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="ios-arrow-back" size={35} color={'rgba(255,255,255,0.9)'}/>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.headerTitle}>ORDER SUMMARY</Text>
                </View>
                <View style={styles.serviceContainer}>
                    <ScrollView contentContainerStyle={{alignItems: 'center', paddingTop: 30, paddingBottom: 40,}}>
                        <View style={styles.serviceItem}>
                            <View>
                                <Text style={styles.serviceTitle}>FILL</Text>
                                <Text style={{color: '#91a3ff', fontSize: 12,}}>(PRE-AUTHORIZATION)</Text>
                            </View>
                            <View>
                                <Text style={{color: '#91a3ff', fontSize: 14}}>${this.props.orderFill}</Text>
                            </View>
                        </View>
                        <View style={{width: width * 0.8, height: 1, backgroundColor: '#cbcdff', marginBottom: 30}}>
                            <View style={{
                                width: width * (this.props.orderFill / this.calculateTotal()) * 0.8,
                                height: 1,
                                backgroundColor: '#91a3ff'
                            }}>
                            </View>
                        </View>

                        {this.props.servicesSelected[0] ? <View style={styles.serviceItemContainer}>
                            <View style={styles.serviceItem}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.serviceTitle}>WINDSHIELD WASHER FLUID TOP-UP</Text>
                                </View>

                                <Text
                                    style={{color: '#91a3ff', fontSize: 14, marginLeft: 15}}>${this.props.topUp}</Text>
                            </View>
                            <View style={{width: width * 0.8, height: 1, backgroundColor: '#cbcdff', marginBottom: 35}}>
                                <View style={{
                                    width: width * (this.props.topUp / this.calculateTotal()) * 0.8,
                                    height: 1,
                                    backgroundColor: '#91a3ff'
                                }}>
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
                                        <Text style={{
                                            color: '#91a3ff',
                                            fontSize: 14,
                                            marginLeft: 15
                                        }}>${this.props.windshield}</Text>
                                    </View>
                                </View>
                                <View style={{
                                    width: width * 0.8,
                                    height: 1,
                                    backgroundColor: '#cbcdff',
                                    marginBottom: 35
                                }}>
                                    <View style={{
                                        width: width * (this.props.windshield / this.calculateTotal()) * 0.8,
                                        height: 1,
                                        backgroundColor: '#91a3ff'
                                    }}>
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
                                        <Text style={{
                                            color: '#91a3ff',
                                            fontSize: 14,
                                            marginLeft: 15
                                        }}>${this.props.tire}</Text>
                                    </View>
                                </View>
                                <View style={{
                                    width: width * 0.8,
                                    height: 1,
                                    backgroundColor: '#cbcdff',
                                    marginBottom: 35
                                }}>
                                    <View style={{
                                        width: width * (this.props.tire / this.calculateTotal()) * 0.8,
                                        height: 1,
                                        backgroundColor: '#91a3ff'
                                    }}>
                                    </View>
                                </View>
                            </View>
                            : null}
                        <View style={styles.serviceItem}>

                            <Text style={{color: '#91a3ff', fontSize: 12, textAlign: 'center'}}>Fueling excise tax to be
                                displayed on e-mailed receipt. Current rate at 5%.</Text>
                        </View>
                    </ScrollView>
                    <View style={{alignItems: 'center'}}>
                        <View style={[styles.serviceItem,]}>
                            <View>
                                <Text style={[styles.serviceTitle, {fontWeight: 'bold', fontSize: 22}]}>TOTAL</Text>
                            </View>
                            <View>
                                <Text style={{
                                    color: '#91a3ff',
                                    fontWeight: 'bold',
                                    fontSize: 22,
                                    marginLeft: 10,
                                }}>${this.calculateTotal()}</Text>
                            </View>
                        </View>
                        <View style={{width: width * 0.8, height: 1, backgroundColor: '#cbcdff', marginBottom: 20}}>
                            <View style={{width: width * 0.8, height: 1, backgroundColor: '#91a3ff'}}>
                            </View>
                        </View>
                    </View>

                </View>
                <TouchableOpacity style={{marginBottom: 30}} onPress={() => this.confirmOrder()}>
                    <Text style={{color: '#91a3ff', fontSize: 18, fontWeight: 'bold'}}>CONFIRM ORDER</Text>
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
        backgroundColor: 'white',
        justifyContent: 'flex-start'
    },
    header: {
        width: width,
        paddingTop: 65,
        paddingBottom: 25,
        paddingHorizontal: 30,
        justifyContent: 'flex-end',
        backgroundColor: '#91a3ff'
    },
    headerTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 25
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 10,

    },
    serviceTitle: {
        color: '#91a3ff',
        fontSize: 18,
        flexWrap: 'wrap'

    },
    serviceContainer: {
        width: width,
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
    promotionText: {
        alignItems: 'flex-start',
        color: '#91a3ff',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        fontSize: 18,
    }
});


/*  <View style={styles.serviceItemContainer}>
                            <View style={styles.serviceItem}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.serviceTitle}>SERVICE FEE</Text>
                                </View>

                                <Text
                                    style={{color: '#91a3ff', fontSize: 14, marginLeft: 15}}>${this.props.topUp}</Text>
                            </View>
                            <View style={{width: width * 0.8, height: 1, backgroundColor: '#cbcdff', marginBottom: 35}}>
                                <View style={{
                                    width: width * (this.props.topUp / this.calculateTotal()) * 0.8,
                                    height: 1,
                                    backgroundColor: '#91a3ff'
                                }}>
                                </View>
                            </View>
                        </View> */