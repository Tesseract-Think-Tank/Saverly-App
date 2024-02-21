import React from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import {signUp} from '../services/authService';
import styles from './Styles';



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
        <ImageBackground source={require('../../assets/wood_pattern.png')} style={styles.container}>
        <View style={styles.container}>
            <Image source={require('../../assets/saverly_logo_final.png')} style={styles.logo} />
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
        </ImageBackground>
    );
};

export default SingUp;
function firestore() {
    throw new Error('Function not implemented.');
}

