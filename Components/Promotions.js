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
    FlatList,
    TouchableOpacity,
    ScrollView,
    Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import PromotionsListComponent from './PromotionsListComponent';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


const mapStateToProps = state => ({
    promotions: state.auth.promotions
});

const mapDispatchToProps = dispatch => ({
});


class Promotions extends React.Component {
    constructor() {
        super();
        this.state = {
            // firebase things?
        };
    }

    static navigationOptions = {
        header: null,
        drawerLabel: 'Your Rewards',
        drawerIcon: ({tintColor}) => (
            <Icon name="ios-cash" size={25} color={tintColor}/>

        ),

    };


    render() {
        const isNew = this.props.navigation.getParam('isNew');

        return (
            <KeyboardAvoidingView keyboardVerticalOffset={100} style={styles.avoidingView}
                                  contentContainerStyle={{paddingBottom: 5}} enabled>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Your Rewards</Text>
                        <Text style={{color: 'white'}}>A list of available credits.</Text>
                    </View>
                    <ScrollView>
                        <FlatList
                            style={{flex: 1, width: width,}}
                            data={this.props.promotions}
                            keyExtractor={(item, i) => String(i)}
                            renderItem={({item, index}) =>
                                <PromotionsListComponent index={index} item={item}/>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Promotions);


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
        paddingBottom: 15,
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

});

