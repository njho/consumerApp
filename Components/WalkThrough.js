import React, {Component} from 'react';
import {
    AppRegistry,
    Alert,
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    Picker,
    TouchableOpacity,
    TextInput
} from 'react-native';
import AppIntro from 'react-native-app-intro';
import cars from './Helpers/cars';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const years = [];

const currentYear = new Date().getFullYear();

for (let year = 1950; year <= currentYear; year += 1) {
    years.unshift({
        label: year.toString(),
        value: year,
    });
}
;

export default class WalkThrough extends React.Component {

    static navigationOptions = {
        header: null,
        drawerLabel: 'WalkThrough'
    };

    componentWillMount() {
        console.log('walkthrough');
    }
    onSkipBtnHandle = (index) => {
        Alert.alert('Skip');
        console.log(index);
    };
    doneBtnHandle = () => {
        this.props.navigation.navigate('InitialDetails')
    };
    nextBtnHandle = (index) => {
        console.log(index);
    };
    onSlideChangeHandle = (index, total) => {
        console.log(index, total);
    };

    render() {
        const pageArray = [{
            title: 'Save Your Time',
            description: 'Schedule in your what?',
            img: require('../assets/sure-fuel-icon.png'),
            imgStyle: {
                height: 70 * 2.5,
                width: 80 * 2.5,
            },
            backgroundColor: '#fa931d',
            fontColor: '#fff',
            level: 10,
        }, {
            title: 'Page 2',
            description: 'Description 2',
            img: require('../assets/sure-fuel-icon.png'),
            imgStyle: {
                height: 93 * 2.5,
                width: 103 * 2.5,
            },
            backgroundColor: '#a4b602',
            fontColor: '#fff',
            level: 10,
        }];
        return (
            <AppIntro
                customStyles={{btnContainer: {flex: 1}}}
                onNextBtnClick={this.nextBtnHandle}
                onDoneBtnClick={this.doneBtnHandle}
                onSkipBtnClick={this.onSkipBtnHandle}
                onSlideChange={this.onSlideChangeHandle}
                showSkipButton={false}
                showDoneButton={true}
            >
                <View style={[styles.slide, {backgroundColor: '#fab821'}]}>
                    <View level={30} style={{width: width, alignItems: 'center'}}>
                        <View level={5} style={{position: 'absolute', top: 0, width: 100, height: 200, zIndex: 20}}>
                            <Image source={require('../assets/pin.png')} style={{height: 200, width: 100}}/>
                        </View>
                        <Image
                            resizeMode={'contain'}
                            source={require('../assets/city-order.png')} style={[styles.image]}/>
                    </View>


                    <View level={15}><Text style={styles.textTitle}>Pre-Schedule your Fills!</Text></View>
                    <View level={20}><Text style={styles.text}>Forget about ever filling up your vehicle
                        again!</Text></View>
                </View>
                <View style={[styles.slide, {backgroundColor: '#a4b602'}]}>
                    <View level={10} style={{width: width, alignItems: 'center'}}>

                        <View level={30}
                              style={{position: 'absolute', top: -40, width: width * 0.9, height: width * 0.3}}>
                            <Image
                                resizeMode={'contain'}
                                source={require('../assets/clouds.png')}
                                style={{height: width * 0.7, width: width * 0.9}}/>
                        </View>
                        <Image
                            resizeMode={'contain'}
                            source={require('../assets/cloudsbg.png')}
                            style={[styles.image]}/>

                    </View>
                    <View level={3}><Text style={styles.textTitle}>Order wherever you are!</Text></View>
                    <View level={50}><Text style={styles.text}>On demand, and on time!</Text></View>
                </View>
                <View level={30} style={[styles.slide, {backgroundColor: '#63b5b6'}]}>
                    <View  style={{width: width, alignItems: 'center'}}>
                        <View level={5}
                              style={{position: 'absolute', top: -30, height: width, width: width * 0.7, zIndex: 20}}>
                            <Image resizeMode={'contain'} source={require('../assets/money.png')}
                                   style={{height: width, width: width * 0.7}}/>
                        </View>
                        <Image
                            resizeMode={'contain'}
                            source={require('../assets/money-back.png')} style={[styles.image]}/>
                    </View>
                    <View level={8}><Text style={styles.textTitle}>And Make it Rain!</Text></View>
                    <View level={15}><Text style={styles.text}>Sign up to be a SureFuel driver! Earn extra cash.</Text></View>
                </View>
            </AppIntro>
        );
    }
}

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
        paddingRight: 20,
        paddingLeft: 20
    },
    textTitle: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
    text: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        marginHorizontal: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
    image: {
        width: width * 0.5,
        height: width * 0.6,
        marginBottom: 20,
    },

});


// AppRegistry.registerComponent('WalkThrough', () => WalkThrough);