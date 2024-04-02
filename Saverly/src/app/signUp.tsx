import React from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import {signUp} from '../services/authService';
import { router } from 'expo-router';
import Logo from "../assets/saverly.svg";


const SingUp = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    
    const handleSignUp = async () => {
        setLoading(true);
        try {
          const { userId } = await signUp(email, password);
          // Navigate to 'Home' after successful sign-up and account creation

          router.replace('/Home');
        
        //   navigation.navigate('MainAppTabs');
        //   navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'MainAppTabs' }],
        //   });
        } catch (error: any) {
          alert(error.message);
        } finally {
          setLoading(false);
        }
      };


    return (
        <View style={styles.container}>
            {/* <Image source={require('../assets/login.png')} style={styles.logo} /> */}
            <View style={styles.logoView}><Logo /></View>
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
                <ActivityIndicator size="large" color="#6AD4DD" />
            ) : (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleSignUp} style={[styles.button]}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Text style={styles.logInText}>Already have an account? Log In</Text>
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
        backgroundColor: '#2B2D31',
    },
    logo: {
        width: 250,
        height: 250,
        marginBottom: 20,
    },
    logoView: {
        marginBottom: 70,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color:'#6AD4DD'
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: '#FFFFFF',
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
        backgroundColor: '#6AD4DD',
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
    logInText: {
        color: '#6AD4DD',
        marginTop: 15,
        fontWeight: 'bold',
    },
});

export default SingUp;
function firestore() {
    throw new Error('Function not implemented.');
}

