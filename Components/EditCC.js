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
    Picker,
    TouchableOpacity,
    Alert,
    Dimensions
} from 'react-native';
import MapView from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {CreditCardInput, LiteCreditCardInput} from "react-native-credit-card-input";
import _ from 'lodash';

import cars from './Helpers/cars';
import Dropdown from './Dropdown';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const list = [
    {
        title: 'Acura TL',
        subtitle: '1999 Red BNN2260',
        route: 'Vehicles'
    },
];
const addNew = [
    {
        title: 'Add New',
        subtitle: '1999 Red BNN2260',
        icon: 'add'

    },
];


const years = [];

const currentYear = new Date().getFullYear();

for (let year = 1950; year <= currentYear; year += 1) {
    years.unshift({
        label: year.toString(),
        value: year,
    });
}

const makes = Object.keys(cars).map(make => ({
    label: _.startCase(make),
    value: make,
}));

export default class EditCC extends React.Component {
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

    saveVehicle() {
        this.props.navigation.goBack();
    }

    _onChange = (formData) => console.log(JSON.stringify(formData, null, " "));


    render() {

        return (

            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Edit Credit Card</Text>
                    <TouchableOpacity onPress={() => Alert.alert(
                        'Delete Credit Card',
                        'Are you sure you would like to delete this Credit Card?',
                        [
                            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                            {text: 'OK', onPress: () => console.log('OK Pressed')},
                        ],
                        {cancelable: false}
                    )}>
                        <Icon name="ios-trash" size={25} color={'rgba(255,255,255,0.9)'}/>
                    </TouchableOpacity>
                </View>

                <View style={{paddingHorizontal: 20, paddingVertical: 25,  borderBottomWidth: 1, borderColor: '#bbb'}}>
                    <LiteCreditCardInput onChange={this._onChange} />
                </View>

                <View style={{position: 'absolute', left: 30, top: 15, elevation: 5}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="ios-arrow-back" size={35} color={'rgba(255,255,255,0.9)'}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.completionButton} onPress={() => this.saveVehicle()}>
                    <Icon name="ios-checkmark" size={30} color={'#91a3ff'} style={{paddingRight: 15}}/>
                    <Text style={{color: '#91a3ff', fontSize: 20, fontWeight: 'bold'}}>Save </Text>
                </TouchableOpacity>
            </View>

        )
            ;
    }
}

const styles = StyleSheet.create({
    avoidingView: {
        height: height
    },
    container: {
        backgroundColor: 'white',
        height: height,
        display: 'flex',
        flexDirection: 'column'
    },
    header: {
        width: width,
        paddingTop: 65,
        paddingBottom: 25,
        paddingHorizontal: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#91a3ff',
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    pickerTitle: {
        color: '#91a3ff',
        fontWeight: 'bold',
        paddingLeft: 5,
        fontSize: 20,
        flex: 1
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
    completionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        width: width,
        justifyContent: 'center',
        // paddingVertical: 25,
        marginTop: 'auto',
        marginBottom: 50,
        marginVertical: 25,
        backgroundColor: 'white',
    },
    listItem: {
        width: width,
        borderColor: '#bbb',
        borderBottomWidth: 1,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20
    }

});

