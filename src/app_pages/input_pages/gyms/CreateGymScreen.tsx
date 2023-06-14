import React, {
  FunctionComponent,
  useState,
  useContext,
  useCallback,
} from 'react';
import styled from 'styled-components/native';
import {ActivityIndicator, Image, View} from 'react-native';
import {Container, mdFontSize} from '../../../app_components/shared';
import {LargeText} from '../../../app_components/Text/Text';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary, Asset} from 'react-native-image-picker';

import DocumentPicker from 'react-native-document-picker';

import {useTheme} from 'styled-components';
import {useAppDispatch} from '../../../redux/hooks';
import {useCreateGymMutation} from '../../../redux/api/apiSlice';

import {RootStackParamList} from '../../../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
import Input from '../../../app_components/Input/input';
import {RegularButton} from '../../../app_components/Buttons/buttons';
import {TestIDs} from '../../../utils/constants';
import AlertModal from '../../../app_components/modals/AlertModal';
export type Props = StackScreenProps<RootStackParamList, 'CreateGymScreen'>;

const PageContainer = styled(Container)`
  background-color: ${props => props.theme.palette.backgroundColor};
  justify-content: space-between;
  width: 100%;
`;
const Touchable = styled.TouchableHighlight`
  height: 100%;
  border-radius: 25px;
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
      if (res.errorCode) {
        console.log('Pick file error', res.errorMessage);
      } else if (res.assets) {
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
        btnStyles={{backgroundColor: theme.palette.darkGray}}
        text={props.title}
      />
    </View>
  );
};

const CreateGymScreen: FunctionComponent<Props> = ({navigation}) => {
  const theme = useTheme();
  // Access/ send actions
  const dispatch = useAppDispatch();
  const [mainFile, setMainFile] = useState<{[key: string]: any}>({});
  const [logoFile, setLogoFile] = useState<{[key: string]: any}>({});
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [createGym, {isLoading}] = useCreateGymMutation();

  // Create gym class mutation

  const [isCreating, setIsCreating] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const _createGym = async () => {
    console.log('Creatting gym: ', mainFile, logoFile, title, desc);
    setIsCreating(true);

    // Need to get file from the URI
    const data = new FormData();
    data.append('title', title);
    data.append('desc', desc);

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
    console.log('FOrmdata', data.getParts(), mainFile.fileName, mainFile.type);

    // headers: {
    //     'Content-Type': 'multipart/form-data; ',
    //   },

    try {
      const gym = await createGym(data).unwrap();
      console.log('Newly creaated gym', gym);
      if (gym.id) {
        navigation.navigate('HomePageTabs', {screen: 'Profile'});
      } else if (gym.err_type === 1) {
        setShowAlert(true);
      }
    } catch (err) {
      console.log('Error creating gym', err);
    }
    setIsCreating(false);
    // TODO possibly dispatch to refresh data
  };

  return (
    <PageContainer>
      <LargeText textStyles={{marginBottom: 8}}>Create Gym</LargeText>
      <View style={{height: '100%', width: '100%'}}>
        <View style={{flex: 1}}>
          <View style={{height: 55, marginBottom: 8}}>
            <Input
              onChangeText={t => setTitle(t)}
              testID={TestIDs.GymTitleField.name()}
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
          <View style={{height: 55, marginBottom: 8}}>
            <Input
              onChangeText={t => setDesc(t)}
              value={desc}
              testID={TestIDs.GymDescField.name()}
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
              placeholder="Description"
            />
          </View>

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
            <RegularButton
              testID={TestIDs.GymSubmitBtn.name()}
              onPress={_createGym.bind(this)}
              btnStyles={{backgroundColor: theme.palette.darkGray}}
              text="Create"
            />
          ) : (
            <ActivityIndicator size="small" color={theme.palette.text} />
          )}
        </View>
      </View>
      <AlertModal
        closeText="Close"
        bodyText="This account can only create 3 gyms max."
        modalVisible={showAlert}
        onRequestClose={() => setShowAlert(false)}
      />
    </PageContainer>
  );
};

export default CreateGymScreen;
