import React from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { signUp } from '../services/authService';
import Logo from "../assets/saverly.svg";
import backgroundStyles from "@/services/background";

const SignUp = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    // Handles user sign-up and account creation
    const handleSignUp = async () => {
        setLoading(true);
        try {
            const { userId } = await signUp(email, password);
            router.replace('/Home');
        } catch (error) {
            alert(error.message);
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
                            <TouchableOpacity onPress={handleSignUp} style={styles.button}>
                                <Text style={styles.buttonText}>Sign Up</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('/')}>
                                <Text style={styles.logInText}>Already have an account? Log In</Text>
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
    logInText: {
        color: '#6AD4DD',
        marginTop: 15,
        fontWeight: 'bold',
    },
});

export default SignUp;