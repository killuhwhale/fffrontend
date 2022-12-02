import React, {
  FunctionComponent,
  useState,
  useContext,
  useCallback,
  useRef,
} from 'react';
import styled from 'styled-components/native';
import {Image, Modal, Platform, StyleSheet, View, Switch} from 'react-native';
import {Container, SCREEN_HEIGHT} from '../../../app_components/shared';
import {
  SmallText,
  RegularText,
  LargeText,
  TitleText,
} from '../../../app_components/Text/Text';
import {
  AppBar,
  Button,
  IconButton,
  TextInput,
} from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import {Picker} from '@react-native-picker/picker';
import DocumentPicker from 'react-native-document-picker';

import {useTheme} from 'styled-components';
import {useAppSelector, useAppDispatch} from '../../../redux/hooks';
import {useCreateWorkoutGroupMutation} from '../../../redux/api/apiSlice';
import {MediaSlider} from '../../../app_components/MediaSlider/MediaSlider';

import {RootStackParamList} from '../../../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
import DatePicker from 'react-native-date-picker';
import {dateFormat} from '../../StatsScreen';
export type Props = StackScreenProps<
  RootStackParamList,
  'CreateWorkoutGroupScreen'
>;

const PageContainer = styled(Container)`
  background-color: ${props => props.theme.palette.backgroundColor};
  justify-content: space-between;
  width: 100%;
`;
const Touchable = styled.TouchableHighlight`
  height: 100%;
  border-radius: 25px;
`;

const MediaPicker: FunctionComponent<{
  setState(file: ImageOrVideo[]): void;
  title: string;
}> = props => {
  const theme = useTheme();

  const pickFile = useCallback(async () => {
    try {
      const files = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'any',
      });

      console.log('DocuPicker res ', files);

      props.setState(files);
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

const CreateWorkoutGroupScreen: FunctionComponent<Props> = ({
  navigation,
  route: {
    params: {ownedByClass, ownerID, gymClassProps},
  },
}) => {
  const theme = useTheme();
  console.log('WGroup params: ', ownedByClass, ownerID);

  // Access/ send actions
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<ImageOrVideo[]>();
  const [title, setTitle] = useState('');
  const [forDate, setForDate] = useState<Date>(new Date());

  // Need to set ownedByClass somehow......
  // 1. User has classes, use a picker || Deciding to not use a picker. We will just go to the class and add from there...
  // 2. User does not have classes, no picker.
  // 3. User has classes but wants to make a post for themselves.

  // WHen we open this Screen, we can pass a prop with ownedByClass. and an optional owner id
  // This allows us to handle the above casses and lets use get to this screen from a variety of places.
  //     From a class w/ its ID to add a workout to it.
  //     From profile, for class, use a picker to choose ID of class
  //     From profile, for user, no picker
  const [caption, setCaption] = useState('');

  const [createWorkoutGroup, {isLoading}] = useCreateWorkoutGroupMutation();
  // useGet... workoutNames

  const _createWorkout = async () => {
    console.log('Creatting workout: ');

    // Need to get file from the URI
    const data = new FormData();
    data.append('owner_id', ownerID);
    data.append('owned_by_class', ownedByClass);

    data.append('title', title);
    data.append('caption', caption);
    data.append('for_date', dateFormat(forDate));
    data.append('media_ids', []);
    if (files) {
      files.forEach(file =>
        data.append('files', {
          uri: file.path,
          name: file.path,
          type: file.mime,
        }),
      );
    }

    console.log('FOrmdata');
    console.log('FOrmdata');
    console.log('FOrmdata');
    console.log('FOrmdata', data);

    try {
      const workoutGroup = await createWorkoutGroup(data).unwrap();
      console.log('Gym class res', workoutGroup);
      if (workoutGroup.id) {
        navigation.goBack();
      }
    } catch (err) {
      console.log('Error creating gym', err);
    }
    // TODO possibly dispatch to refresh data
  };

  return (
    <PageContainer>
      <RegularText textStyles={{marginBottom: 8}}>
        Create Workout Group
      </RegularText>
      <View style={{height: '100%', width: '100%'}}>
        <View style={{flex: 4}}>
          <TextInput
            value={title || ''}
            onChangeText={t => setTitle(t)}
            label="Title"
            // helperText={}
            leading={props => (
              <Icon name="checkmark-circle-outline" {...props} />
            )}
          />
          <TextInput
            label="Caption"
            value={caption || ''}
            onChangeText={d => setCaption(d)}
            leading={props => (
              <Icon name="checkmark-circle-outline" {...props} />
            )}
          />
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              backgroundColor: theme.palette.darkGray,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <SmallText textStyles={{textAlign: 'center', paddingLeft: 16}}>
              For:{' '}
            </SmallText>
            <DatePicker
              date={forDate}
              onDateChange={setForDate}
              mode="date"
              locale="en"
              fadeToColor={theme.palette.darkGray}
              textColor={theme.palette.text}
              style={{height: SCREEN_HEIGHT * 0.06, transform: [{scale: 0.65}]}}
            />
          </View>
        </View>
        <View style={{flex: 9}}>
          <MediaPicker
            setState={setFiles.bind(this)}
            title="Select Main Image"
          />
          {files && files.length > 0 ? <MediaSlider data={files} /> : <></>}
        </View>
        <View style={{flex: 2}}>
          <Button
            onPress={_createWorkout.bind(this)}
            title="Create"
            style={{backgroundColor: theme.palette.lightGray}}
          />
        </View>
      </View>
    </PageContainer>
  );
};

export default CreateWorkoutGroupScreen;

export {MediaPicker};
