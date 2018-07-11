import React from 'react';
import {StyleSheet, KeyboardAvoidingView, Image, Text, View, Button, TouchableOpacity, Dimensions, FlatList} from 'react-native';
import update from 'immutability-helper';


import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const mapStateToProps = state => ({
    servicesSelected: state.common.servicesSelected,
    windshield: state.common.windshield,
    topUp: state.common.topUp,
    tire: state.common.tire
});

const mapDispatchToProps = dispatch => ({
    octaneSelected: (value) => {
        dispatch({type: 'OCTANE_SELECTED', octane: value});
    },
    updateServicesSelected: (value) => {
        dispatch({type: 'UPDATE_SERVICES_SELECTED', value: value});
    }
});

class SecondOrder extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    };


    static navigationOptions = {
        header: null,
        drawerLabel: 'Home',
        drawerIcon: ({tintColor}) => (
            <Icon name="ios-home" size={25} color={tintColor}/>
        ),
    };

    componentWillMount() {
        this.setState({
            services: [
                {
                    title: 'Windshield Washer Fluid Top Up',
                    description: 'Just as it sounds.',
                    price: `${this.props.windshield}`
                },
                {
                    title: 'Windshield Chip Repair',
                    description: 'Our technician will take care of that nasty crack in your windshield for you.',
                    price: `${this.props.topUp}`
                },
                {
                    title: 'Tire Check & Fill',
                    description: 'Tire looking flat? Our mobile compressor has you taken care of.',
                    price: `${this.props.tire}`
                }]
        })
    }

    renderImage(index) {
        console.log(index);
        switch (index) {
            case 0:
                return <Image source={require('../assets/topup.png')}
                              style={{
                                  marginRight: 10,
                                  resizeMode: 'cover',
                                  width: width * 0.17,
                                  height: width * 0.17,
                              }}/>
            case 1:
                return <Image source={require('../assets/windshield.png')}
                              style={{
                                  marginRight: 10,
                                  resizeMode: 'cover',
                                  width: width * 0.17,
                                  height: width * 0.17,
                              }}/>
            case 2:
                return <Image source={require('../assets/tiregauge.png')}
                              style={{
                                  marginRight: 10,
                                  resizeMode: 'cover',
                                  width: width * 0.17,
                                  height: width * 0.17,
                              }}/>
        }
    }

    serviceSelection = (index) => {
        const newCollection = update(this.props.servicesSelected, {[index]: {$set: !this.props.servicesSelected[index]}});
        this.props.updateServicesSelected(newCollection);
    };

    render() {
        return (

            <KeyboardAvoidingView keyboardVerticalOffset={100} style={styles.avoidingView}
                                  contentContainerStyle={{paddingBottom: 5}} enabled>
                <View style={styles.container}>

                    <View style={styles.header}>

                        <View style={{position: 'absolute', left: 30, top: 15, elevation: 5}}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Icon name="ios-arrow-back" size={35} color={'rgba(255,255,255,0.9)'}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.headerTitle}>Additional Services</Text>
                    </View>
                    <FlatList
                        style={{flex: 1, width: width, }}
                        data={this.state.services}
                        keyExtractor={(item, i) => String(i)}
                        renderItem={({item, index}) =>
                            <TouchableOpacity
                                onPress={() => this.serviceSelection(index)}
                                key={index} style={styles.serviceContainer}>

                                {this.props.servicesSelected[index] ? <View style={{
                                        width: width * 0.17,
                                        marginRight: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}><Icon name="ios-checkmark" size={60} color={'#91a3ff'}/></View>
                                    : this.renderImage(index)}


                                <View style={styles.titleContainer}>
                                    <Text style={[styles.promotionText, {color: '#91a3ff'}]}>
                                        {item.title}
                                    </Text>
                                    <Text style={[styles.promotionText, {
                                        color: '#bccaff',
                                        fontWeight: 'normal',
                                        fontSize: 12,
                                        textDecorationLine: 'none',
                                        marginTop: 2
                                    }]}>
                                        {item.description}
                                    </Text>
                                </View>

                                <View style={styles.priceMarker}>
                                    <Text style={[{
                                        fontSize: 12,
                                        textDecorationLine: 'none',
                                        fontWeight: 'normal',
                                        color: 'white',
                                    }]}>
                                        ${item.price}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        }
                    />
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('OrderSummary')} style={{marginBottom: 20, marginTop: 10}}>
                        <Text style={{color: '#91a3ff', fontSize: 18, fontWeight: 'bold'}}>CONTINUE</Text>
                    </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>





        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SecondOrder);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
        alignItems: 'flex-start',
        paddingTop: 30,
        paddingBottom: 20,
        paddingHorizontal: 20,
        width: width,
        justifyContent: 'flex-start'

    },
    contentText: {
        alignItems: 'flex-start',
        textAlign: 'left',
        color: 'white',
        fontSize: 18,
        marginBottom: 10,
    },
    titleContainer: {
        padding: 10,
        alignSelf: 'flex-start',
        flex: 1
    },
    promotion: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center'

    },
    serviceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        // borderColor: '#92c1ff',
        // borderWidth: 1,
        backgroundColor: 'rgba(250,250,250,0.2)',
        borderRadius: 3,
        marginBottom: 3,
        marginHorizontal: 5,
        marginTop: 4,
        paddingLeft: 20,
        paddingRight: 30,

        paddingVertical: 20,
        elevation: 1,
    },
    priceMarker: {
        backgroundColor: '#92c1ff',
        borderRadius: 100,
        position: 'absolute',
        right: 5,
        bottom: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 35, height: 35
    },

    promotionText: {
        alignItems: 'flex-start',
        color: 'white',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        fontSize: 18,
    },
    avoidingView: {
        flex: 1,
    },

});

