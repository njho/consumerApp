import React from 'react';
import {
    KeyboardAvoidingView,
    StyleSheet,
    Platform,
    Image,
    Text,
    Share,
    View,
    Button,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import agent from '../Helpers/agent';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


const mapStateToProps = state => ({
    userMeta: state.auth.userMeta,
    user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
    generateCode: (uid) => {
        dispatch(agent.actions.generateCode(uid));
    },
});

class Gift extends React.Component {
    constructor() {
        super();
        this.state = {
            // firebase things?
        };
    }

    static navigationOptions = {
        header: null,
        drawerLabel: 'Give 7 Receive 7',
        drawerIcon: ({tintColor}) => (
            <Icon name="ios-bowtie" size={25} color={tintColor}/>
        ),

    };

    async generateCodeAsync(uid) {
        let response = await agent.actions.generateCodeAsync(uid);
        console.log(response);
        let data = await response.json();
        return data;
    }

    generateCode = (uid) => {
        this.setState({...this.state, loading: true});
        // let response = await agent.actions.generateCode(uid);

        // this.props.generateCode(uid);
        this.generateCodeAsync(uid).then((response) => {
            console.log('this is the response + ' + response);
            this.setState({...this.state, loading: false});

            Share.share(
                {
                    message: `I love never having to go to the gas station with the Sure Fuel App!\n\n If you order fuel with this code, we both get $7 off our purchase! \n \nCode: ${response}`
                }).then(result => console.log(result)).catch(errorMsg => console.log(errorMsg));
        })


    };


    render() {
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={100} style={styles.avoidingView}
                                  contentContainerStyle={{paddingBottom: 5}} enabled>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Hello, {this.props.userMeta.firstName}</Text>
                    </View>
                    <View style={styles.content}>
                        <Text style={styles.contentText}>The team at Sure Fuel appreciates your commitment to our
                            brand!</Text>
                        <Text style={[styles.contentText, {
                            fontSize: 17,
                            fontWeight: 'normal',
                            marginTop: 10,
                            marginRight: 15,
                        }]}>We're currently offering the following promotion to help you share with the ones you
                            love</Text>

                        <TouchableOpacity style={styles.promotionContainer}
                                          onPress={() => this.generateCode(this.props.user.uid)}>
                            {this.state.loading ? <ActivityIndicator style={{position: 'absolute', top: 15, right: 20}} size="large" color="#7AFF9A"/>
                                : <Icon style={{position: 'absolute', top: 15, right: 20}} name="ios-heart" size={30}
                                        color={'white'}/>}

                            <Text style={styles.promotionText}>
                                {!this.state.loading ? 'SureFuel 7 for 7' : 'Generating Your Code'}
                            </Text>
                            <Text style={[styles.promotionText, {
                                fontSize: 17,
                                textDecorationLine: 'none',
                                fontWeight: 'normal',
                                marginTop: 10,
                                marginRight: 15,
                            }]}>
                                Receive $7 off your next purchase when your unique referral code is redeemed. </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{position: 'absolute', left: 30, top: 15, elevation: 5}}>
                        <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()}>
                            <Icon name="ios-menu" size={35} color={'rgba(255,255,255,0.9)'}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

        )
            ;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Gift);

const styles = StyleSheet.create({
    avoidingView: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
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
        flex: 1,
        alignItems: 'flex-start', padding: 30,
        width: width,
        justifyContent: 'flex-start'

    },
    contentText: {
        alignItems: 'flex-start',
        textAlign: 'left',
        color: '#91a3ff',
        fontWeight: 'bold',
        fontSize: 20,
    },
    promotion: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center'
    },
    promotionContainer: {
        alignSelf: 'stretch',
        backgroundColor: '#73c0ff',
        marginTop: 40,
        padding: 15,
        borderRadius: 5,
        elevation: 3
    },
    promotionText: {
        alignItems: 'flex-start',
        textAlign: 'left',
        color: 'white',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        fontSize: 20,
    }
});

