import React from 'react';
import {StyleSheet, Platform, Image, Text, View, ScrollView, TouchableOpacity, Dimensions} from 'react-native';

import {
    SwitchNavigator,
    createStackNavigator,
    StackNavigator,
    createDrawerNavigator,
    DrawerItems,
    SafeAreaView
} from 'react-navigation';

import {Provider} from 'react-redux';
import store from './store';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationService from './Helpers/NavigationService';


import BasicOrder from './Components/BasicOrder';
import Loading from './Components/Loading';
import Settings from './Components/Settings'
import WalkThrough from './Components/WalkThrough'
import ContactUs from './Components/ContactUs';
import Login from './Components/Login/Login';
import SecondOrder from './Components/SecondOrder';
import Gift from './Components/Gift';
import OrderSummary from './Components/OrderSummary';
import Vehicles from './Components/Vehicles';
import EditVehicle from './Components/EditVehicle';

import CreditCards from './Components/CreditCards';
import EditCC from './Components/EditCC';
import InitialDetails from './Components/InitialDetails';


import Promotions from './Components/Promotions';


import CustomDrawerContentComponent from './Components/CustomDrawerContentComponent'


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const mapStateToProps = state => ({
    subscriberSessionId: state.navigationReducer.subscriberSessionId
});

const mapDispatchToProps = dispatch => ({
    timeToggle: (value) => {
        dispatch({type: 'TIME_TOGGLE', isTimeInput: value});
    },
});


class App extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor() {
        super();
    }

    render() {
        return (
            <Provider store={store}>
                <Navigator
                    ref={navigatorRef => {
                        NavigationService.setTopLevelNavigator(navigatorRef);
                    }}/>
            </Provider>

        );
    }
}

const WalkThroughStack = StackNavigator({

    WalkThrough: WalkThrough,
    InitialDetails: InitialDetails,

});
const AuthStack = StackNavigator({
    Loading: Loading,
    Login: Login
});

const OrderStack = StackNavigator({
    Home: BasicOrder,
    secondOrder: SecondOrder,
    OrderSummary: OrderSummary,
});

const SettingsStack = StackNavigator({
    Settings: Settings,
    Vehicles: Vehicles,
    CreditCards: CreditCards,
    Promotions: Promotions,
    EditVehicle: EditVehicle,
    EditCC: EditCC

});

const drawerNav = createDrawerNavigator({
    Home: {
        screen: OrderStack,
        navigationOptions: {
            title: 'Home',
            headerTitle: 'Home',
            drawerIcon: ({tintColor}) => <Icon name="ios-home" size={25} color={tintColor}/>
        }
    },
    Gift: Gift,
    // WalkThrough: WalkThrough,
    Settings: {
        screen: SettingsStack,
        navigationOptions: {
            title: 'Settings',
            headerTitle: 'Settings',
            drawerIcon: ({tintColor}) => <Icon name="ios-cog" size={25} color={tintColor}/>
        }
    },
    ContactUs: ContactUs
}, {
    title: 'SureFuel',
    contentComponent: CustomDrawerContentComponent
});

const Navigator = new SwitchNavigator(
    {
        App: drawerNav,
        Loading: AuthStack,
        WalkThrough: WalkThroughStack
    },
    {
        initialRouteName: 'Loading',
    }
);

export default App;
//
// <Text style={styles.modulesHeader}>The following Firebase modules are enabled:</Text>
// {firebase.admob.nativeModuleExists && <Text style={styles.module}>Admob</Text>}
// {firebase.analytics.nativeModuleExists && <Text style={styles.module}>Analytics</Text>}
// {firebase.auth.nativeModuleExists && <Text style={styles.module}>Authentication</Text>}
// {firebase.crashlytics.nativeModuleExists && <Text style={styles.module}>Crashlytics</Text>}
// {firebase.firestore.nativeModuleExists && <Text style={styles.module}>Cloud Firestore</Text>}
// {firebase.messaging.nativeModuleExists && <Text style={styles.module}>Cloud Messaging</Text>}
// {firebase.links.nativeModuleExists && <Text style={styles.module}>Dynamic Links</Text>}
// {firebase.iid.nativeModuleExists && <Text style={styles.module}>Instance ID</Text>}
// {firebase.notifications.nativeModuleExists && <Text style={styles.module}>Notifications</Text>}
// {firebase.perf.nativeModuleExists && <Text style={styles.module}>Performance Monitoring</Text>}
// {firebase.database.nativeModuleExists && <Text style={styles.module}>Realtime Database</Text>}
// {firebase.config.nativeModuleExists && <Text style={styles.module}>Remote Config</Text>}
// {firebase.storage.nativeModuleExists && <Text style={styles.module}>Storage</Text>}


//// export default createSwitchNavigator({
//         SignIn: {
//             screen: App
//         },
//         BasicOrder: {
//             screen: BasicOrder
//         }
//     },
// );
//
