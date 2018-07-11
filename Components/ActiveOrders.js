import React from 'react';
import {
    KeyboardAvoidingView,
    StyleSheet,
    Platform,
    Image,
    Text,
    ScrollView,
    TextInput,
    FlatList,
    View,
    Button,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';

import OrderListComponent from './OrderListComponent';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


const mapStateToProps = state => ({
    userMeta: state.auth.userMeta,
    userJobs: state.auth.userJobs

});

const mapDispatchToProps = dispatch => ({

});

class ActiveOrders extends React.Component {
    constructor() {
        super();

    }

    static navigationOptions = {
        header: null,
        drawerLabel: 'Orders',
        drawerIcon: ({tintColor}) => (
            <Icon name="ios-radio-button-on" size={25} color={tintColor}/>

        ),

    };

    render() {
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={100} style={styles.avoidingView}
                                  contentContainerStyle={{paddingBottom: 5}} enabled>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Your Orders</Text>
                    </View>
                    <ScrollView>
                        <FlatList
                            style={{flex: 1, width: width,}}
                            data={this.props.userJobs}
                            keyExtractor={(item, i) => String(i)}
                            renderItem={({item, index}) =>
                              <OrderListComponent index={index} item={item}/>
                            }
                        />
                    </ScrollView>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveOrders);


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
    },
    orderContainer: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        alignSelf: 'flex-start',
        flex: 1,
        width: width,
    },
    orderTitle: {
        fontWeight: 'bold',
        fontSize: 18
    }
});

