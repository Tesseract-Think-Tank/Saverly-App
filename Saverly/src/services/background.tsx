import { StyleSheet } from 'react-native';

const backgroundStyles = StyleSheet.create({
    containerWithBGColor: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2B2D31',
    },
    background: {
        flex: 1,
        resizeMode: 'cover', // 'cover' or 'stretch' or 'contain' as per your requirement
        width: '100%',
    },
});

export default backgroundStyles;
