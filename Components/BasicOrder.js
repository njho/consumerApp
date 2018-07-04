import React from 'react';
import {
    StyleSheet,
    Platform,
    Image,
    Text,
    View,
    Button,
    TouchableOpacity,
    Dimensions,
    Animated,
    Easing
} from 'react-native';
import {connect} from 'react-redux';
import MapView, {Polygon} from 'react-native-maps';
import Interactable from 'react-native-interactable';
import Icon from 'react-native-vector-icons/Ionicons';

import agent from '../Helpers/agent';

import inside from 'point-in-polygon';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const mapStateToProps = state => ({
    octane: state.common.octane,
    orderHour: state.common.orderHour,
    user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
    octaneSelected: (value) => {
        dispatch({type: 'OCTANE_SELECTED', octane: value});
    },
    hourSelected: (value) => {
        dispatch({type: 'ORDER_HOUR_SELECTED', value: value});
    },
    getUserDetails: (uid) => {
        dispatch(agent.getters.getUser(uid))
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
        console.log(this.props.user.uid);
        this.props.getUserDetails(this.props.user.uid);
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

    commons = [
        {latitude: 51.0356349007015, longitude: -114.0366573241663},
        {latitude: 51.035744625039555, longitude: -114.03665195974827},
        {latitude: 51.035744625039555, longitude: -114.03656881126881},
        {latitude: 51.035747010348366, longitude: -114.0363864210558},
        {latitude: 51.0360117788631, longitude: -114.03638373884678},
        {latitude: 51.036016549453116, longitude: -114.03585534367085},
        {latitude: 51.03656277875984, longitude: -114.0358472970438},
        {latitude: 51.03656394626553, longitude: -114.036634663781},
        {latitude: 51.03667309004739, longitude: -114.03663769234106},
        {latitude: 51.03668478520088, longitude: -114.03565881173552},
        {latitude: 51.03564002933458, longitude: -114.03578755776823},
        {latitude: 51.03564002933458, longitude: -114.03593776147306},
        {latitude: 51.035535075388445, longitude: -114.03597531239927},
        {latitude: 51.03554461666609, longitude: -114.03667805116118},
        {latitude: 51.03562333528205, longitude: -114.03666100441097}]

    poly = [
        {latitude: 51.034877062138555, longitude: -114.06245120763265},
        {latitude: 51.034782606861526, longitude: -114.06242974996053},
        {latitude: 51.03470164504221, longitude: -114.06240829228841},
        {latitude: 51.03458020204807, longitude: -114.06238683461629},
        {latitude: 51.03451948043165, longitude: -114.06237610578023},
        {latitude: 51.03417538976893, longitude: -114.06257995366536},
        {latitude: 51.03417538976893, longitude: -114.06266578435384},
        {latitude: 51.03413490834654, longitude: -114.06279453038655},
        {latitude: 51.03400865219269, longitude: -114.06296619176351},
        {latitude: 51.033947929827335, longitude: -114.06324514150106},
        {latitude: 51.033900701265935, longitude: -114.06340607404195},
        {latitude: 51.03381973790583, longitude: -114.06340607404195},
        {latitude: 51.03377925617275, longitude: -114.06340607404195},
        {latitude: 51.03369829260046, longitude: -114.06334170102559},
        {latitude: 51.03371178653901, longitude: -114.06320222615682},
        {latitude: 51.03369829260046, longitude: -114.0631271243044},
        {latitude: 51.03366455773695, longitude: -114.06298764943563},
        {latitude: 51.03362741744859, longitude: -114.06284275940641},
        {latitude: 51.03362741744859, longitude: -114.0627140133737},
        {latitude: 51.03366115233916, longitude: -114.06257453850492},
        {latitude: 51.03362741744859, longitude: -114.06217757157071},
        {latitude: 51.03360042951846, longitude: -114.0619951813577},
        {latitude: 51.03359368253346, longitude: -114.06178060463651},
        {latitude: 51.03359368253346, longitude: -114.06153384140714},
        {latitude: 51.03364765838589, longitude: -114.06134072235807},
        {latitude: 51.033708381144685, longitude: -114.06113687447294},
        {latitude: 51.03394452445037, longitude: -114.06086865357145},
        {latitude: 51.034221147935135, longitude: -114.06078282288297},
        {latitude: 51.03448427605899, longitude: -114.06091156891569},
        {latitude: 51.03464620031569, longitude: -114.06110468796476},
        {latitude: 51.03471366858897, longitude: -114.06129780701383},
        {latitude: 51.035111729401905, longitude: -114.06153384140714},
        {latitude: 51.03519269050473, longitude: -114.06166258743986},
        {latitude: 51.03526690472472, longitude: -114.06195226601346},
        {latitude: 51.035179196997426, longitude: -114.06227413109525},
        {latitude: 51.03494980677193, longitude: -114.06245652130826},
        {latitude: 51.03488233884245, longitude: -114.0624457924722}];

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

        if (inside([event.latitude, event.longitude], this.poly.map(c => [c.latitude, c.longitude]))) {
            this.interactable.snapTo({index: 0});
        } else {
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
                                SUREFUEL </Text>
                            <Text style={styles.subheader}>
                                TAP THE APP TO FILL </Text>
                        </View>
                        <View style={styles.loginContainer}/>
                    </Animated.View>}


                <MapView
                    mapType={"satellite"}
                    showsUserLocation={true}
                    // showsMyLocationButton={true}
                    showsScale={true}
                    provider={'google'}
                    // showsBuildings={true}
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
                    <Polygon
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
                    />
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
                        initialPosition={{y: height * 2}} >
                        <View style={styles.card}>
                            <View style={[styles.cardContainer]}>
                                <View style={{position: 'absolute'}}>
                                    <Text style={{color: 'rgba(0,0,0,0.2)', fontWeight: '900'}}>____</Text>
                                </View>
                                <View style={styles.send}>
                                    <TouchableOpacity style={styles.sendButton}
                                                      onPress={() => this.props.navigation.navigate('secondOrder')
                                                      }>
                                        <Icon name="md-send" size={25} color={'white'}/>
                                    </TouchableOpacity>
                                </View>

                                <View style={[styles.buttonContainer,  ]}>
                                    <View style={styles.buttons}>
                                        <View style={styles.button}>
                                            <Text style={styles.selectionText}>REGULAR</Text>
                                            <TouchableOpacity onPress={() => this.gasSelection(87)}
                                                              style={[styles.buttonOpacity, {
                                                                  backgroundColor: this.props.octane === 87 ? '#7e4e9b' : '#d185ff',
                                                                  elevation: this.props.octane === 87 ? 10 : 1
                                                              }]}>
                                                <Text style={{color: 'white'}}>93.3</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.button}>
                                            <Text style={styles.selectionText}>PREMIUM</Text>
                                            <TouchableOpacity onPress={() => this.gasSelection(94)}
                                                              style={[styles.buttonOpacity, {
                                                                  backgroundColor: this.props.octane === 94 ? '#7e4e9b' : '#d185ff',
                                                                  elevation: this.props.octane === 94 ? 10 : 1
                                                              }]}>
                                                <Text style={{color: 'white'}}>101.4</Text>
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
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.hourSelection(2)}
                                            style={[styles.hourButton, [{
                                                backgroundColor: this.props.orderHour === 2 ? '#7e4e9b' : '#dda6ff',
                                                elevation: this.props.orderHour === 2 ? 5 : 1
                                            }]]}>
                                            <Text style={styles.hourText}>2 HRS</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.hourSelection(4)}
                                            style={[styles.hourButton, [{
                                                backgroundColor: this.props.orderHour === 4 ? '#7e4e9b' : '#dda6ff',
                                                elevation: this.props.orderHour === 4 ? 5 : 1
                                            }]]}>
                                            <Text style={styles.hourText}>4 HRS</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.buttonContainer}>
                                    <Text style={styles.selectionText}>PRE-AUTHORIZATION AMOUNT</Text>
                                    <View style={styles.hourPicker}>
                                        <TouchableOpacity
                                            onPress={() => this.hourSelection(1)}
                                            style={[styles.preAuthButton, [{
                                                backgroundColor: this.props.orderHour === 1 ? '#7e4e9b' : '#dda6ff',
                                                elevation: this.props.orderHour === 1 ? 5 : 1
                                            }]]}>
                                            <Text style={styles.hourText}>$20</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.hourSelection(2)}
                                            style={[styles.preAuthButton, [{
                                                backgroundColor: this.props.orderHour === 2 ? '#7e4e9b' : '#dda6ff',
                                                elevation: this.props.orderHour === 2 ? 5 : 1
                                            }]]}>
                                            <Text style={styles.hourText}>$40</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.hourSelection(4)}
                                            style={[styles.preAuthButton, [{
                                                backgroundColor: this.props.orderHour === 4 ? '#7e4e9b' : '#dda6ff',
                                                elevation: this.props.orderHour === 4 ? 5 : 1
                                            }]]}>
                                            <Text style={styles.hourText}>$60</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.hourSelection(4)}
                                            style={[styles.preAuthButton, [{
                                                backgroundColor: this.props.orderHour === 4 ? '#7e4e9b' : '#dda6ff',
                                                elevation: this.props.orderHour === 4 ? 5 : 1
                                            }]]}>
                                            <Text style={styles.hourText}>$80</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.hourSelection(4)}
                                            style={[styles.preAuthButton, [{
                                                backgroundColor: this.props.orderHour === 4 ? '#7e4e9b' : '#dda6ff',
                                                elevation: this.props.orderHour === 4 ? 5 : 1
                                            }]]}>
                                            <Text style={styles.hourText}>$100</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.hourSelection(4)}
                                            style={[styles.preAuthButton, [{
                                                backgroundColor: this.props.orderHour === 4 ? '#7e4e9b' : '#dda6ff',
                                                elevation: this.props.orderHour === 4 ? 5 : 1
                                            }]]}>
                                            <Text style={styles.hourText}>$200</Text>
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
        height: width/8,

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
        fontWeight: 'bold'
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
        right: 15,
        bottom: 15,

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

