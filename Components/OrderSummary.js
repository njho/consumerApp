import React from 'react';
import {
    StyleSheet,
    TextInput,
    ScrollView,
    Text,
    View,
    Button,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import moment from 'moment';


import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import agent from '../Helpers/agent';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const mapStateToProps = state => ({
    user: state.auth.user,
    creditCards: state.auth.creditCards,
    orderVehicle: state.common.orderVehicle,
    orderPromotion: state.common.orderPromotion,
    orderReferral: state.common.orderReferral,

    paymentInfo: state.auth.userPayment,
    vehicles: state.auth.vehicles,
    availableSentPromos: state.auth.availableSentPromos,
    receivedPromos: state.auth.receivedPromos,


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
    lng: state.common.lng,

});

const mapDispatchToProps = dispatch => ({
    octaneSelected: (value) => {
        dispatch({type: 'OCTANE_SELECTED', octane: value});
    },
    confirmOrder: (uid, cardId) => {
        dispatch(agent.actions.createCharge(uid, cardId));
    },
    createOrder: (orderFill, octane, octanePrice, approximateLoad, start, end, orderHour, servicesSelected, windshield, tire, topUp, lat, lng, uid, total, stripeInfo, vehicle) => {
        dispatch(agent.actions.createOrder(orderFill, octane, octanePrice, approximateLoad, start, end, orderHour, servicesSelected, windshield, tire, topUp, lat, lng, uid, total, stripeInfo, vehicle));
    },
    setOrderVehicle: (value) => {
        dispatch({type: 'SET_ORDER_VEHICLE', value: value});
    },
    setReferral: (value) => {
        dispatch({type: 'SET_ORDER_REFERRAL', value: value});
    },
    setOrderPromotion: (value) => {
        dispatch({type: 'SET_ORDER_PROMOTION', value: value});
    },
});

class OrderSummary extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: false,
        }
    };

    static navigationOptions = {
        header: null,
        drawerLabel: 'Home',
        drawerIcon: ({tintColor}) => (
            <Icon name="ios-home" size={25} color={tintColor}/>
        ),
    };


    calculateTotal = () => {
        let total = this.props.orderFill + this.props.servicesSelected.windshieldTopUp * this.props.topUp + this.props.servicesSelected.chip * this.props.windshield + this.props.servicesSelected.tire * this.props.tire - (this.props.orderPromotion !== null ? this.props.orderPromotion.value / 100 : 0);
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

        let approximateLoad = ((this.props.orderFill - (this.props.servicesSelected.windshieldTopUp * this.props.topUp + this.props.servicesSelected.windshield * this.props.windshield + this.props.servicesSelected.tire * this.props.tire)) * 0.95 - 5) / octanePrice;

        this.props.createOrder(this.props.orderFill, this.props.octane, octanePrice, approximateLoad, currentTime.toString(), end.toString(), this.props.orderHour, this.props.servicesSelected, this.props.windshield, this.props.tire, this.props.topUp, this.props.lat, this.props.lng, this.props.user.uid, this.calculateTotal(), this.props.paymentInfo, this.props.orderVehicle);
    };

    // componentWillMount() {
    //     console.log(this.props.orderVehicle);
    //     console.log(this.props.creditCards);
    //     if (this.props.creditCards.length === 1) {
    //         console.log('There is a default Credit Card Already');
    //         if (this.props.vehicles.length === 1) {
    //             console.log(this.props.vehicles)
    //             this.props.setOrderVehicle(this.props.vehicles[0]);
    //         }
    //     } else if (this.props.creditCards.length === 0) {
    //         this.props.navigation.navigate('EditCC', {isNew: true, redirect: true});
    //     }
    //     console.log('Order Promotion');
    //     console.log(this.props.orderPromotion);
    // }

    textHandler(value, text) {
        switch (value) {
            case 'referral':
                this.props.setReferral(text);
                break;
        }
    };

    async validatePromotionAsync(uid) {
        let response = await agent.actions.validateGiftCode(uid, this.props.orderReferral);
        console.log('This is the referralCode' + this.props.orderReferral);
        let data = await response.json();
        console.log(data);
        return data;
    }

    validatePromotion = (uid) => {
        console.log('Fuck');
        this.setState({...this.state, loading: true});

        this.validatePromotionAsync(uid).then((response) => {
            console.log('this is the response + ' + response);
            this.setState({...this.state, loading: false});

            if (typeof response.value === 'undefined') {
                this.props.setReferral('Code Not Valid')
            } else {
                this.props.setOrderPromotion(response);
            }

        })
    };

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
                    <ScrollView contentContainerStyle={{alignItems: 'center', paddingTop: 30, paddingBottom: 20,}}>
                        <View style={styles.headerContent}>
                            <View style={styles.headerBox}>
                                <Icon name="ios-car-outline" color={'white'} size={40}/>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 12,
                                }}>{this.props.orderVehicle !== {} || typeof (this.props.orderVehicle ) !== 'undefined' ? this.props.orderVehicle.license : null}</Text>
                            </View>
                            <View style={styles.headerBox}>
                                <Icon name="ios-card-outline" color={'white'} size={40}/>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 12,
                                }}>{this.props.creditCards.length > 0 ? this.props.creditCards[0].number : null}</Text>

                            </View>
                        </View>
                        <View style={[styles.serviceItem,]}>
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

                        {this.props.servicesSelected['windshieldTopUp'] ? <View style={styles.serviceItemContainer}>
                            <View style={styles.serviceItem}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.serviceTitle}>WINDSHIELD WASHER FLUID TOP-UP</Text>
                                </View>

                                <Text
                                    style={{color: '#91a3ff', fontSize: 14, marginLeft: 15}}>${this.props.topUp}</Text>
                            </View>
                            <View style={{width: width * 0.8, height: 1, backgroundColor: '#cbcdff',}}>
                                <View style={{
                                    width: width * (this.props.topUp / this.calculateTotal()) * 0.8,
                                    height: 1,
                                    backgroundColor: '#91a3ff'
                                }}>
                                </View>
                            </View>
                        </View> : null}

                        {this.props.servicesSelected['chip'] ?
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

                        {this.props.servicesSelected['tire'] ?

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

                        {this.props.receivedPromos < 1 ?
                            <View style={[styles.serviceItemContainer, {marginBottom: 10, marginTop: 10}]}>
                                <View style={[styles.serviceItem, {flexDirection: 'column'}]}>
                                    <Text
                                        style={[styles.serviceTitle, {
                                            fontWeight: 'bold',
                                            color: '#91a3ff',
                                            fontSize: 18
                                        }]}> SUREFUEL 7 FOR 7 CODE</Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        flex: 1,
                                        alignSelf: 'stretch',
                                        alignItems: 'center'
                                    }}>
                                        <TextInput
                                            style={styles.textInput}
                                            underlineColorAndroid='rgba(0,0,0,0)'
                                            placeholderTextColor={'#91a3ff'}
                                            placeholder={'Code'}
                                            value={this.props.orderReferral}
                                            onChangeText={(text) => this.textHandler('referral', text)}
                                        />
                                        {this.state.loading ?
                                            <ActivityIndicator
                                                size="small" color="#7AFF9A"/>
                                            : <TouchableOpacity style={{paddingLeft: 10}}
                                                                onPress={() => this.validatePromotion(this.props.user.uid)}>
                                                <Icon name="ios-checkmark-circle-outline" size={30} color={'#91a3ff'}/>
                                            </TouchableOpacity>}

                                    </View>
                                </View>
                            </View> : null}


                        {this.props.orderPromotion !== null ?
                            <View style={styles.serviceItemContainer}>
                                <View style={styles.serviceItem}>
                                    <View>
                                        <Text
                                            style={[styles.serviceTitle, {
                                                color: '#66c672',
                                            }]}>Fuel Credit Applied</Text>
                                    </View>
                                    <View>
                                        <Text style={{
                                            color: '#66c672',
                                            fontSize: 14,
                                            marginLeft: 15
                                        }}>-${(this.props.orderPromotion.value / 100).toFixed(2)}</Text>
                                    </View>
                                </View>
                            </View>
                            : null}


                        {this.props.availablePromos > 0 && this.props.orderPromotion == null ? <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('PromotionPicker')
                            }
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flex: 1,
                                alignSelf: 'stretch',
                                marginHorizontal: 40, backgroundColor: '#91a3ff',
                                elevation: 2,
                                paddingVertical: 10,
                                marginBottom: 20,
                            }}>

                            <Text style={{color: 'white'}}>You Have Credits Available!</Text>
                        </TouchableOpacity> : null}

                        <View style={styles.serviceItem}>

                            <Text style={{color: '#91a3ff', fontSize: 12, textAlign: 'center'}}>Fueling excise tax to be
                                displayed on e-mailed receipt. Current rate at 5%.</Text>
                        </View>
                        <View style={{alignItems: 'center', paddingTop: 40}}>
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
                        <TouchableOpacity style={{marginBottom: 30}} onPress={() => this.confirmOrder()}>
                            <Text style={{color: '#91a3ff', fontSize: 18, fontWeight: 'bold'}}>CONFIRM ORDER</Text>
                        </TouchableOpacity>

                    </ScrollView>


                </View>


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
    headerContent: {
        flexDirection: 'row',
        width: width * 0.7,
        flex: 1,
        justifyContent: 'space-around',
        paddingBottom: 25,

    },
    headerBox: {
        backgroundColor: '#91a3ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: width * 0.4,
        width: width * 0.25,
        height: width * 0.25,
        elevation: 5,

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
        width: width,
        paddingHorizontal: 40,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 10,

    },
    serviceTitle: {
        color: '#91a3ff',
        fontSize: 15,
        flexWrap: 'wrap'

    },
    serviceContainer: {
        width: width,
        alignItems: 'center',
        flex: 1
    },
    serviceItemContainer: {
        alignItems: 'center',
        marginBottom: 30
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
    },
    textInput: {
        color: '#91a3ff',
        alignSelf: 'stretch',
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#91a3ff',
    },
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