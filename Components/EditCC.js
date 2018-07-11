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
import {CreditCardInput, LiteCreditCardInput} from "react-native-credit-card-input";
import _ from 'lodash';
import agent from '../Helpers/agent';

import cars from './Helpers/cars';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const mapDispatchToProps = dispatch => ({
    setEditVehicle: (value) => {
        dispatch({type: 'SET_EDIT_VEHICLE', value: value});
    },
    deleteCreditCard: (uid, docId) => dispatch(agent.actions.deleteCreditCard(uid, docId))
});


const mapStateToProps = state => ({
    user: state.auth.user,
    creditCardDocId: state.edits.creditCardDocId
});


class EditCC extends React.Component {
    constructor() {
        super();
        this.state = {
            valid: false,
            number: null,
            exp_year: null,
            cvc: null
        };
    }

    static navigationOptions = {
        header: null,
        drawerLabel: 'Settings',
        drawerIcon: ({tintColor}) => (
            <Icon name="ios-cog" size={25} color={tintColor}/>
        ),
    };

    saveVehicle(isNew) {
        console.log(this.state);
        console.log(this.props.creditCardDocId);
        console.log(isNew);

        if(isNew && this.state.valid) {
            agent.actions.createStripeCustomer({
                uid: this.props.user.uid,
                number: this.state.number,
                exp_year: this.state.exp_year,
                cvc: this.state.cvc,
            });
        } else if(this.state.valid && !isNew) {
            agent.actions.updateStripeCustomer({
                uid: this.props.user.uid,
                number: this.state.number,
                exp_year: this.state.exp_year,
                cvc: this.state.cvc,
                docId: this.props.creditCardDocId
            });
        }
        this.props.navigation.goBack();

    }

    _onChange = (formData) => {
        let formInfo = JSON.stringify(formData, null, " ");
        // console.log(formData);
        this.setState({
            ...this.state,
            valid: formData.valid,
            number: formData.values.number,
            exp_year: formData.values.expiry,
            cvc: formData.values.cvc
        })
    };


    render() {
        const isNew = this.props.navigation.getParam('isNew');

        return (

            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Edit Credit Card</Text>
                    {isNew ? null : <TouchableOpacity onPress={() => Alert.alert(
                        'Delete Credit Card',
                        'Are you sure you would like to delete this Credit Card?',
                        [
                            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                            {text: 'OK', onPress: () => this.props.deleteCreditCard(this.props.user.uid, this.props.creditCardDocId)},
                        ],
                        {cancelable: false}
                    )}>
                        <Icon name="ios-trash" size={25} color={'rgba(255,255,255,0.9)'}/>
                    </TouchableOpacity>}

                </View>

                <View style={{paddingHorizontal: 20, paddingVertical: 25, borderBottomWidth: 1, borderColor: '#bbb'}}>
                    <LiteCreditCardInput onChange={this._onChange}/>
                </View>

                <View style={{position: 'absolute', left: 30, top: 15, elevation: 5}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="ios-arrow-back" size={35} color={'rgba(255,255,255,0.9)'}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.completionButton} onPress={() => this.saveVehicle(isNew)}>
                    <Icon name="ios-checkmark" size={30} color={'#91a3ff'} style={{paddingRight: 15}}/>
                    <Text style={{color: '#91a3ff', fontSize: 20, fontWeight: 'bold'}}>Save </Text>
                </TouchableOpacity>
            </View>

        )
            ;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCC);


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

