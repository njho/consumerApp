import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    iosPicker: {
        backgroundColor: 'rgba(178,181,189,0.1)',
        borderColor: '#dddddd',
        borderTopWidth: 1,
        padding: 0,
    },
    androidBoxStyle: {
        flex: 1,
        flexDirection: 'column',
    },
    androidPicker: {
        flex: 1,
        alignItems: 'center',
    },
    androidPickerWrapper: {
        borderBottomWidth: 1,
        borderColor: '#dddddd',
    },
    toggleBox: {
        borderColor: '#dddddd',
        borderBottomWidth: 1,
    },
});

export default styles;