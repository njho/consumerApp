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
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import agent from '../Helpers/agent';
import cars from './Helpers/cars';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const list = [
    {
        title: 'Acura TL',
        subtitle: '1999 Red BNN2260',
        route: 'Vehicles'
    },
];

const mapStateToProps = state => ({
    make: state.edits.make,
    model: state.edits.model,
    year: state.edits.year,
    color: state.edits.color,
    octane: state.edits.octane,
    license: state.edits.license,
    docId: state.edits.docId,


    userInfoUpdated: state.auth.userInfoUpdated,
    user: state.auth.user,
    vehicles: state.auth.vehicles
});

const mapDispatchToProps = dispatch => ({
    setMake: (value) => {
        dispatch({type: 'SET_MAKE', value: value});
    },
    setModel: (value) => {
        dispatch({type: 'SET_MODEL', value: value});
    },
    setYear: (value) => {
        dispatch({type: 'SET_YEAR', value: value});
    },
    setColor: (value) => {
        dispatch({type: 'SET_COLOR', value: value});
    },
    setOctane: (value) => {
        dispatch({type: 'SET_OCTANE', value: value});
    },
    setLicensePlate: (value) => {
        dispatch({type: 'SET_LICENSE_PLATE', value: value});
    },
    sendVehicleInformation: (uid, vehicleObject, isNew, docId, redirect) => dispatch(agent.actions.sendVehicleInformation(uid, vehicleObject, isNew, docId, redirect)),
    deleteVehicle: (uid, docId) => dispatch(agent.actions.deleteVehicle(uid, docId))

});


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

class EditVehicle extends React.Component {
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

    sendVehicleInformation(isNew, redirect) {
        console.log(this.props);
        if (this.props.make && this.props.model && this.props.year && this.props.color && this.props.octane && this.props.license) {
            console.log(isNew);
            if (isNew) {
                this.props.sendVehicleInformation(this.props.user.uid,
                    {
                        make: this.props.make,
                        model: this.props.model,
                        year: this.props.year,
                        color: this.props.color,
                        octane: this.props.octane,
                        license: this.props.license
                    },
                    isNew, null, redirect);
            } else {
                console.log('this is the docID + ' + this.props.docId);
                this.props.sendVehicleInformation(this.props.user.uid,
                    {
                        make: this.props.make,
                        model: this.props.model,
                        year: this.props.year,
                        color: this.props.color,
                        octane: this.props.octane,
                        license: this.props.license
                    },
                    isNew, this.props.docId, redirect);
            }
        } else {
            Alert.alert(
                'Please Ensure You Have Filled All Fields',
                '',
                [
                    {
                        text: 'OK',

                    },
                ],
                {cancelable: false}
            )
        }
    }

    backButton = (redirect) => {
        if (redirect) {
            this.props.navigation.navigate('secondOrder')
        } else {
            this.props.navigation.goBack()
        }
    };


    render() {

        const isNew = this.props.navigation.getParam('isNew');
        const redirect = this.props.navigation.getParam('redirect');
        console.log(redirect);

        return (

            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{isNew ? 'Add' : 'Edit'} Vehicle Details</Text>
                    {isNew ? null : <TouchableOpacity onPress={() => Alert.alert(
                        'Delete Vehicle',
                        'Are you sure you would like to delete this vehicle?',
                        [
                            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                            {
                                text: 'OK',
                                onPress: () => this.props.deleteVehicle(this.props.user.uid, this.props.docId)
                            },
                        ],
                        {cancelable: false}
                    )}>
                        <Icon name="ios-trash" size={25} color={'rgba(255,255,255,0.9)'}/>
                    </TouchableOpacity>}

                </View>

                <View style={styles.listItem}>
                    <Text style={styles.pickerTitle}>Make</Text>
                    <Picker
                        style={{flex: 1}}
                        selectedValue={this.props.make}
                        onValueChange={(itemValue, itemIndex) => this.props.setMake(itemValue)}>
                        {
                            Object.keys(cars).map(make => (
                                <Picker.Item key={make} label={make} value={make}/>
                            ))
                        }

                    </Picker>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.pickerTitle}>Model</Text>
                    <Picker
                        style={{flex: 1}}
                        selectedValue={this.props.model}
                        onValueChange={(itemValue, itemIndex) => this.props.setModel(itemValue)}>
                        {
                            this.props.make == null ? null : cars[this.props.make].map((item, index) => (
                                <Picker.Item key={item} label={item} value={item}/>
                            ))
                        }

                    </Picker>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.pickerTitle}>Year</Text>
                    <Picker
                        style={{flex: 1}}
                        selectedValue={this.props.year}
                        onValueChange={(itemValue, itemIndex) => this.props.setYear(itemValue)}>
                        {
                            years.map((make, index) => {
                                    return <Picker.Item key={index} label={make.label.toString()} value={make.value}/>
                                }
                            )
                        }

                    </Picker>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.pickerTitle}>Fuel Octane</Text>
                    <Picker
                        style={{flex: 1}}
                        selectedValue={this.props.octane}
                        onValueChange={(itemValue, itemIndex) => {
                            console.log(itemValue);
                            this.props.setOctane({itemValue});
                        }}>
                        <Picker.Item label={'Regular'} value={'Regular'}/>
                        <Picker.Item label={'Premium'} value={'Premium'}/>
                        <Picker.Item label={'Diesel'} value={'Diesel'}/>

                    </Picker>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.pickerTitle}>Color</Text>
                    <Picker
                        style={{flex: 1}}
                        selectedValue={this.props.color}
                        onValueChange={(itemValue, itemIndex) => this.props.setColor(itemValue)}>
                        <Picker.Item style={{color: 'red', fontWeight: 'bold'}} label={'Red'} value={'Red'}/>
                        <Picker.Item label={'Orange'} value={'Orange'}/>
                        <Picker.Item label={'Yellow'} value={'Yellow'}/>
                        <Picker.Item label={'Green'} value={'Green'}/>
                        <Picker.Item label={'Blue'} value={'Blue'}/>
                        <Picker.Item label={'Indigo'} value={'Indigo'}/>
                        <Picker.Item label={'Violet'} value={'Violet'}/>
                        <Picker.Item label={'White'} value={'White'}/>
                        <Picker.Item label={'Black'} value={'Black'}/>
                        <Picker.Item label={'Grey'} value={'Grey'}/>
                    </Picker>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.pickerTitle}>License Plate</Text>
                    <TextInput
                        style={{flex: 1}}
                        value={this.props.license}
                        autoCapitalize={'characters'}
                        onChangeText={(text) => this.props.setLicensePlate(text)}

                    />
                </View>

                <View style={{position: 'absolute', left: 30, top: 15, elevation: 5}}>
                    <TouchableOpacity onPress={() => this.backButton(redirect)}>
                        <Icon name="ios-arrow-back" size={35} color={'rgba(255,255,255,0.9)'}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.completionButton} onPress={() => this.sendVehicleInformation(isNew, redirect)}>
                    <Icon name="ios-checkmark" size={30} color={'#91a3ff'} style={{paddingRight: 15}}/>
                    <Text style={{color: '#91a3ff', fontSize: 20, fontWeight: 'bold'}}>Save </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditVehicle);


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

