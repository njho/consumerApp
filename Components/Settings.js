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
import MapView from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {ListItem, List,} from 'react-native-elements';


import {AccessToken, LoginManager, LoginButton} from 'react-native-fbsdk';
import firebase from 'react-native-firebase';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const list = [
    {
        title: 'Your Vehicles',
        subtitle: 'Edit your vehicles to help us better identify yours.',
        route: 'Vehicles'
    },
    {
        title: 'Your Credit Cards',
        subtitle: 'We currently only support one card! Multi-card support coming soon.',
        route: 'CreditCards'

    },
];

/*   {
        title: 'View Your Promotions',
        subtitle: 'See all of your active promotions.',
        route: 'Promotions'
    },*/


export default class Settings extends React.Component {
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


    render() {
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={100} style={styles.avoidingView}
                                  contentContainerStyle={{paddingBottom: 5}} enabled>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Your Settings</Text>
                    </View>
                    <List containerStyle={{marginTop: 0}}>
                        {
                            list.map((item, i) => (
                                <ListItem
                                    key={i}
                                    leftAvatar={{source: {uri: item.avatar_url}}}
                                    title={item.title}
                                    subtitle={item.subtitle}
                                    subtitleNumberOfLines={2}
                                    containerStyle={{paddingTop: 20, paddingBottom: 20,}}
                                    titleStyle={{color: '#91a3ff', fontSize: 20, fontWeight: 'bold'}}
                                    subtitleContainerStyle={{paddingRight: 20}}
                                    onPress={() => this.props.navigation.navigate(item.route)}
                                />
                            ))
                        }
                    </List>
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

});

