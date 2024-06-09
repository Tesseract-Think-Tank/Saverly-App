import React from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';
import Logo from "../assets/saverly.svg";
import backgroundStyles from "@/services/background";

const Login = ({ navigation }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const auth = FIREBASE_AUTH;

    // Handles user sign-in with Firebase Authentication
    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log('Logging in' + response);
            console.log(FIREBASE_AUTH.currentUser?.uid);

            router.replace('/Home');
        } catch (error) {
            console.error('Error logging in', error);
            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={backgroundStyles.containerWithBGColor}>
            <ImageBackground
                source={require('@/assets/backgroundWoodPattern.png')}
                style={backgroundStyles.background}
            >
                <View style={styles.container}>
                    <View style={styles.logoView}>
                        <Logo />
                    </View>
                    <Text style={styles.title}>Welcome!</Text>
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
                            <TouchableOpacity onPress={signIn} style={styles.button}>
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('signUp')}>
                                <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoView: {
        marginBottom: 70,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#6AD4DD'
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: '#fff',
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
    signUpText: {
        color: '#6AD4DD',
        marginTop: 15,
        fontWeight: 'bold',
    },
});

export default Login;