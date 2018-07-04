import React from 'react';
import {StyleSheet, Animated, Text, View, Easing, TouchableOpacity, Dimensions, TextInput, Alert} from 'react-native';
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux'

import agent from '../../Helpers/agent';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const mapStateToProps = state => ({
    loginState: state.common.loginState,

    password: state.auth.password,
    email: state.auth.email
});

const mapDispatchToProps = dispatch => ({
    setLoginState: (value) => {
        dispatch({type: 'SET_LOGIN_STATE', value: value});
    },
    setEmail: (value) => {
        dispatch({type: 'SET_EMAIL', value: value});
    },
    setPassword: (value) => {
        dispatch({type: 'SET_PASSWORD', value: value});
    },
    login: (email,password) => dispatch(agent.Auth.login(email,password)),

});


class EmailPassword extends React.Component {
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
        Animated.parallel([Animated.timing(
            this.state.translate,
            {
                toValue: 0,
                duration: 500,
                delay: 10,
            }
        ), Animated.timing(
            this.state.opacity,
            {
                toValue: 1,
                duration: 500,
                delay: 10,
            }
        )]).start()
    }

    login() {

        if(this.props.password.length < 6) {
            Alert.alert('Please provide a password greater than 6 characters long!');
        } else if (this.props.email !== '' && this.props.password.length > 6) {
            this.props.login(this.props.email, this.props.password);
        }
    }

    textHandler(value, text) {
        switch (value) {
            case 'email':
                this.props.setEmail(text);
                break;

            case 'password':
                this.props.setPassword(text);
                break;
        }
    }

    render() {
        return (
            <Animated.View style={[styles.loginContainer, {
                opacity: this.state.opacity,
                transform: [{translateY: this.state.translate}]
            }]}>
                <View style={{marginBottom: 40}}>
                    <TextInput
                        style={styles.textInput}
                        underlineColorAndroid='rgba(250,250,250,1)'
                        placeholderTextColor={'white'}
                        keyboardType={'email-address'}
                        onChangeText={(text) => this.textHandler('email', text)}
                        placeholder={'E-mail'}/>
                    <TextInput
                        style={styles.textInput}
                        underlineColorAndroid='rgba(250,250,250,1)'
                        placeholderTextColor={'white'}
                        secureTextEntry={true}
                        password={true}
                        onChangeText={(text) => this.textHandler('password', text)}
                        placeholder={'Password'}/>
                </View>

                < TouchableOpacity style={{
                    borderRadius: 40,
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                    justifyContent: 'center',
                    width: width * 0.7,
                    backgroundColor: '#58B982',
                    marginBottom: 30,

                }} onPress={() => this.login()}>


                    <Text
                        style={{
                            color: 'white',
                            fontWeight: '600',
                            marginVertical: 15,
                            fontSize: 15
                        }}>
                        SIGN-IN/REGISTER</Text>
                </TouchableOpacity>

            </Animated.View>

        );
    }
}

export default withNavigation(connect(mapStateToProps,mapDispatchToProps)(EmailPassword));


const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },
    textInput: {
        color: 'white'
    }

});
