/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import ContentView from '../../components/ContentView';
import { search_white_icon, message, expert_icon } from '../../constants/assets';
import { moderateScale } from '../../helpers/ResponsiveFonts';
import colors from '../../constants/colors';
import styles from './styles';
import TextInputWithLabel from '../../components/TextInputWithLabel';
import auth from '@react-native-firebase/auth';
import Loader from '../../helpers/loader';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';

export default function DeshbordScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [search, setSearch] = useState('');
  const [groupName, setGroupName] = useState('');
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const [userdata, setUserData] = useState({});

  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [barcodeData, setBarcodeData] = useState('');

  const [error, setError] = useState({
    groupName: false,
  });

  const logout = () => {
    auth().signOut();
  };

  useEffect(() => {
    // taskList();
    setLoader(true);

    (async () => {
      const user = auth().onAuthStateChanged(userExist => {
        console.log('userExist~~', userExist);
        if (userExist) {
          setUserData(userExist);
          (async () => {
            const querySnap = await firestore()
              .collection('TaskList')
              .doc(userExist.uid)
              .collection('tasks')
              .orderBy('createdAt', 'desc')
              .get();
            const allGroup = querySnap.docs.map(docSnap => docSnap.data());
            console.log('AllGroupData!!!', JSON.stringify(allGroup));
            setLoader(false);

            setGroupData(allGroup);
          })();
        } else {
          setUserData('');
        }
      });
    })();
  }, [isFocused]);

  const renderItem = ({ item }) => {
    return (
      <Pressable onPress={() => { }} style={styles.flatlistcontainer}>
        <View style={styles.mainContainer}>
          <View style={styles.userDetailsContainer}>
            <View
              style={{
                marginHorizontal: moderateScale(15),
                // width: '80%',
                flex: 1,
              }}>
              <Text style={styles.title}>
                <Text style={[styles.title, { color: colors.Black }]}>
                  Task Name :
                </Text>{' '}
                {item.name}
              </Text>
              <Text style={styles.title}>
                <Text style={[styles.title, { color: colors.Black }]}>
                  Description :
                </Text>{' '}
                {item.description}
              </Text>
              <Text style={styles.title}>
                <Text style={[styles.title, { color: colors.Black }]}>
                  Start Date :{' '}
                </Text>
                {item.startDate}
              </Text>
              <Text style={styles.title}>
                <Text style={[styles.title, { color: colors.Black }]}>
                  End Date :{' '}
                </Text>
                {item.endDate}
              </Text>
              <Text style={styles.title}>
                <Text style={[styles.title, { color: colors.Black }]}>
                  BarcodeData :{' '}
                </Text>
                {item.barcodeData}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <ContentView
        visible={'true'}
        headerText={'Home'}
        rightIcon={require('../../assets/exit.png')}
        iconVisible={true}
        onRightIconPress={() => logout()}>
        <View style={styles.contentView}>
          <View
            style={{
              paddingBottom: moderateScale(10),
              marginHorizontal: moderateScale(20),
            }}>
            <TextInputWithLabel
              icon={search_white_icon}
              iconPress={true}
              inputPlaceholder={'Search'}
              inputValue={search}
              onTextInputChange={text => {
                setSearch(text);
              }}
              inputMaxLength={60}
              keyboardType="email-address"
            />
          </View>

          <Pressable
            onPress={() => {
              // Alert.alert('Under Development');
              // setShowModal(true);
              navigation.navigate('ItemDetialsScreen');
            }}
            style={styles.AddButton}>
            <Text style={{ fontSize: moderateScale(15), color: colors.White }}>
              Create Task
            </Text>
          </Pressable>

          <FlatList
            data={groupData.filter(item =>
              item.name.toLowerCase().includes(search.trim().toLowerCase()),
            )}
            contentContainerStyle={{
              paddingBottom: moderateScale(20),
              marginHorizontal: moderateScale(20),
            }}
            ListEmptyComponent={<ListEmptyComponent />}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ContentView>
      <Loader value={loader} />
    </View>
  );
}

const ListEmptyComponent = () => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}>
      <Text>No data found</Text>
    </View>
  );
};
