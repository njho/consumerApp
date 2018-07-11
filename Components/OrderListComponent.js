import React from 'react';
import {
    KeyboardAvoidingView,
    StyleSheet,
    Platform,
    Image,
    Text,
    ScrollView,
    Linking,
    FlatList,
    View,
    Button,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import MapView, {Marker} from 'react-native-maps';
import agent from '../Helpers/agent';
import moment from 'moment';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    cancelOrder: (jobId) => {
        dispatch(agent.actions.cancelOrder(jobId));
    },

});

class OrderListComponent extends React.Component {

    constructor() {
        super();
        this.state = {jobInfo: null}

    }

    componentWillMount() {
        console.log(this.props.item.jobId);

        console.log(this.state.jobInfo);
        console.log('OrderListComponent');
        console.log(this.props.item);
        agent.getters.getJobInformation(this.props.item.jobId).onSnapshot(doc => {
            this.setState({jobInfo: doc.data()})

        },(err) => {
            console.log(err);
            console.log('fck')
        })
    }

    openMap() {
        console.log('open directions');

        console.log(Platform.OS);

        if (Platform.OS === 'android') {
            Linking.openURL(`http://maps.google.com/maps?daddr=${this.state.jobInfo.routing.location.lat},${this.state.jobInfo.routing.location.lng}`).catch(err => console.error('An error occurred', err));

        } else {
            Linking.openURL('http://maps.apple.com/maps?daddr=');

        }
    }

    cancelOrder() {
        this.props.cancelOrder(jobId);
    }

    render() {
        return (

            <View
                key={this.props.index} style={{
                width: width, borderBottomColor: '#bbb',
                borderBottomWidth: 1
            }}>
                {this.state.jobInfo === null ? null :
                    <View>
                        {this.state.jobInfo.cancelled === true || this.state.jobInfo.chargeCaptured === true ? null :

                            <MapView
                                mapType={"satellite"}
                                provider={'google'}
                                initialRegion={{
                                    latitude: this.state.jobInfo.routing.location.lat,
                                    longitude: this.state.jobInfo.routing.location.lng,
                                    latitudeDelta: 0.0022,
                                    longitudeDelta: 0.0221,
                                }}
                                showsCompass={false}
                                style={{flex: 1, width: width, height: height * 0.3}}>
                                <Marker
                                    coordinate={{
                                        latitude: this.state.jobInfo.routing.location.lat,
                                        longitude: this.state.jobInfo.routing.location.lng,
                                    }}/>
                            </MapView>}

                        <View style={styles.orderContainer}>
                            <Text style={[styles.orderTitle, {color: '#91a3ff'}]}>
                                {moment.unix(this.state.jobInfo.timestamp / 1000).format('MMMM DD YYYY hh:mm A')}
                            </Text>
                            <TouchableOpacity onPress={() => this.openMap()}>
                                <Text style={[{
                                    color: '#bccaff',
                                    fontWeight: 'normal',
                                    fontSize: 12,
                                    textDecorationLine: 'none',
                                    marginTop: 2
                                }]}>
                                    Lat: {this.state.jobInfo.routing.location.lat}{"\n"}
                                    Lng: {this.state.jobInfo.routing.location.lng}{"\n"}
                                </Text>
                            </TouchableOpacity>
                            <Text style={[{
                                color: '#bccaff',
                                fontWeight: 'normal',
                                fontSize: 12,
                                marginTop: 2
                            }]}>
                                <Text style={{
                                    textDecorationLine: 'underline',
                                }}>Services:</Text> Fill, Windshield Washer Top-Up, Windshield Chip Repair,
                                Tire Check
                                {"\n"}
                                <Text style={{
                                    textDecorationLine: 'underline',
                                }}>Vehicle: </Text> Acura NSX, Black, BNN 2260 {"\n"}
                                <Text style={{
                                    textDecorationLine: 'underline',
                                }}>Fill:</Text> Premium {"\n"}

                                <Text style={{
                                    textDecorationLine: 'underline',
                                }}>Amount:</Text> 60 L{"\n"}
                                <Text style={{
                                    textDecorationLine: 'underline',
                                }}>OrderId:</Text> {this.props.item.jobId}
                            </Text>
                            {this.state.jobInfo.cancelled === true || this.state.jobInfo.chargeCaptured === true ? null :
                                <TouchableOpacity onPress={() => this.props.cancelOrder(this.props.item.jobId)}>
                                    <Text style={{
                                        color: '#91a3ff',
                                        textAlign: 'right',
                                        fontWeight: 'bold',
                                        fontSize: 16
                                    }}>
                                        Cancel Order
                                    </Text>
                                </TouchableOpacity>}

                            {this.state.jobInfo.cancelled === false ? null :
                                <Text style={{
                                    color: '#ff765f',
                                    textAlign: 'right',
                                    fontWeight: 'bold',
                                    fontSize: 16
                                }}>
                                    Cancelled
                                </Text>
                            }
                            </View>
                    </View>}


            </View>


        )
            ;
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderListComponent);


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

