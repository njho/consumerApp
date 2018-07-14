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
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import NavigationService from '../Helpers/NavigationService';



const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    setOrderPromotion: (value) => {
        dispatch({type: 'SET_ORDER_PROMOTION', value: value});
    },

});

class PromotionsListComponent extends React.Component {

    constructor() {
        super();
        this.state = {promotion: null}
    }

    selectPromotion = (promotion) => {
        console.log('Promotion Selected');
        console.log(promotion);
        this.props.setOrderPromotion(promotion);
        NavigationService.navigate('OrderSummary');


    };

    conditionalRender = () => {
        if (this.props.item.status === 'activated' && this.props.item.issuerRedeemed === false) {
            return <View
                key={this.props.index}
                style={{
                    width: width,
                    paddingVertical: 20,
                    paddingHorizontal: 30,
                    borderBottomColor: '#bbb',
                    borderBottomWidth: 1
                }}>
                <TouchableWithoutFeedback
                    onPress={this.props.picker ? () => this.selectPromotion(this.props.item) : null}
                >
                    <View>
                        <Text style={styles.title}>
                            SureFuel 7 for 7
                        </Text>
                        <Text style={styles.subtitle}>
                            ${this.props.item !== null ? (this.props.item.value / 100).toFixed(2) : null}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        } else {
            return null;
        }


    }

    render() {
        return (<View>
                {this.conditionalRender()}
            </View>


        )
            ;
    }
};

export default connect(mapStateToProps, mapDispatchToProps)

(
    PromotionsListComponent
)
;


const
    styles = StyleSheet.create({
        title: {
            fontFamily: 'sans-serif',
            fontSize: 20,
            color: '#91a3ff',
            fontWeight: 'bold',
        },
        subtitle: {
            fontFamily: 'sans-serif',
            fontSize: 12,
            color: '#86939e',
            fontWeight: 'bold'
        }
    });

