import React from 'react';
import {StyleSheet, Animated, Text, View, Easing, TouchableOpacity, Dimensions} from 'react-native';
import {connect} from 'react-redux';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const mapStateToProps = state => ({
    loginState: state.common.loginState
});

const mapDispatchToProps = dispatch => ({
    setLoginState: (value) => {
        dispatch({type: 'SET_LOGIN_STATE', value: value});
    },
});


class LoginButtons extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor() {
        super();
        this.state = {
            translate: new Animated.Value(10),
            opacity: new Animated.Value(0)
        };
    }

    componentDidMount() {
        // firebase things?
        Animated.parallel([ Animated.timing(
            this.state.translate,
            {
                toValue: 0,
                duration: 500,
                delay: 10,
            }
        ),  Animated.timing(
            this.state.opacity,
            {
                toValue: 1,
                duration: 500,
                delay: 10,
            }
        )]).start()

    }

    facebookLogin = async () => {
        this.props.setLoginState(2)
        // try {
        //     const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);
        //
        //     if (result.isCancelled) {
        //         throw new Error('User cancelled request'); // Handle this however fits the flow of your app
        //     }
        //
        //     console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);
        //
        //     // get the access token
        //     const data = await AccessToken.getCurrentAccessToken();
        //
        //     if (!data) {
        //         throw new Error('Something went wrong obtaining the users access token'); // Handle this however fits the flow of your app
        //     }
        //
        //     // create a new firebase credential with the token
        //     const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
        //
        //     // login with credential
        //     const currentUser = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
        //
        //     console.info(JSON.stringify(currentUser.user.toJSON()))
        //     // this.props.navigation.navigate('BasicOrder')
        //
        // } catch (e) {
        //     console.error(e);
        // }
    };

    render() {
        return (
            <Animated.View style={[styles.loginContainer, {
                opacity: this.state.opacity,
                transform: [{translateY: this.state.translate}]
            }]}>
                <TouchableOpacity style={{
                    borderRadius: 40,
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                    justifyContent: 'center',
                    width: width * 0.7,
                    backgroundColor: '#4267B2',
                    elevation: 5,
                    marginBottom: 15,
                }} onPress={() => this.facebookLogin()}>

                    <Text
                        style={{
                            color: 'white',
                            fontWeight: '600',
                            marginVertical: 15,
                            fontSize: 15
                        }}>
                        Continue with Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    borderRadius: 40,
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                    justifyContent: 'center',
                    width: width * 0.7,
                    elevation: 5,

                    backgroundColor: '#58B982',
                    marginBottom: 40,
                }} onPress={() => this.facebookLogin()}>

                    <Text
                        style={{
                            color: 'white',
                            fontWeight: '600',
                            marginVertical: 15,
                            fontSize: 15
                        }}>
                        Phone Authorization</Text>
                </TouchableOpacity>
            </Animated.View>

        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginButtons);


const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 20
    },

});
