import React from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import {signUp} from '../services/authService';



const SingUp = ({navigation}: any) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    
    const handleSignUp = async () => {
        setLoading(true);
        try {
          const { userId } = await signUp(email, password);
          // Navigate to 'Home' after successful sign-up and account creation
          navigation.navigate('MainAppTabs');
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainAppTabs' }],
          });
        } catch (error: any) {
          alert(error.message);
        } finally {
          setLoading(false);
        }
      };


    return (
        <View style={styles.container}>
            <Image source={require('../../assets/signup.png')} style={styles.logo} />
            <Text style={styles.title}>Create an account!</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    value={email}
                    style={styles.input}
                    placeholder='Email'
                    autoCapitalize='none'
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    secureTextEntry={true}
                    value={password}
                    style={styles.input}
                    placeholder='Password'
                    autoCapitalize='none'
                    onChangeText={(text) => setPassword(text)}
                />
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleSignUp} style={[styles.button]}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    logo: {
        width: 250,
        height: 170,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#6C63FF',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 15,
        borderColor: '#6C63FF',
        borderWidth: 2,
    },
    buttonOutlineText: {
        color: '#6C63FF',
        fontWeight: 'bold',
    },
});

export default SingUp;
function firestore() {
    throw new Error('Function not implemented.');
}

