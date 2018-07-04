import React from 'react';
import {
    KeyboardAvoidingView,
    StyleSheet,
    Platform,
    Image,
    Text,
    TextInput,
    View,
    Button,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';

import agent from '../Helpers/agent';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


const mapStateToProps = state => ({
    feedback: state.common.feedback,
    user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
    setFeedback: (value) => {
        dispatch({type: 'SET_FEEDBACK', value: value});
    },
    sendFeedback: (uid, feedback) => {
        dispatch(agent.actions.sendFeedback(uid, feedback));
    },
});


class ContactUs extends React.Component {
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

    componentWillReceiveProps(newProps) {
        if (!newProps.finished && this.props.finished) {
            this.props.navigation.navigate('Home')
        }
    }

    componentWillUnmount() {
        this.props.setFeedback(null);
    }

    submitFeedback() {

    }

    render() {
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={100} style={styles.avoidingView}
                                  contentContainerStyle={{paddingBottom: 5}} enabled>

                <LinearGradient colors={['#484e4e', '#37abb8']}
                                style={styles.container}>
                    <View style={{position: 'absolute', left: 20, top: 15}}>
                        <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()}>
                            <Icon name="ios-menu" size={35} color={'rgba(255,255,255,0.7)'}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.logoContainer}>

                        <Image source={require('../assets/sure-fuel-icon.png')} style={[styles.logo]}/>
                        <Text style={styles.welcome}>
                            SEND FEEDBACK </Text>
                        <Text style={styles.subheader}>
                            Your matter to us! We're trying to make the best product possible. Let us know how to better
                            serve you. </Text>
                    </View>


                    <View style={styles.listContainer}>

                        <View style={styles.listItem}>
                            <TextInput
                                style={styles.textInput}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholderTextColor={'white'}
                                multiline={true}
                                textAlignVertical={'top'}
                                numberOfLines={8}
                                value={this.props.feedback}
                                onChangeText={(text) => this.props.setFeedback(text)}
                                placeholder={'Please tell us your feedback!'}/>
                        </View>
                        <TouchableOpacity style={{alignSelf: 'stretch'}}
                                          onPress={() => this.props.sendFeedback(this.props.user.uid, this.props.feedback)}>
                            <View style={{
                                borderColor: 'white',
                                borderWidth: 1,
                                borderRadius: 30,
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 10,
                                alignSelf: 'stretch',
                            }}>
                                <Text style={{color: 'white', fontSize: 18}}>SUBMIT</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </KeyboardAvoidingView>

        )
            ;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);


const styles = StyleSheet.create({
    avoidingView: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        padding: 20
    },

    logo: {
        height: 90,
        width: 90,
    },
    logoContainer: {
        flex: 1,
        marginTop: 10,
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
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        marginBottom: 5
    },
    textInput: {
        color: 'white',
        alignSelf: 'stretch',
        textAlign: 'center',
        borderBottomWidth: 0,
        justifyContent: 'flex-start',
        borderColor: 'transparent',
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

