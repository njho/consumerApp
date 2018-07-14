import React from 'react';
import {
    StyleSheet,
    Platform,
    Image,
    Text,
    View,
    Alert,
    TouchableOpacity,
    Dimensions,
    Switch,
    Animated,
    Easing
} from 'react-native';
import {connect} from 'react-redux';
import MapView, {Polygon, Marker} from 'react-native-maps';
import Interactable from 'react-native-interactable';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase';

const firestore = firebase.firestore();

import agent from '../Helpers/agent';

import inside from 'point-in-polygon';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const mapStateToProps = state => ({
    octane: state.common.octane,
    orderHour: state.common.orderHour,
    orderFill: state.common.orderFill,
    user: state.auth.user,
    zones: state.common.zones,

    regular: state.common.regular,
    premium: state.common.premium,
    deliverRates: state.common.deliverRates,
    recurringOrder: state.common.recurringOrder
});

const mapDispatchToProps = dispatch => ({
    octaneSelected: (value) => {
        dispatch({type: 'OCTANE_SELECTED', octane: value});
    },
    hourSelected: (value) => {
        dispatch({type: 'ORDER_HOUR_SELECTED', value: value});
    },
    fillSelected: (value) => {
        dispatch({type: 'FILL_SELECTED', value: value});
    },
    getUserDetails: (uid) => {
        dispatch(agent.getters.getUser(uid))
    },
    getUserJobs: (uid) => {
        dispatch(agent.getters.getUserJobs(uid))
    },
    getuserVehicles: (uid) => {
        dispatch(agent.getters.getUserVehicles(uid))
    },
    getUserCreditCards: (uid) => {
        dispatch(agent.getters.getUserCreditCards(uid))
    },
    getPaymentInfo: (uid) => {
        dispatch(agent.getters.getPaymentInfo(uid))
    },
    getUserPromotions: (uid) => {
        dispatch(agent.getters.getUserPromotions(uid))
    },
    getZones: (city) => {
        dispatch(agent.getters.getZones(city))
    },
    resetAllOrderInfo: (uid) => {
        dispatch({type: 'RESET_ALL_ORDER_INFO',});
    },
    setRates: (value) => {
        dispatch({type: 'SET_RATES', value: value});
    },
    setCoordinates: (lat, lng) => {
        dispatch({type: 'SET_COORDINATES', lat: lat, lng: lng});
    },
    toggleRecurringOrder: (value) => {
        dispatch({type: 'TOGGLE_RECURRING_ORDER', value: value});
    }
});


class BasicOrder extends React.Component {
    constructor() {
        super();
        this.state = {
            translate: new Animated.Value(0),
            mapVisible: false,
        };
        this.mapOverlayOpacity = new Animated.Value(100);
    }

    static navigationOptions = {
        header: null,
        drawerLabel: 'Home',
        drawerIcon: ({tintColor}) => (
            <Icon name="ios-home" size={25} color={tintColor}/>
        ),
    };

    componentWillMount() {
        this.props.getUserDetails(this.props.user.uid);
        this.props.getuserVehicles(this.props.user.uid);
        this.props.getUserCreditCards(this.props.user.uid);
        this.props.getPaymentInfo(this.props.user.uid);
        this.props.getUserPromotions(this.props.user.uid);
        this.props.getUserJobs(this.props.user.uid);

        // this.props.resetAllOrderInfo();
        this.props.getZones('calgary');

        // firestore.collection('zones').doc('calgary').collection('zones').doc('repsol').set({
        //     poly: this.poly,
        //     id: 'The Repsol Centre'
        // });
        // firestore.collection('zones').doc('calgary').collection('zones').doc('commons').set({
        //     poly: this.commons,
        //     id: 'The Commons'
        // });
    }

    gasSelection = (value) => {
        this.interactable.snapTo({index: 1});
        this.props.octaneSelected(value);
    };

    hourSelection = (value) => {
        this.props.hourSelected(value);
    };

    onPanDrag = (event) => {
        console.log(event);
        console.log('onPanDrag');
        Animated.timing(
            this.state.translate,
            {
                toValue: 10,
                duration: 300,
                delay: 10,
            }
        ).start();
    };


    regionChangeComplete = (event) => {
        console.log(event);
        console.log('regionChangeComplete');
        Animated.timing(
            this.state.translate,
            {
                toValue: 0,
                duration: 150,
            }
        ).start();
        this.props.setCoordinates(event.latitude, event.longitude);
        this.setState({
            ...this.state,
            longitudeDelta: event.longitudeDelta
        });


        let cat = 0;

        this.props.zones.map((element, index) => {
            console.log(element.id);
            if (inside([event.latitude, event.longitude], element.poly.map(c => [c.latitude, c.longitude]))) {
                cat = 1;
                this.props.setRates(element);
                console.log('inside');
                console.log(event);

            } else {
                if (cat === 1) {
                } else {
                    cat = 0;
                }

            }
        });

        if (cat === 1) {
            this.interactable.snapTo({index: 0});
        } else {
            // this.props.resetAllOrderInfo();

            this.interactable.snapTo({index: 2});
            this.props.octaneSelected(null);
        }


    };

    showMap = () => {
        console.log('showMap');
        Animated.timing(
            this.mapOverlayOpacity,
            {
                toValue: 0.01,
                duration: 1500,
                easing: Easing.inOut(Easing.ease)
            }
        ).start(() => this.setState({...this.state, mapVisible: true}));
    };

    submit = () => {
        if (this.props.orderHour === 0 || this.props.octane === 0 || this.props.orderFill === 0) {
            Alert.alert('Please select all fields!');
        } else {
            this.props.navigation.navigate('secondOrder');
        }
    };

    renderZones = () => {
        return this.props.zones.map((element, index) => {
            return <Polygon
                key={index}
                coordinates={element.poly}
                fillColor="rgba(209,133,255, 0.3)"
                strokeColor="#d185ff"
                strokeWidth={1}
            />
        })

    };
    renderMarkers = () => {
        if (this.state.longitudeDelta > 0.005810000002369975) {

            return this.props.zones.map((element, index) => {
                return <Marker coordinate={element.center} key={index}>
                    <View style={{
                        backgroundColor: '#dda6ff',
                        paddingHorizontal: 10,
                        borderRadius: 5,
                        paddingVertical: 5
                    }}>
                        <Text style={{color: 'white'}}>{element.id}</Text>
                    </View>
                </Marker>
            })
        } else {
            return null
        }
    };


    render() {
        return (
            <View
                style={{flex: 1, justifyContent: 'center'}}>

                {this.state.mapVisible ? null :
                    <Animated.View style={{
                        flex: 1,
                        top: 0,
                        left: 0,
                        height: height,
                        zIndex: 100,
                        width: width,
                        position: 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#F5FCFF',
                        elevation: 10,
                        opacity: this.mapOverlayOpacity
                    }}>
                        <Image source={require('../assets/LoginBackground.png')}
                               style={{
                                   position: 'absolute',
                                   resizeMode: 'cover',
                                   width: width,
                                   height: height,
                               }}/>
                        <View style={styles.logoContainer}>
                            <Image source={require('../assets/sure-fuel-icon.png')} style={[styles.logo]}/>
                            <Text style={styles.welcome}>
                                SURE FUEL </Text>
                            <Text style={styles.subheader}>
                                TAP THE APP TO FILL </Text>
                        </View>
                        <View style={styles.loginContainer}/>
                    </Animated.View>}


                <MapView
                    mapType={"satellite"}
                    showsUserLocation={true}
                    showsScale={true}
                    provider={'google'}
                    loadingEnabled={true}
                    initialRegion={{
                        latitude: 51.050297,
                        longitude: -114.070921,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    showsCompass={false}
                    onMapReady={() => this.showMap()}
                    onPanDrag={(event) => {
                        Animated.timing(
                            this.state.translate,
                            {
                                toValue: -10,
                                duration: 50,
                            }
                        ).start();
                    }}
                    onRegionChangeComplete={(event) => this.regionChangeComplete(event)}
                    style={{flex: 1}}
                    // setMapToolbarEnabled={true}
                >
                    {this.props.zones.length > 0 ? this.renderZones() : null}

                    {this.props.zones.length > 0 ? this.renderMarkers() : null}


                </MapView>

                <Animated.View
                    style={{
                        width: 60,
                        height: 90,
                        position: 'absolute',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bottom: height / 2,
                        transform: [{translateY: this.state.translate}]

                    }}>
                    <Image source={require('../assets/marker.png')}
                           style={{
                               position: 'absolute',
                               height: 89,
                               width: 60,
                               bottom: 0
                           }}/>
                </Animated.View>

                <View style={{
                    position: 'absolute',
                    top: 20,
                    alignSelf: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    <TouchableOpacity style={styles.prompt}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>Where is your vehicle located?</Text>
                    </TouchableOpacity>
                </View>
                <View style={{position: 'absolute', left: 20, top: 15}}>
                    <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()}>
                        <Icon name="ios-menu" size={35} color={'rgba(255,255,255,0.7)'}/>
                    </TouchableOpacity>
                </View>
                <View
                    style={{position: 'absolute', bottom: 0}}>
                    <Interactable.View
                        ref={ref => {
                            this.interactable = ref;
                        }}
                        verticalOnly={true}
                        snapPoints={[
                            {
                                y: height * 2 * 0.91,
                                damping: 0.6,
                                tension: 400,
                                id: 'preview'
                            },
                            {
                                y: height * 2 * 0.7,
                                damping: 0.6,
                                tension: 400,
                                id: 'open'
                            },
                            {
                                y: height * 2,
                                damping: 0.6,
                                tension: 400,
                                id: 'close'
                            },]}
                        boundaries={{top: -200}}
                        initialPosition={{y: height * 2}}>
                        <View style={styles.card}>
                            <View style={[styles.cardContainer]}>
                                <View style={{position: 'absolute'}}>
                                    <Text style={{color: 'rgba(0,0,0,0.2)', fontWeight: '900'}}>____</Text>
                                </View>
                                <View style={styles.send}>
                                    <View style={styles.recurring}>
                                        <View style={{paddingRight: 15,}}>
                                            <Text style={{color: '#dda6ff', fontWeight: 'bold', paddingLeft: 15}}>
                                                Make this a weekly service
                                            </Text>
                                            <Text style={{paddingLeft: 15, color: '#dda6ff', fontSize: 11}}>
                                                10% discount after 3 fills.
                                            </Text>
                                        </View>
                                        <Switch
                                            // onTintColor={'#cbffa2'}
                                            // tintColor={'white'}
                                            onValueChange={() => this.props.toggleRecurringOrder(!this.props.recurringOrder)}
                                            value={this.props.recurringOrder}/>
                                    </View>
                                    <TouchableOpacity style={styles.sendButton}
                                                      onPress={() => {
                                                          this.submit();
                                                      }
                                                      }>
                                        <Icon name="md-send" size={25} color={'white'}/>
                                    </TouchableOpacity>
                                </View>

                                <View style={[styles.buttonContainer,]}>
                                    <View style={styles.buttons}>
                                        <View style={styles.button}>
                                            <Text style={styles.selectionText}>REGULAR</Text>
                                            <TouchableOpacity onPress={() => this.gasSelection(87)}
                                                              style={[styles.buttonOpacity, {
                                                                  backgroundColor: this.props.octane === 87 ? '#7e4e9b' : '#d185ff',
                                                                  elevation: this.props.octane === 87 ? 10 : 1
                                                              }]}>
                                                <Text style={{color: 'white'}}>{this.props.regular}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.button}>
                                            <Text style={styles.selectionText}>PREMIUM</Text>
                                            <TouchableOpacity onPress={() => this.gasSelection(94)}
                                                              style={[styles.buttonOpacity, {
                                                                  backgroundColor: this.props.octane === 94 ? '#7e4e9b' : '#d185ff',
                                                                  elevation: this.props.octane === 94 ? 10 : 1
                                                              }]}>
                                                <Text style={{color: 'white'}}>{this.props.premium}</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                </View>

                                <View style={styles.buttonContainer}>
                                    <Text style={styles.selectionText}>FOR HOW LONG WILL YOUR VEHICLE BE HERE?</Text>
                                    <View style={styles.hourPicker}>
                                        <TouchableOpacity
                                            onPress={() => this.hourSelection(1)}
                                            style={[styles.hourButton, [{
                                                backgroundColor: this.props.orderHour === 1 ? '#7e4e9b' : '#dda6ff',
                                                elevation: this.props.orderHour === 1 ? 5 : 1
                                            }]]}>
                                            <Text style={styles.hourText}>1 HR</Text>
                                            <Text
                                                style={styles.preAuthText}>(${this.props.deliverRates === {} ? null : this.props.deliverRates.one})</Text>

                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.hourSelection(2)}
                                            style={[styles.hourButton, [{
                                                backgroundColor: this.props.orderHour === 2 ? '#7e4e9b' : '#dda6ff',
                                                elevation: this.props.orderHour === 2 ? 5 : 1
                                            }]]}>
                                            <Text style={styles.hourText}>2 HRS</Text>
                                            <Text
                                                style={styles.preAuthText}>(${this.props.deliverRates === {} ? null : this.props.deliverRates.two})</Text>

                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.hourSelection(4)}
                                            style={[styles.hourButton, [{
                                                backgroundColor: this.props.orderHour === 4 ? '#7e4e9b' : '#dda6ff',
                                                elevation: this.props.orderHour === 4 ? 5 : 1
                                            }]]}>
                                            <Text style={styles.hourText}>4 HRS</Text>
                                            <Text
                                                style={styles.preAuthText}>(${this.props.deliverRates === {} ? null : this.props.deliverRates.four})</Text>


                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.buttonContainer}>
                                    <Text style={styles.selectionText}>PRE-AUTHORIZATION AMOUNT</Text>
                                    <View style={styles.hourPicker}>
                                        <TouchableOpacity
                                            onPress={() => this.props.fillSelected(20)}
                                            style={[styles.preAuthButton, [{
                                                backgroundColor: this.props.orderFill === 20 ? '#7e4e9b' : '#dda6ff',
                                                elevation: this.props.orderFill === 20 ? 5 : 1
                                            }]]}>
                                            <Text style={styles.preAuthText}>$20</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.props.fillSelected(40)}
                                            style={[styles.preAuthButton, [{
                                                backgroundColor: this.props.orderFill === 40 ? '#7e4e9b' : '#dda6ff',
                                                elevation: this.props.orderFill === 40 ? 5 : 1
                                            }]]}>
                                            <Text style={styles.preAuthText}>$40</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.props.fillSelected(60)}
                                            style={[styles.preAuthButton, [{
                                                backgroundColor: this.props.orderFill === 60 ? '#7e4e9b' : '#dda6ff',
                                                elevation: this.props.orderFill === 60 ? 5 : 1
                                            }]]}>
                                            <Text style={styles.preAuthText}>$60</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.props.fillSelected(80)}
                                            style={[styles.preAuthButton, [{
                                                backgroundColor: this.props.orderFill === 80 ? '#7e4e9b' : '#dda6ff',
                                                elevation: this.props.orderFill === 80 ? 5 : 1
                                            }]]}>
                                            <Text style={styles.preAuthText}>$80</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.props.fillSelected(100)}
                                            style={[styles.preAuthButton, [{
                                                backgroundColor: this.props.orderFill === 100 ? '#7e4e9b' : '#dda6ff',
                                                elevation: this.props.orderFill === 100 ? 5 : 1
                                            }]]}>
                                            <Text style={styles.preAuthText}>$100</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.props.fillSelected(200)}
                                            style={[styles.preAuthButton, [{
                                                backgroundColor: this.props.orderFill === 200 ? '#7e4e9b' : '#dda6ff',
                                                elevation: this.props.orderFill === 200 ? 5 : 1
                                            }]]}>
                                            <Text style={styles.preAuthText}>$200 (Fill)</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </View>
                        </View>
                    </Interactable.View>
                </View>

            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BasicOrder);

const styles = StyleSheet.create({
    hourButton: {
        width: width / 4,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dda6ff',
        borderRadius: 30,
        marginVertical: 5
    },
    preAuthButton: {
        width: width / 8,
        height: width / 8,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dda6ff',
        borderRadius: 30,
        marginVertical: 5
    },
    buttonContainer: {
        height: height * 0.16,
        // marginBottom: 15,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    hourPicker: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderRadius: 30,
        width: width * 0.9,
    },
    hourText: {
        color: 'white', //rgba(209,133,255, 1)
        fontWeight: 'bold',
        textAlign: 'center'
    },
    preAuthText: {
        color: 'white', //rgba(209,133,255, 1)
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 11
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.85)',
        height: height * 2,
        width: width,
        zIndex: 11,
        borderTopRightRadius: 7,
        borderTopLeftRadius: 7,
        alignItems: 'center'
    },
    cardContainer: {
        alignItems: 'center',
        width: width,
        height: height * 2 * 0.3,
        paddingTop: 5,
        paddingHorizontal: 10,
        paddingBottom: 80,
        justifyContent: 'space-between'
    },
    button: {
        flexDirection: 'column',
        alignItems: 'center',
        marginHorizontal: 12
    },
    buttons: {
        justifyContent: 'center',
        width: width,
        alignItems: 'center',
        flexDirection: 'row',
    },
    prompt: {
        marginTop: 5,
        borderRadius: 30,
        backgroundColor: '#d185ff',
        alignItems: 'center',
        padding: 12,
        elevation: 5
    },

    buttonOpacity: {
        marginTop: 5,
        borderRadius: 30,
        width: width * 0.35,
        alignItems: 'center',
        padding: 12,
        elevation: 5,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    send: {
        position: 'absolute',
        left: 0,
        bottom: 10,
        flexDirection: 'row',
        width: width,
        justifyContent: 'space-between',
        paddingRight: 15,
        alignItems: 'center'

    },
    recurring: {
        paddingVertical: 10,
        backgroundColor: 'white',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        paddingHorizontal: 5,
        elevation: 2,
        flexDirection: 'row'
    },

    sendButton: {
        borderRadius: 100,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#7e4e9b',
        elevation: 10,
        paddingLeft: 5
    },
    selectionText: {
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 15,
    },
    logo: {
        marginBottom: 16,
        marginTop: 32,
        height: 125,
        width: 125,
    },
    logoContainer: {
        flex: 1,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    welcome: {
        fontSize: 30,
        textAlign: 'center',
        margin: 10,
        color: 'white',
        fontWeight: 'bold',
    },
    subheader: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modulesHeader: {
        fontSize: 16,
        marginBottom: 8,
    },
    module: {
        fontSize: 14,
        marginTop: 4,
        textAlign: 'center',
    }
});

/*               <Polygon
                        coordinates={this.poly}
                        fillColor="rgba(209,133,255, 0.3)"
                        strokeColor="#d185ff"
                        strokeWidth={1}
                    />

                    <Polygon
                        coordinates={this.commons}
                        fillColor="rgba(209,133,255, 0.3)"
                        strokeColor="#d185ff"
                        strokeWidth={1}
                    />*/