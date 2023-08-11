import React, {
  FunctionComponent,
  useState,
  useContext,
  useCallback,
  useRef,
} from 'react';
import {
  Image,
  Modal,
  Platform,
  StyleSheet,
  View,
  Switch,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';
import {Container, mdFontSize} from '../../../app_components/shared';
import {
  SmallText,
  RegularText,
  LargeText,
  TitleText,
} from '../../../app_components/Text/Text';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary, Asset} from 'react-native-image-picker';
import RNPickerSelect from 'react-native-picker-select';

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
import {RegularButton} from '../../../app_components/Buttons/buttons';
import {TestIDs, nodeEnv} from '../../../utils/constants';
import AlertModal from '../../../app_components/modals/AlertModal';
import BannerAddMembership from '../../../app_components/ads/BannerAd';
import InterstitialAdMembership from '../../../app_components/ads/InterstitialAd';
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
      <RegularButton
        onPress={pickFile}
        btnStyles={{
          backgroundColor: theme.palette.darkGray,
        }}
        text={props.title}
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
  const [blkText, setBlkText] = useState(false);
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

  const [isCreating, setIsCreating] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const f_createGymClass = () => {
    console.log('Creatting gym class: ', mainFile, logoFile, title, desc, gym);
  }
  
  const _createGymClass = async () => {
    console.log('Creatting gym class: ', mainFile, logoFile, title, desc, gym);

    setIsCreating(true);
    // Need to get file from the URI
    const data = new FormData();
    data.append('title', title);
    data.append('desc', desc);
    data.append('gym', gym);
    data.append('private', isPrivate);
    if (mainFile.uri && mainFile.fileName && mainFile.type) {
      data.append('main', {
        uri: mainFile.uri,
        name: mainFile.fileName,
        type: mainFile.type,
      });
    }
    if (logoFile.uri && logoFile.fileName && logoFile.type) {
      data.append('logo', {
        uri: logoFile.uri,
        name: logoFile.fileName,
        type: logoFile.type,
      });
    }
    console.log('FOrmdata');
    console.log('FOrmdata');
    console.log('FOrmdata');
    console.log('FOrmdata', data);

    try {
      const gymClass = await createGymClass(data).unwrap();
      console.log('Gym class res', gymClass);
      if (gymClass.id) {
        navigation.navigate('HomePageTabs', {screen: 'Profile'});
      } else if (gymClass.err_type === 1 || gymClass.detail) {
        setShowAlert(true);
      }
    } catch (err) {
      console.log('Error creating gym class', err);
    }
    setIsCreating(false);
    // TODO possibly dispatch to refresh data
  };

  return (
    <PageContainer>
      <View style={{height: '100%', width: '100%'}}>
        <View style={{flex: 2}}>
          <BannerAddMembership />
        </View>
        <View style={{flex: 1}}>
          <RegularText textStyles={{marginBottom: 8}}>
            Create Gym Class
          </RegularText>
        </View>
        <View style={{flex: 3}}>
          <View style={{height: 55, marginBottom: 8}}>
            <Input
              onChangeText={t => setTitle(t)}
              testID={TestIDs.GymClassTitleField.name()}
              value={title}
              containerStyle={{
                width: '100%',
                backgroundColor: theme.palette.darkGray,
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
                backgroundColor: theme.palette.darkGray,
                borderRadius: 8,
                paddingHorizontal: 8,
              }}
              testID={TestIDs.GymClassDescField.name()}
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
          <View style={{width: '100%', alignItems: 'flex-end'}}>
            <Switch
              testID={TestIDs.GymClassPrivateSwitch.name()}
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isPrivate ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setIsPrivate}
              value={isPrivate}
            />
          </View>
          <View style={{width: '100%'}}>
            <SmallText textStyles={{textAlign: 'right'}}>
              Private class
            </SmallText>
          </View>
        </View>
        <View style={{flex: 2}}>
          {!userGymsLoading ? (
            <View
              style={{
                justifyContent: 'flex-start',

                margin: 6,
                padding: 6,
              }}>
              <SmallText textStyles={{textAlign: 'center', marginBottom: 12}}>
                Gym
              </SmallText>
              <RNPickerSelect
                ref={pickerRef}
                onValueChange={(itemValue, itemIndex) => setGym(itemValue)}
                useNativeAndroidPickerStyle={false}
                value={gym}
                placeholder={{}}
                key="GymClassKeyz"
                touchableWrapperProps={{
                  testID: TestIDs.GymClassRNPickerTouchableGym.name(),
                }}
                modalProps={{testID: TestIDs.GymClassRNPickerModalGym.name()}}
                pickerProps={{testID: TestIDs.GymClassRNPickerGym.name()}}
                style={{
                  inputAndroidContainer: {
                    alignItems: 'center',
                    borderBottomColor: theme.palette.text,
                    borderBottomWidth: 1,
                    borderLeftColor: theme.palette.text,
                    borderLeftWidth: 1,
                    borderRightColor: theme.palette.text,
                    borderRightWidth: 1,
                  },
                  inputAndroid: {
                    color: theme.palette.text,
                  },
                  inputIOSContainer: {
                    alignItems: 'center',
                  },
                  inputIOS: {
                    color: theme.palette.text,
                    height: '100%',
                  },
                }}
                items={data.map((gym, i) => {
                  return {
                    label: gym.title,
                    value: gym.id,
                  };
                })}
              />
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
          {!isCreating ? (
            nodeEnv === 'test' ? (
              <RegularButton
                testID={TestIDs.GymClassCreateBtn.name()}
                onPress={() => _createGymClass()}
                btnStyles={{backgroundColor: theme.palette.darkGray}}
                text="Create"
              />
            ) : (
              <InterstitialAdMembership
                text="Create"
                onClose={() => _createGymClass()}
              />
            )
          ) : (
            <ActivityIndicator size="small" color={theme.palette.text} />
          )}
        </View>
      </View>

      <AlertModal
        closeText="Close"
        bodyText="Failed to create class: classes can only be created by members and are limited to 15 classes per gym with unique names."
        modalVisible={showAlert}
        onRequestClose={() => setShowAlert(false)}
      />
    </PageContainer>
  );
};

export default CreateGymClassScreen;
