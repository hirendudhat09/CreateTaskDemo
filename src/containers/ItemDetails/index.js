/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ContentView from '../../components/ContentView';
import { Back, message } from '../../constants/assets';
import { moderateScale, verticalScale } from '../../helpers/ResponsiveFonts';
import colors from '../../constants/colors';
import styles from './styles';
import firestore from '@react-native-firebase/firestore';
import ButtonComponent from '../../components/Button';
import TextInputWithLabel from '../../components/TextInputWithLabel';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import Loader from '../../helpers/loader';
import { RNCamera } from 'react-native-camera';
import auth from '@react-native-firebase/auth';

const ItemDetialsScreen = ({ navigation, route }) => {
  const [data, setData] = useState({});
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [barcodeData, setBarcodeData] = useState('');
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  console.log(data);
  useEffect(() => {
    const user = auth().onAuthStateChanged(userExist => {
      console.log('userExist!!', userExist);
      if (userExist) {
        setData(userExist);
      } else {
        setData('');
      }
    });
  }, []);

  const createTask = () => {
    setLoader(true);
    try {
      firestore()
        .collection('TaskList')
        .doc(data.uid)
        .collection('tasks')
        .add({
          name: taskName,
          description: description,
          createdAt: firestore.FieldValue.serverTimestamp(),
          startDate: moment.utc(startDate).local().format('DD-MM-YYYY'),
          endDate: moment.utc(endDate).local().format('DD-MM-YYYY'),
          barcodeData: barcodeData,
        });
      setLoader(false);

      Alert.alert('Create Task SuccessFully');
      navigation.pop();
    } catch (error) {
      console.log(error);
      Alert.alert('Something Went Wrong');
      setLoader(false);
    }
  };
  return (
    <View style={styles.container}>
      <ContentView
        visible={'true'}
        iconVisible={true}
        leftIcon={Back}
        headerText={'Create Task'}
        onLeftIconPress={() => navigation.goBack()}>
        <Loader value={loader} />

        <ScrollView
          style={{ marginHorizontal: moderateScale(20) }}
          showsVerticalScrollIndicator={false}>
          <TextInputWithLabel
            icon={message}
            iconPress={true}
            inputPlaceholder={'Please enter task name'}
            inputValue={taskName}
            label={'Task Name'}
            onTextInputChange={text => setTaskName(text)}
            inputMaxLength={50}
            keyboardType={'deafult'}
          />

          <TextInputWithLabel
            icon={message}
            iconPress={true}
            inputPlaceholder={'Please enter Description'}
            inputValue={description}
            label={'Description'}
            onTextInputChange={text => setDescription(text)}
            inputMaxLength={50}
            keyboardType={'deafult'}
          />

          <Text
            style={{
              color: colors.inputLabelColor,
              fontSize: moderateScale(14),
              fontWeight: '400',
              letterSpacing: 0.03,
              lineHeight: 20,
              marginTop: 20,
            }}>
            Start Date
          </Text>

          <TouchableOpacity
            onPress={() => setStartDateOpen(true)}
            style={{
              borderRadius: 10,
              flexDirection: 'row',
              marginTop: verticalScale(4.65),
              borderWidth: 1,
              shadowOpacity: 0.15,
              shadowRadius: 3,
              elevation: 3,
              backgroundColor: colors.White,
              borderColor: colors.borderColor,
              shadowColor: colors.Black,
              shadowOffset: { width: 0, height: 1 },
            }}>
            <Text
              style={{
                fontSize: moderateScale(15),
                padding: moderateScale(15),
                color: startDate !== '' ? colors.Black : colors.Gray,
                fontWeight: startDate !== '' ? '700' : '400',
              }}>
              {startDate !== ''
                ? moment.utc(startDate).local().format('DD-MM-YYYY')
                : 'Select Start Date'}
            </Text>
          </TouchableOpacity>
          {startDateOpen &&
            <DatePicker
              modal
              mode="date"
              minimumDate={new Date()}
              open={startDateOpen}
              date={new Date()}
              onConfirm={date => {
                console.log(date);
                setStartDateOpen(false);
                setEndDateOpen(false);
                setStartDate(date);
              }}
              onCancel={() => {
                setStartDateOpen(false);
              }}
            />
          }
          <Text
            style={{
              color: colors.inputLabelColor,
              fontSize: moderateScale(14),
              fontWeight: '400',
              letterSpacing: 0.03,
              lineHeight: 20,
              marginTop: 20,
            }}>
            End Date
          </Text>
          <TouchableOpacity
            onPress={() => setEndDateOpen(true)}
            style={{
              borderRadius: 10,
              flexDirection: 'row',
              marginTop: verticalScale(4.65),
              borderWidth: 1,
              shadowOpacity: 0.15,
              shadowRadius: 3,
              elevation: 3,
              backgroundColor: colors.White,
              borderColor: colors.borderColor,
              shadowColor: colors.Black,
              shadowOffset: { width: 0, height: 1 },
            }}>
            <Text
              style={{
                fontSize: moderateScale(15),
                padding: moderateScale(15),
                color: endDate !== '' ? colors.Black : colors.Gray,
                fontWeight: endDate !== '' ? '700' : '400',
              }}>
              {endDate !== ''
                ? moment.utc(endDate).local().format('DD-MM-YYYY')
                : 'Select End Date'}
            </Text>
          </TouchableOpacity>
          {endDateOpen &&
            <DatePicker
              modal
              mode="date"
              minimumDate={new Date()}
              open={endDateOpen}
              date={new Date()}
              onConfirm={date => {
                console.log(date);
                setEndDateOpen(false);
                setEndDate(date);
              }}
              onCancel={() => {
                setEndDateOpen(false);
              }}
            />
          }
          <Text
            style={{
              color: colors.inputLabelColor,
              fontSize: moderateScale(14),
              fontWeight: '400',
              letterSpacing: 0.03,
              lineHeight: 20,
              marginTop: 20,
            }}>
            Scan Data
          </Text>
          <TouchableOpacity
            onPress={() => {
              setCameraOpen(true);
            }}
            style={{
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: verticalScale(4.65),
              borderWidth: 1,
              shadowOpacity: 0.15,
              shadowRadius: 3,
              elevation: 3,
              backgroundColor: colors.White,
              borderColor: colors.borderColor,
              shadowColor: colors.Black,
              shadowOffset: { width: 0, height: 1 },
            }}>
            <Text
              style={{
                fontSize: moderateScale(15),
                padding: moderateScale(15),
                color: barcodeData !== '' ? colors.Black : colors.Gray,
                fontWeight: barcodeData !== '' ? '700' : '400',
                flex: 1,
              }}>
              {barcodeData !== ''
                ? barcodeData.toString()
                : 'Scan QR or Barcode'}
            </Text>
            <Image
              source={require('../../assets/qr.png')}
              style={{
                height: moderateScale(30),
                width: moderateScale(30),
                marginHorizontal: moderateScale(10),
              }}
            />
          </TouchableOpacity>

          <Modal
            visible={cameraOpen}
            onRequestClose={() => setCameraOpen(false)}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  height: Dimensions.get('window').height / 10,
                  width: Dimensions.get('window').width,
                  // position: 'absolute',
                  marginTop: Dimensions.get('window').height / 2.2,
                }}>
                <RNCamera
                  style={{
                    height: Dimensions.get('window').height / 15,
                    width: Dimensions.get('window').width,
                  }}
                  flashMode={'auto'}
                  // onCameraReady={cameraOpen}
                  onBarCodeRead={event => {
                    console.log(event.data);
                    if (event.data !== '') {
                      setCameraOpen(false);
                      setBarcodeData(event.data);
                    } else {
                      setCameraOpen(true);
                    }
                  }}
                  barCodeTypes={[
                    RNCamera.Constants.BarCodeType.qr,
                    RNCamera.Constants.BarCodeType.aztec,
                    RNCamera.Constants.BarCodeType.code128,
                    RNCamera.Constants.BarCodeType.code39,
                    RNCamera.Constants.BarCodeType.code93,
                    RNCamera.Constants.BarCodeType.datamatrix,
                    RNCamera.Constants.BarCodeType.ean13,
                    RNCamera.Constants.BarCodeType.ean8,
                    RNCamera.Constants.BarCodeType.itf14,
                    RNCamera.Constants.BarCodeType.pdf417,
                    RNCamera.Constants.BarCodeType.interleaved2of5,
                    RNCamera.Constants.BarCodeType.upc_e,
                  ]}
                />
              </View>
              <Pressable
                onPress={() => {
                  setCameraOpen(false);
                }}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  padding: moderateScale(10),
                }}>
                <Image
                  source={require('../../assets/add.png')}
                  style={{
                    height: moderateScale(30),
                    width: moderateScale(30),
                    transform: [{ rotate: '45deg' }],
                  }}
                />
              </Pressable>
            </View>
          </Modal>

          <View style={styles.buttonView}>
            <ButtonComponent
              onButtonPress={() => createTask()}
              buttonText={'Save'}
              buttonDisable={
                taskName !== '' &&
                  description !== '' &&
                  endDate !== '' &&
                  startDate !== '' &&
                  barcodeData !== ''
                  ? false
                  : true
              }
            />
          </View>
        </ScrollView>
      </ContentView>
    </View>
  );
};

export default ItemDetialsScreen;
