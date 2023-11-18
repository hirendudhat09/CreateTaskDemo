import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Alert} from 'react-native';
import ContentView from '../../../components/ContentView';
import TextInputWithLabel from '../../../components/TextInputWithLabel';
import ButtonComponent from '../../../components/Button';
import {message, eye_off, eye_on} from '../../../constants/assets';
import Regex from '../../../helpers/Regex';
import {moderateScale} from '../../../helpers/ResponsiveFonts';
import colors from '../../../constants/colors';
import styles from './styles';
import Loader from '../../../helpers/loader';
import ErrorComponent from '../../../components/Error';
import auth from '@react-native-firebase/auth';

export default function SignInScreen({navigation}) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, saetLoader] = useState(false);

  const [error, setError] = useState({
    email: false,
    password: false,
  });

  const Loginfucation = async () => {
    saetLoader(true);

    if (Regex.validateEmail(email) && Regex.validatePassword(password)) {
      const editErrorState = {...error};
      editErrorState.email = false;
      editErrorState.password = false;

      setError(editErrorState);
      try {
        const result = await auth().signInWithEmailAndPassword(email, password);
        console.log(result);
        // firestore().collection('users').doc(result.user.uid).set({
        //   name: name,
        //   email: email,
        //   uid: result.user.uid,
        // });
        Alert.alert('Login SuccessFully');
        saetLoader(false);
      } catch (error) {
        Alert.alert('User Dose not exist');
        console.log(error);
        saetLoader(false);
      }
      // CheckConnectivity();
    } else {
      const editErrorState = {...error};
      if (!Regex.validateEmail(email)) {
        editErrorState.email = true;
      } else {
        editErrorState.email = false;
      }
      if (!Regex.validatePassword(password)) {
        editErrorState.password = true;
      } else {
        editErrorState.password = false;
      }
      setError(editErrorState);
      saetLoader(false);
    }
  };
  return (
    <View style={styles.container}>
      <ContentView headerText={'Dashboard'}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginTop: moderateScale(200),
              marginHorizontal: moderateScale(20),
            }}>
            <Text style={styles.headerText}>Login to Your Account</Text>
          </View>
          <View style={styles.contentView}>
            <TextInputWithLabel
              icon={message}
              iconPress={true}
              inputPlaceholder={'Please enter Email'}
              inputValue={email}
              label={'Email Address'}
              onTextInputChange={text => setEmail(text.trim())}
              inputMaxLength={50}
              keyboardType={'deafult'}
            />
            {error.email && (
              <ErrorComponent
                right={'left'}
                errorMessage={'Enter valid email'}
              />
            )}
            <TextInputWithLabel
              icon={showPassword ? eye_on : eye_off}
              inputPlaceholder={'Please enter password'}
              inputValue={password}
              label={'Password'}
              onButtonPress={() => setShowPassword(!showPassword)}
              onTextInputChange={text => setPassword(text)}
              showPassword={showPassword}
              inputMaxLength={10}
              type="password"
            />
            {error.password && (
              <ErrorComponent
                right={'left'}
                errorMessage={
                  'Please enter valid pasword. Password should be Xyz@1234'
                }
              />
            )}
            <TouchableOpacity
            // onPress={() => navigation.navigate('ForgetPasswordScreen')}
            >
              <Text style={styles.forgotPassword}> {'Forgot Password?'}</Text>
            </TouchableOpacity>
            <View style={styles.buttonView}>
              <ButtonComponent
                onButtonPress={() => Loginfucation()}
                buttonText={'Login'}
                buttonDisable={password !== '' && email !== '' ? false : true}
              />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={[styles.signUp, {color: colors.inputLabelColor}]}>
                {'Don’t have an account?'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SignUpScreen');
                }}>
                <Text style={[styles.signUp, {color: colors.purpal}]}>
                  {' Sign Up Now'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ContentView>
      <Loader value={loader} />
    </View>
  );
}
