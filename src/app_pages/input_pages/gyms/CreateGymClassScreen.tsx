import React, {
  FunctionComponent,
  useState,
  useContext,
  useCallback,
  useRef,
} from 'react';
import {Image, Modal, Platform, StyleSheet, View, Switch} from 'react-native';
import styled from 'styled-components/native';
import {Container, mdFontSize} from '../../../app_components/shared';
import {
  SmallText,
  RegularText,
  LargeText,
  TitleText,
} from '../../../app_components/Text/Text';
import {Button, TextInput} from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary, Asset} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import DocumentPicker from 'react-native-document-picker';

import {useTheme} from 'styled-components';
import {useAppDispatch} from '../../../redux/hooks';
import {
  useCreateGymClassMutation,
  useGetUserGymsQuery,
} from '../../../redux/api/apiSlice';

import {RootStackParamList} from '../../../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
import Input from '../../../app_components/Input/input';
export type Props = StackScreenProps<
  RootStackParamList,
  'CreateGymClassScreen'
>;

const PageContainer = styled(Container)`
  background-color: ${props => props.theme.palette.backgroundColor};
  justify-content: space-between;
  width: 100%;
`;
const ImagePicker: FunctionComponent<{
  setState(file: Asset): void;
  title: string;
}> = props => {
  const theme = useTheme();

  const pickFile = useCallback(async () => {
    try {
      const res = await launchImageLibrary({mediaType: 'mixed'});

      console.log('DocuPicker res ', res);
      // uploadyContext.upload(res);
      if (res.errorCode) {
        console.log('Pick file error', res.errorMessage);
      } else if (res.assets) {
        console.log('Calling setState as child', res);
        console.log();
        props.setState(res.assets[0]);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log(
          'User cancelled the picker, exit any dialogs or menus and move on',
        );
      } else {
        console.log('err picker', err);
        throw err;
      }
    }
  }, [props.title]);

  return (
    <View>
      <Button
        title={props.title}
        onPress={pickFile}
        style={{backgroundColor: theme.palette.lightGray}}
      />
    </View>
  );
};

const CreateGymClassScreen: FunctionComponent<Props> = ({navigation}) => {
  const theme = useTheme();

  // Access/ send actions
  const dispatch = useAppDispatch();
  const [mainFile, setMainFile] = useState<{[key: string]: any}>({});
  const [logoFile, setLogoFile] = useState<{[key: string]: any}>({});
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [createGymClass, {isLoading}] = useCreateGymClassMutation();
  const {
    data,
    isLoading: userGymsLoading,
    isSuccess,
    isError,
    error,
  } = useGetUserGymsQuery('');
  const [gym, setGym] = useState(data && data.length > 0 ? data[0].id : 0);
  const pickerRef = useRef<any>();

  console.log("User's gym data: ", gym);
  const _createGymClass = async () => {
    console.log('Creatting gym class: ', mainFile, logoFile, title, desc, gym);

    // Need to get file from the URI
    const data = new FormData();
    data.append('title', title);
    data.append('desc', desc);
    data.append('gym', gym);
    data.append('private', isPrivate);
    data.append('main', {
      uri: mainFile.uri,
      name: mainFile.fileName,
      type: mainFile.type,
    });
    data.append('logo', {
      uri: logoFile.uri,
      name: logoFile.fileName,
      type: logoFile.type,
    });
    console.log('FOrmdata');
    console.log('FOrmdata');
    console.log('FOrmdata');
    console.log('FOrmdata', data);

    try {
      const gymClass = await createGymClass(data).unwrap();
      console.log('Gym class res', gymClass);
      if (gymClass.id) {
        navigation.navigate('HomePageTabs', {screen: 'Profile'});
      }
    } catch (err) {
      console.log('Error creating gym', err);
    }
    // TODO possibly dispatch to refresh data
  };

  const openGymPicker = () => {
    if (pickerRef.current) {
      pickerRef.current.focus();
    }
  };
  const closeGymPicker = () => {
    if (pickerRef.current) {
      pickerRef.current.blur();
    }
  };

  return (
    <PageContainer>
      <RegularText textStyles={{marginBottom: 8}}>Create Gym Class</RegularText>
      <View style={{height: '100%', width: '100%'}}>
        <View style={{flex: 3}}>
          <View style={{height: 55, marginBottom: 8}}>
            <Input
              onChangeText={t => setTitle(t)}
              value={title}
              containerStyle={{
                width: '100%',
                backgroundColor: theme.palette.lightGray,
                borderRadius: 8,
                paddingHorizontal: 8,
              }}
              fontSize={mdFontSize}
              leading={
                <Icon
                  name="checkmark-circle-outline"
                  style={{fontSize: mdFontSize}}
                  color={theme.palette.text}
                />
              }
              label=""
              placeholder="Title"
            />
          </View>
          <View style={{height: 50}}>
            <Input
              onChangeText={t => setDesc(t)}
              value={desc}
              containerStyle={{
                width: '100%',
                backgroundColor: theme.palette.lightGray,
                borderRadius: 8,
                paddingHorizontal: 8,
              }}
              fontSize={mdFontSize}
              leading={
                <Icon
                  name="checkmark-circle-outline"
                  style={{fontSize: mdFontSize}}
                  color={theme.palette.text}
                />
              }
              label=""
              placeholder="Description"
            />
          </View>
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end', width: '100%'}}>
          <View>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isPrivate ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setIsPrivate}
              value={isPrivate}
            />
          </View>
          <View>
            <SmallText textStyles={{textAlign: 'right'}}>
              Private class
            </SmallText>
          </View>
        </View>
        <View style={{flex: 2}}>
          {!userGymsLoading ? (
            <View style={{justifyContent: 'flex-start'}}>
              <SmallText>Gym</SmallText>
              <Picker
                ref={pickerRef}
                style={{height: 100}}
                itemStyle={{
                  height: 100,
                  color: theme.palette.text,
                  backgroundColor: theme.palette.backgroundColor,
                }}
                selectedValue={gym}
                onValueChange={(itemValue, itemIndex) => setGym(itemValue)}>
                {data.map(gym => {
                  return (
                    <Picker.Item
                      key={gym.id}
                      label={gym.title}
                      value={gym.id}
                    />
                  );
                })}
              </Picker>
            </View>
          ) : (
            <></>
          )}
        </View>
        <View style={{flex: 9}}>
          <View style={{marginTop: 36}} />
          <ImagePicker
            setState={setMainFile.bind(this)}
            title="Select Main Image"
          />
          <Image
            source={{uri: mainFile.uri}}
            style={{width: '100%', height: 100, resizeMode: 'contain'}}
          />

          <ImagePicker setState={setLogoFile.bind(this)} title="Select Logo" />
          <Image
            source={{uri: logoFile.uri}}
            style={{width: '100%', height: 100, resizeMode: 'contain'}}
          />

          <Button
            onPress={_createGymClass.bind(this)}
            title="Create"
            style={{backgroundColor: theme.palette.lightGray}}
          />
        </View>
      </View>
    </PageContainer>
  );
};

export default CreateGymClassScreen;
