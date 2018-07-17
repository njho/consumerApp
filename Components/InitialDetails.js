import React from 'react';
import {
    KeyboardAvoidingView,
    StyleSheet,
    Platform,
    Image,
    Text,
    TextInput,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
    Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import agent from '../Helpers/agent';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const mapStateToProps = state => ({
    user: state.auth.user,
    email: state.auth.email,
    firstName: state.auth.firstName,
    lastName: state.auth.lastName,
    phoneNumber: state.auth.phoneNumber,

    userInfoUpdated: state.auth.userInfoUpdated
});

const mapDispatchToProps = dispatch => ({
    setEmail: (value) => {
        dispatch({type: 'SET_EMAIL', value: value});
    },
    setPhoneNumber: (value) => {
        dispatch({type: 'SET_PHONE_NUMBER', value: value});
    },
    setFirstName: (value) => {
        dispatch({type: 'SET_FIRST_NAME', value: value});
    },
    setLastName: (value) => {
        dispatch({type: 'SET_LAST_NAME', value: value});
    },
    setInitialUserDetails: (uid, firstName, lastName, email, phoneNumber) => dispatch(agent.setters.setInitialUserDetails(uid, firstName, lastName, email, phoneNumber))
});


class InitialDetails extends React.Component {
    constructor() {
        super();
        this.state = {
            // firebase things?
        };
    }

    static navigationOptions = {
        header: null,
        drawerLabel: 'Contact Us',
        drawerIcon: ({tintColor}) => (
            <Icon name="ios-mail" size={25} color={tintColor}/>

        ),
    };

    textHandler(value, text) {
        switch (value) {
            case 'firstName':
                this.props.setFirstName(text);
                break;
            case 'lastName':
                this.props.setLastName(text);
                break;
            case 'email':
                this.props.setEmail(text);
                break;
            case 'phoneNumber':
                this.props.setPhoneNumber(text);
                break;
        }
    };

    componentWillReceiveProps(nextProps) {

        //THIS WILL BE TRUE AFTER ALL THE INFORMATION IS UPDATED
        if (nextProps.userInfoUpdated === true) {
            this.props.navigation.navigate('InitialCoupon');
        }
    }

    initialLoadSubmit() {
        console.log(this.props.phoneNumber);
        console.log(this.props.firstName)
        if (this.props.user.uid && this.props.firstName && this.props.lastName && this.props.email && this.props.phoneNumber) {
            this.props.setInitialUserDetails(this.props.user.uid, this.props.firstName, this.props.lastName, this.props.email, this.props.phoneNumber, this.props.referral);
        } else {
            Alert.alert('Please provide all fields!');

        }
    }


    render() {
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={100} style={styles.avoidingView}
                                  contentContainerStyle={{paddingBottom: 5}} enabled>

                <LinearGradient colors={['#484e4e', '#37abb8']}
                                style={styles.container}>
                    <ScrollView style={{height: height}} contentContainerStyle={{paddingHorizontal: 20}}>

                        <View style={styles.logoContainer}>

                            <Image source={require('../assets/sure-fuel-icon.png')} style={[styles.logo]}/>
                            <Text style={styles.welcome}>
                                Welcome to Sure Fuel!</Text>
                            <Text style={styles.subheader}>
                                Please provide us with some initial information to help us serve you
                                better!
                            </Text>
                        </View>


                        <View style={styles.listContainer}>

                            <View style={styles.listItem}>
                                <TextInput
                                    style={styles.textInput}
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    placeholderTextColor={'white'}
                                    placeholder={'First Name'}
                                    value={this.props.firstName}
                                    onChangeText={(text) => this.textHandler('firstName', text)}
                                />
                            </View>

                            <View style={styles.listItem}>
                                <TextInput
                                    style={styles.textInput}
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    placeholderTextColor={'white'}
                                    placeholder={'Last Name'}
                                    value={this.props.lastName}
                                    onChangeText={(text) => this.textHandler('lastName', text)}
                                />
                            </View>
                            <View style={styles.listItem}>
                                <TextInput
                                    style={styles.textInput}
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    placeholderTextColor={'white'}
                                    keyboardType={'email-address'}
                                    placeholder={'E-mail'}
                                    value={this.props.email}
                                    onChangeText={(text) => this.textHandler('email', text)}
                                />
                            </View>
                            <View style={styles.listItem}>
                                <TextInput
                                    style={styles.textInput}
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    placeholderTextColor={'white'}
                                    keyboardType={'numeric'}
                                    placeholder={'Phone Number'}
                                    value={this.props.phoneNumber}
                                    onChangeText={(text) => this.textHandler('phoneNumber', text)}
                                />
                            </View>

                            <TouchableOpacity style={{alignSelf: 'stretch'}}
                                              onPress={() => this.initialLoadSubmit()}>
                                <View style={{
                                    borderColor: 'white',
                                    borderWidth: 1,
                                    borderRadius: 30,
                                    marginTop: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 10,
                                    alignSelf: 'stretch',
                                }}>
                                    <Text style={{color: 'white', fontSize: 18}}>SUBMIT</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </LinearGradient>
            </KeyboardAvoidingView>

        )
            ;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InitialDetails);


const styles = StyleSheet.create({
    avoidingView: {
        flex: 1,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        height: height
    },

    logo: {
        height: 90,
        width: 90,
    },
    logoContainer: {
        paddingVertical: 0.07 * height,
        justifyContent: 'center',
        alignItems: 'center'
    },
    welcome: {
        fontSize: 24,
        textAlign: 'center',
        margin: 10,
        color: 'white',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
    subheader: {
        fontSize: 16,
        textAlign: 'center',
        color: 'white',
        marginHorizontal: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
    listContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignSelf: 'stretch'
    },
    listItem: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        marginBottom: 10
    },
    textInput: {
        color: 'white',
        alignSelf: 'stretch',
        borderBottomWidth: 0,
        borderColor: 'transparent',
        textAlign: 'center'
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

