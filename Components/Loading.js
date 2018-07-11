import React from 'react';
import {
    StyleSheet,
    Platform,
    Image,
    Text,
    View,
    Animated,
    Dimensions,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import agent from '../Helpers/agent';

import firebase from 'react-native-firebase';
import LoginButtons from './Login/LoginButtons'
import EmailPassword from "./Login/EmailPassword";


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const mapStateToProps = state => ({
    loginState: state.common.loginState,
    firstNavigation: state.common.firstNavigation
});

const mapDispatchToProps = dispatch => ({
    setLoginState: (value) => {
        dispatch({type: 'SET_LOGIN_STATE', value: value});
    },
    setUser: (value) => {
        dispatch({type: 'SET_USER', value: value});
    },
    getUser: (uid) => {
        dispatch(agent.getters.getUserMeta(uid));
    }
});


class Loading extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor() {
        super();
    }

    storeData = async () => {
        try {
            await  AsyncStorage.setItem('firstLoad', 'load');
        } catch (error) {
            // Error saving data
        }
    };

    componentWillReceiveProps(nextProps) {
        console.log('nextPros');
        console.log(nextProps);
        if(nextProps.firstNavigation != this.props.firstNavigation) {
            this.props.navigation.navigate(nextProps.firstNavigation);
        }
    }


    async componentDidMount() {
        let key = await AsyncStorage.getItem('firstLoad');
        console.log(key);

        firebase.auth().onAuthStateChanged(user => {
            // this.props.navigation.navigate('Home');
            console.log('This is the user: ' + user);
            console.log('This is the loading key: ' + key);

            if (user !== null) {
                if (user.metadata.lastSignInTime === user.metadata.creationTime && key === null) {

                    console.log("This is the user.uid: " + user.uid);
                    console.log("This is the user.email: " + user.email);
                    console.log("This is the user Creation Time: " + user.metadata.creationTime);

                    // //ASSUME THAT THIS IS AN INITIAL USER
                    // agent.setters.setInitialUser(user.uid, user.email, user.metadata.creationTime);
                    // this.props.setUser(user);

                    this.props.getUser(user.uid);
                    this.storeData().then(() => this.props.navigation.navigate('WalkThrough'));
                } else {
                    console.log('in else');
                    console.log(user.uid);
                    this.props.getUser(user.uid);

                    this.props.setUser(user);
                    // this.props.navigation.navigate('OrderSummary')
                    // this.props.navigation.navigate('Home')
                }
            } else {
                //Animate the Login in
                this.props.setLoginState(1);

            }
        });
        // this.props.navigation.navigate('WalkThrough')

    }

    renderView = () => {
        switch (this.props.loginState) {
            case 0:
                return <View style={styles.loginContainer}/>
            case 1:
                return <LoginButtons/>
            case 2:
                return <EmailPassword/>
        }
    };

    renderBack = () => {
        if (this.props.loginState !== 0 && this.props.loginState !== 1) {
            return <TouchableOpacity style={{position: 'absolute', left: 15, top: 15,}}
                                     onPress={() => this.props.setLoginState(1)}>
                <Icon
                    name={"ios-arrow-back"}
                    size={40}
                    color={'white'}
                />
            </TouchableOpacity>
        } else {
            return <View></View>
        }

    };


    render() {
        return (
            <View style={styles.container}>
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
                    {this.renderBack()}
                    <View style={styles.logoContainer}>
                        <Image source={require('../assets/sure-fuel-icon.png')} style={[styles.logo]}/>
                        <Text style={styles.welcome}>
                            SURE FUEL </Text>
                        <Text style={styles.subheader}>
                            TAP THE APP TO FILL </Text>
                    </View>

                    {this.renderView()}
                </Animated.View>
            </View>

        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Loading);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        height: height, width: width
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
        backgroundColor: 'black'
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
