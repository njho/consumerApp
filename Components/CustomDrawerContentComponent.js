import React from 'react';
import {
    StyleSheet,
    Platform,
    Image,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    AsyncStorage
} from 'react-native';
import {
    SwitchNavigator,
    createStackNavigator,
    StackNavigator,
    createDrawerNavigator,
    DrawerItems,
    SafeAreaView
} from 'react-navigation';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/Ionicons';


const height = Dimensions.get('window').height;

const logout = (props) => {
    console.log(props);
    firebase.auth().signOut();
    props.navigation.navigate('Loading');

};

class CustomDrawerContentComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            // firebase things?
        };
    }

    logout = () => {
        firebase.auth().signOut().then(() => {
                // AsyncStorage.clear();
                this.props.navigation.navigate('Loading');
                AsyncStorage.removeItem('userToken');
            }
        );
    };

    render() {
        return <ScrollView style={{height: height}}>
            <SafeAreaView style={styles.container} forceInset={{top: 'always', horizontal: 'never'}}>
                <DrawerItems {...this.props} />
                <View style={styles.bottomButtons}>
                    <TouchableOpacity style={styles.menuRow} onPress={() => this.logout()}>
                        <Icon style={{marginHorizontal: 25}} name="ios-log-out" size={25}/>
                        <Text style={[styles.logoutText]}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ScrollView>
    }

}

export default CustomDrawerContentComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height * 0.95,
    },
    bottomButtons: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        alignSelf: 'stretch'
    },
    menuRow: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        paddingVertical: 10,
        flex: 1,
        alignItems: 'center'
    },
    logoutText: {
        fontWeight: 'bold',
        color: 'black'
    }
});

