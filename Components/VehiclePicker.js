import React from 'react';
import {
    KeyboardAvoidingView,
    StyleSheet,
    Platform,
    Image,
    Text,
    ScrollView,
    TextInput,
    View,
    Button,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {ListItem, List,} from 'react-native-elements';
import {connect} from 'react-redux';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


const emptyObject = {
    make: 'AC',
    model: 'Ace',
    color: 'Red',
    year: 2018,
    license: '',
    octane: 'Regular'
};

const mapStateToProps = state => ({
    user: state.auth.user,
    email: state.auth.email,
    firstName: state.auth.firstName,
    lastName: state.auth.lastName,
    phoneNumber: state.auth.phoneNumber,

    userInfoUpdated: state.auth.userInfoUpdated,
    vehicles: state.auth.vehicles
});

const mapDispatchToProps = dispatch => ({

    setOrderVehicle: (value) => {
        dispatch({type: 'SET_ORDER_VEHICLE', value: value});
    },
});

class VehiclePicker extends React.Component {
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

    pickVehicle = (id) => {
        console.log('This is the ID of the orderVehicle')
        this.props.setOrderVehicle(id);
        this.props.navigation.navigate('OrderSummary')
    };


    render() {
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={100} style={styles.avoidingView}
                                  contentContainerStyle={{paddingBottom: 5}} enabled>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Please Pick a Vehicle</Text>
                    </View>
                    <ScrollView>
                        <List containerStyle={{marginTop: 0}}>
                            {
                                this.props.vehicles.map((item, i) => (
                                    <ListItem
                                        key={i}
                                        leftAvatar={{source: {uri: item.avatar_url}}}
                                        title={item.title}
                                        subtitle={item.subtitle}
                                        subtitleNumberOfLines={2}
                                        containerStyle={{paddingTop: 20, paddingBottom: 20,}}
                                        titleStyle={{color: '#91a3ff', fontSize: 20, fontWeight: 'bold'}}
                                        subtitleContainerStyle={{paddingRight: 20}}
                                        onPress={() => this.pickVehicle(item)}
                                        hideChevron
                                        leftIcon={{
                                            name: 'directions-car',
                                            size: 35,
                                            color: '#91a3ff',
                                            style: {marginRight: 20, marginLeft: 10,}
                                        }}
                                    />
                                ))
                            }
                        </List>
                    </ScrollView>

                    <View style={{position: 'absolute', left: 30, top: 15, elevation: 5}}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="ios-arrow-back" size={35} color={'rgba(255,255,255,0.9)'}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

        )
            ;
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(VehiclePicker);


const styles = StyleSheet.create({
    avoidingView: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
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

