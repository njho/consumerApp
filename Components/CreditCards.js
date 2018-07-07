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
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {ListItem, List,} from 'react-native-elements';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const list = [
    {
        title: '**** **** **** 0624',
        subtitle: 'Visa 06/20',
        route: 'EditCC'
    },

];

const mapStateToProps = state => ({
    user: state.auth.user,
    email: state.auth.email,
    firstName: state.auth.firstName,
    lastName: state.auth.lastName,
    phoneNumber: state.auth.phoneNumber,

    userInfoUpdated: state.auth.userInfoUpdated,
    vehicles: state.auth.vehicles,
    creditCards: state.auth.creditCards
});

const mapDispatchToProps = dispatch => ({
    setEditCreditCard: (value) => {
        dispatch({type: 'SET_EDIT_CREDIT_CARD', value: value});
    },
});


class CreditCards extends React.Component {
    constructor() {
        super();
        this.state = {
            // firebase things?
        };
    }

    static navigationOptions = {
        header: null,
        drawerLabel: 'Settings',
        drawerIcon: ({tintColor}) => (
            <Icon name="ios-cog" size={25} color={tintColor}/>

        ),

    };


    navigateToRoute = (item) => {
        if (item === null) {
            this.props.setEditVehicle(emptyObject);
            this.props.navigation.navigate('EditCC', {isNew: true})
        } else {
            this.props.setEditCreditCard(item);
            this.props.navigation.navigate('EditCC', {isNew: false})
        }
    };


    render() {
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={100} style={styles.avoidingView}
                                  contentContainerStyle={{paddingBottom: 5}} enabled>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Your Credit Cards</Text>
                    </View>
                    <List containerStyle={{marginTop: 0, flex: 1}}>
                        {
                            this.props.creditCards.map((item, i) => (
                                <ListItem
                                    key={i}
                                    leftAvatar={{source: {uri: item.avatar_url}}}
                                    title={`**** **** **** ${item.number}`}
                                    subtitle={`${item.exp_year} ${item.exp_month}`}
                                    subtitleNumberOfLines={2}
                                    containerStyle={{paddingTop: 20, paddingBottom: 20,}}
                                    titleStyle={{color: '#91a3ff', fontSize: 20, fontWeight: 'bold'}}
                                    subtitleContainerStyle={{paddingRight: 20}}
                                    onPress={() => this.navigateToRoute((item))}
                                />
                            ))
                        }
                    </List>
                    {this.props.creditCards.length > 0 ? null : <TouchableOpacity style={styles.titleView}
                                                                              onPress={() => this.props.navigation.navigate('EditCC', {isNew: true})}>
                        <Icon name="ios-add-circle-outline" size={30} color={'#91a3ff'} style={{paddingRight: 15}}/>
                        <Text style={{color: '#91a3ff', fontSize: 20, fontWeight: 'bold'}}>Add A New CreditCard</Text>
                    </TouchableOpacity>}

                    <View style={{position: 'absolute', left: 30, top: 15, elevation: 5}}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="ios-arrow-back" size={35} color={'rgba(255,255,255,0.9)'}/>
                        </TouchableOpacity>
                    </View>
                    {list.length > 0 ? null : <TouchableOpacity style={styles.titleView}>
                        <Icon name="ios-add-circle-outline" size={30} color={'#91a3ff'} style={{paddingRight: 15}}/>
                        <Text style={{color: '#91a3ff', fontSize: 20, fontWeight: 'bold'}}>Add A New Vehicle</Text>
                    </TouchableOpacity>}

                </View>
            </KeyboardAvoidingView>

        )
            ;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreditCards);


const styles = StyleSheet.create({
    avoidingView: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
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
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        justifyContent: 'center',
        paddingVertical: 25,
        backgroundColor: 'white',
        borderBottomColor: '#bbb',
        borderBottomWidth: 1
    }
});

