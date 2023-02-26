import React, {FunctionComponent, useState, useCallback} from 'react';
import styled from 'styled-components/native';
import {ActivityIndicator, View} from 'react-native';
import {
  Container,
  mdFontSize,
  SCREEN_HEIGHT,
} from '../../../app_components/shared';
import {SmallText, RegularText} from '../../../app_components/Text/Text';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';

import {useTheme} from 'styled-components';
import {useAppDispatch} from '../../../redux/hooks';
import {useCreateWorkoutGroupMutation} from '../../../redux/api/apiSlice';
import {MediaSlider} from '../../../app_components/MediaSlider/MediaSlider';

import {RootStackParamList} from '../../../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
import DatePicker from 'react-native-date-picker';
import {dateFormat} from '../../StatsScreen';
import {RegularButton} from '../../../app_components/Buttons/buttons';
import Input from '../../../app_components/Input/input';
import {TestIDs} from '../../../utils/constants';
export type Props = StackScreenProps<
  RootStackParamList,
  'CreateWorkoutGroupScreen'
>;

const PageContainer = styled(Container)`
  background-color: ${props => props.theme.palette.backgroundColor};
  justify-content: space-between;
  width: 100%;
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
      <RegularButton
        onPress={pickFile}
        btnStyles={{backgroundColor: theme.palette.lightGray}}>
        {props.title}
      </RegularButton>
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

  const [isCreating, setIsCreating] = useState(false);

  const _createWorkout = async () => {
    console.log('Creatting workout: ');

    setIsCreating(true);
    // Need to get file from the URI
    const data = new FormData();
    data.append('owner_id', ownerID);
    data.append('owned_by_class', ownedByClass);

    data.append('title', title);
    data.append('caption', caption);
    data.append('for_date', dateFormat(forDate));
    data.append('media_ids', []);
    if (files && files.length) {
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
      console.log('Error creating  WorkoutGroup', err);
    }
    setIsCreating(false);
    // TODO possibly dispatch to refresh data
  };

  return (
    <PageContainer>
      <RegularText textStyles={{marginBottom: 8}}>
        Create Workout Group
      </RegularText>
      <View style={{height: '100%', width: '100%'}}>
        <View style={{flex: 4}}>
          <View style={{marginBottom: 15, height: 40}}>
            <Input
              placeholder="Title"
              testID={TestIDs.WorkoutGroupTitleField.name()}
              onChangeText={setTitle}
              value={title || ''}
              label="Title"
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
                  color={theme.palette.text}
                  style={{fontSize: mdFontSize}}
                />
              }
            />
          </View>
          <View style={{marginBottom: 15, height: 40}}>
            <Input
              placeholder="Caption"
              testID={TestIDs.WorkoutGroupCaptionField.name()}
              onChangeText={setCaption}
              value={caption || ''}
              label="Caption"
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
                  color={theme.palette.text}
                  style={{fontSize: mdFontSize}}
                />
              }
            />
          </View>

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
          {!isCreating ? (
            <RegularButton
              onPress={_createWorkout.bind(this)}
              testID={TestIDs.WorkoutGroupCreateBtn.name()}
              btnStyles={{
                backgroundColor: theme.palette.lightGray,
              }}>
              Create
            </RegularButton>
          ) : (
            <ActivityIndicator size="small" color={theme.palette.text} />
          )}
        </View>
      </View>
    </PageContainer>
  );
};

export default CreateWorkoutGroupScreen;

export {MediaPicker};
