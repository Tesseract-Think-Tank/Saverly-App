import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import styles from './Styles';

const Login = ({navigation}: any) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log('Logging in' + response);

            console.log(FIREBASE_AUTH.currentUser?.uid);
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainAppTabs' }],
            });
  
        } catch (error: any) {
            console.error('Error logging in', error);
            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={require('../../assets/wood_pattern.png')} style={styles.container}>
        <View style={styles.container}>
            <Image source={require('../../assets/saverly_logo_final.png')} style={styles.logo} />
            <Text style={styles.title}>Welcome Back!</Text>
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
                    <TouchableOpacity onPress={signIn} style={styles.button}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={[styles.button, styles.buttonOutline]}>
                        <Text style={styles.buttonOutlineText}>Create an account</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
        </ImageBackground>
    );
};

export default Login;
