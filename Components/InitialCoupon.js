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
    referral: state.auth.referral,
});

const mapDispatchToProps = dispatch => ({
    setInitialReferral: (value) => {
        dispatch({type: 'SET_INITIAL_REFERRAL', value: value});
    },
    sendReferral: (uid, code) => dispatch(agent.actions.validateGiftCode(uid, code))
});


class InitialCoupon extends React.Component {
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
            case 'referral':
                this.props.setInitialReferral(text);
                break;
        }
    };


    async validatePromotionAsync(uid) {
        let response = await agent.actions.validateGiftCode(uid, this.props.referral);
        console.log('This is the referralCode' + this.props.referral);
        let data = await response.json();
        console.log(data);
        return data;
    }

    submitReferral() {

        console.log(this.props.referral);
        console.log(this.props.user.uid);

        if (this.props.referral) {
            this.validatePromotionAsync(this.props.user.uid).then((response) => {
                console.log('this is the response + ' + response);
                if (typeof response.value === 'undefined') {
                    Alert.alert('Sorry, this code is invalid!');
                } else {
                    this.props.navigation.navigate('Home');
                }

            })
        } else {
            Alert.alert('Please provide all fields!');

        }
    }

    skip = () => {
        this.props.navigation.navigate('Home');
    };


    render() {
        return (

            <LinearGradient colors={['#484e4e', '#37abb8']}
                            style={styles.container}>

                <View style={styles.listContainer}>

                    <View style={styles.logoContainer}>
                        <Image source={require('../assets/sure-fuel-icon.png')} style={[styles.logo]}/>
                        <Text style={styles.welcome}>
                            Have a Referral Code?</Text>
                        <Text style={styles.subheader}>
                            We're currently offering $7 off for successful referrals! {"\n"} {"\n"}
                            Don't worry, if you don't have one now, you'll have the opportunity to apply one later.
                        </Text>
                    </View>


                    <View style={[styles.listItem,]}>
                        <TextInput
                            style={styles.textInput}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            placeholderTextColor={'white'}
                            placeholder={'Referral Code'}
                            value={this.props.referral}
                            onChangeText={(text) => this.textHandler('referral', text)}
                        />
                    </View>
                    <View style={{
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: 40,
                        left: 20,
                    }}>

                        <TouchableOpacity style={{
                            alignSelf: 'stretch',
                            width: width - 40,
                        }}
                                          onPress={() => this.submitReferral()}>
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

                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                width: width - 40,
                                marginTop: 10,
                            }}
                            onPress={() => this.skip()}>

                            <Text style={{color: 'white', fontSize: 12}}>Skip</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </LinearGradient>

        )
            ;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InitialCoupon);


const styles = StyleSheet.create({
    avoidingView: {
        height: height
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 0.07 * height,
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
        fontSize: 14,
        textAlign: 'center',
        color: 'white',
        marginHorizontal: 30,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
    listContainer: {
        justifyContent: 'center',
        paddingHorizontal: 20,
        alignItems: 'center',
        flex: 1
    },
    listItem: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        marginBottom: height * 0.15,
    },
    textInput: {
        color: 'white',
        alignSelf: 'stretch',
        borderBottomWidth: 0,
        borderColor: 'transparent',
        textAlign: 'center'
    },

});

