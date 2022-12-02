import React, {FunctionComponent, useState} from 'react';
import styled from 'styled-components/native';
import {
  COMPLETED_WORKOUT_MEDIA,
  Container,
  MEDIA_CLASSES,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  WORKOUT_MEDIA,
  processMultiWorkoutStats,
} from '../app_components/shared';
import {
  SmallText,
  RegularText,
  LargeText,
  TitleText,
} from '../app_components/Text/Text';
// import { withTheme } from 'styled-components'
import {useTheme} from 'styled-components';
import {
  WorkoutCardFullList,
  WorkoutCardList,
} from '../app_components/Cards/cardList';

import {RootStackParamList} from '../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
import {
  WorkoutCardProps,
  WorkoutGroupCardProps,
  WorkoutGroupProps,
} from '../app_components/Cards/types';
import {ScrollView} from 'react-native-gesture-handler';
import {TouchableWithoutFeedback, View} from 'react-native';
import {
  useDeleteCompletedWorkoutGroupMutation,
  useDeleteWorkoutGroupMutation,
  useFinishWorkoutGroupMutation,
  useGetCompletedWorkoutByWorkoutIDQuery,
  useGetCompletedWorkoutQuery,
  useGetUserInfoQuery,
  useGetWorkoutsForGymClassWorkoutGroupQuery,
  useGetWorkoutsForUsersWorkoutGroupQuery,
} from '../redux/api/apiSlice';
import {Button, IconButton, Switch} from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';
import {StatsPanel} from './WorkoutDetailScreen';
import {MediaURLSlider} from '../app_components/MediaSlider/MediaSlider';
import {ActionCancelModal} from './Profile';
export type Props = StackScreenProps<RootStackParamList, 'WorkoutScreen'>;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const WorkoutScreenContainer = styled(Container)`
  background-color: ${props => props.theme.palette.backgroundColor};
  justify-content: space-between;
  width: 100%;
`;

// sudo keytool -genkey -v -keystore fitform-upload-key.keystore -alias fitform-signing-key -keyalg RSA -keysize 2048 -validity 10000

/**
 *  TODO()
 *  - Now we have completed_workout_groups and created_workout_groups (OG)
 *  - We need to ensure that Adding new workouts and deleting workouts
 *          alters the correct Workout and we do not mix up Completed and Created workouts...
 *
 *
 *
 */

const WorkoutScreen: FunctionComponent<Props> = ({
  navigation,
  route: {params},
}) => {
  const theme = useTheme();
  const {
    id,
    title,
    caption,
    owned_by_class,
    owner_id,
    media_ids,
    user_id,
    completed,
    workout_group,
  } = params.data || {}; // Workout group

  const {
    data: userData,
    isLoading: userIsloading,
    isSuccess: userIsSuccess,
    isError: userIsError,
    error: userError,
  } = useGetUserInfoQuery('');

  let mediaClass = -1;
  let isShowingOGWorkoutGroup = true;

  // Data to use for View
  let oGData = {} as WorkoutGroupProps;
  let oGIsLoading = true;
  let oGIsSuccess = false;
  let oGIsError = false;
  let oGError: any = '';

  let completedData = {} as WorkoutGroupProps;
  let completedIsLoading = true;
  let completedIsSuccess = false;
  let completedIsError = false;
  let completedError: any = '';

  const [finishWorkoutGroup, isLoading] = useFinishWorkoutGroupMutation();
  // console.log("Workout Screen Params: ", params)

  if (owned_by_class == undefined) {
    // WE have a completed workout group
    const {data, isLoading, isSuccess, isError, error} =
      useGetCompletedWorkoutQuery(id);
    completedData = data;
    completedIsLoading = isLoading;
    completedIsSuccess = isSuccess;
    completedIsError = isError;
    completedError = error;

    if (workout_group) {
      const {data, isLoading, isSuccess, isError, error} =
        useGetWorkoutsForGymClassWorkoutGroupQuery(workout_group);
      oGData = data;
      oGIsLoading = isLoading;
      oGIsSuccess = isSuccess;
      oGIsError = isError;
      oGError = error;
    }

    // Fetch OG Workout by ID
  } else if (owned_by_class) {
    // we have OG workout owneed by class
    const {data, isLoading, isSuccess, isError, error} =
      useGetWorkoutsForGymClassWorkoutGroupQuery(id);
    console.log('Owned by class, data: ', data);
    oGData = data;
    oGIsLoading = isLoading;
    oGIsSuccess = isSuccess;
    oGIsError = isError;
    oGError = error;

    // This 'completed' should come from ogData query.
    const {
      data: dataCompleted,
      isLoading: isLoadingCompleted,
      isSuccess: isSuccessCompleted,
      isError: isErrorCompleted,
      error: errorCompleted,
    } = useGetCompletedWorkoutByWorkoutIDQuery(id);

    console.log('Completed data: ', dataCompleted);

    if (dataCompleted && dataCompleted.completed_workouts.length > 0) {
      completedData = dataCompleted;
      completedIsLoading = isLoadingCompleted;
      completedIsSuccess = isSuccessCompleted;
      completedIsError = isErrorCompleted;
      completedError = errorCompleted;
    }
  } else {
    // we have OG workout owneed by user
    // THis is wrong. This get all users workouts
    // const { data, isLoading, isSuccess, isError, error } = useGetWorkoutsForUsersWorkoutGroupsQuery("");
    // completedData = data
    // completedIsLoading = isLoading
    // completedIsSuccess = isSuccess
    // completedIsError = isError
    // completedError = error
    // isShowingOGWorkoutGroup = false
    const {data, isLoading, isSuccess, isError, error} =
      useGetWorkoutsForUsersWorkoutGroupQuery(id);
    oGData = data;
    oGIsLoading = isLoading;
    oGIsSuccess = isSuccess;
    oGIsError = isError;
    oGError = error;
  }

  // Fetch workouts for WorkoutGroup, call depedning on owned_by_class
  const [showingOGWorkoutGroup, setShowingOGWorkoutGroup] = useState(
    isShowingOGWorkoutGroup,
  );
  const workoutGroup: WorkoutGroupProps =
    showingOGWorkoutGroup && oGData
      ? oGData
      : !showingOGWorkoutGroup && completedData
      ? completedData
      : ({} as WorkoutGroupProps);
  // const isOGWorkoutGroup = workoutGroup.workouts ? true : false
  mediaClass = showingOGWorkoutGroup ? WORKOUT_MEDIA : COMPLETED_WORKOUT_MEDIA;

  // console.log("Workout Screen data: ", `showOG? ${showingOGWorkoutGroup}`, oGData, completedData, Object.keys(completedData))

  const [editable, setEditable] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const [deleteWorkoutGroupMutation, {isLoading: isDeleteOGWorkoutGroup}] =
    useDeleteWorkoutGroupMutation();
  const [
    deleteCompletedWorkoutGroup,
    {isLoading: isDeleteCompletedWorkoutGroup},
  ] = useDeleteCompletedWorkoutGroupMutation();
  const [deleteWorkoutGroupModalVisible, setDeleteWorkoutGroupModalVisible] =
    useState(false);
  const [finishWorkoutGroupModalVisible, setFinishWorkoutGroupModalVisible] =
    useState(false);

  const workouts = workoutGroup.workouts
    ? workoutGroup.workouts
    : workoutGroup.completed_workouts
    ? workoutGroup.completed_workouts
    : [];

  const [tags, names] = processMultiWorkoutStats(workouts);

  console.log('Stats: ', tags, names);
  console.log('WorkoutScreen data: ', oGData);

  const openCreateWorkoutScreenForStandard = () => {
    navigation.navigate('CreateWorkoutScreen', {
      workoutGroupID: oGData.id.toString(),
      workoutGroupTitle: title,
      schemeType: 0,
    });
  };
  const openCreateWorkoutScreenForReps = () => {
    navigation.navigate('CreateWorkoutScreen', {
      workoutGroupID: oGData.id.toString(),
      workoutGroupTitle: title,
      schemeType: 1,
    });
  };
  const openCreateWorkoutScreenForRounds = () => {
    navigation.navigate('CreateWorkoutScreen', {
      workoutGroupID: oGData.id.toString(),
      workoutGroupTitle: title,
      schemeType: 2,
    });
  };
  const openCreateWorkoutScreenForTime = () => {
    navigation.navigate('CreateWorkoutScreen', {
      workoutGroupID: oGData.id.toString(),
      workoutGroupTitle: title,
      schemeType: 3,
    });
  };
  const onConfirmDelete = () => {
    setDeleteWorkoutGroupModalVisible(true);
  };

  const onDelete = async () => {
    if (showingOGWorkoutGroup) {
      const delData = new FormData();
      delData.append('owner_id', oGData.owner_id);
      delData.append('owned_by_class', oGData.owned_by_class);
      delData.append('id', oGData.id);
      console.log('Deleteing workout GORUP', delData);
      const deletedWorkoutGroup = await deleteWorkoutGroupMutation(
        delData,
      ).unwrap();
      console.log('Deleting result: ', deletedWorkoutGroup);
    } else {
      const delData = new FormData();
      delData.append('owner_id', completedData.owner_id);
      delData.append('owned_by_class', completedData.owned_by_class);
      delData.append('id', completedData.id);
      console.log('Deleteing completed workout GORUP', delData);
      const deletedWorkoutGroup = await deleteCompletedWorkoutGroup(
        delData,
      ).unwrap();
      console.log('Del WG res: ', deletedWorkoutGroup);
    }
    setDeleteWorkoutGroupModalVisible(false);
    navigation.goBack();
  };

  const _finishGroupWorkout = async () => {
    const data = new FormData();
    data.append('group', oGData.id);
    try {
      const res = await finishWorkoutGroup(data).unwrap();
      console.log('res finsih', res);
      setFinishWorkoutGroupModalVisible(false);
    } catch (err) {
      console.log('Error finishing workout', err);
    }
  };

  const navigateToCompletedWorkoutGroupScreen = () => {
    console.log('Sending data to screen: ', oGData);
    if (oGData && Object.keys(oGData).length > 0) {
      navigation.navigate('CreateCompletedWorkoutScreen', oGData);
    }
  };

  // console.log("Current workout Group:", workoutGroup, oGData, completedData, isShowingOGWorkoutGroup, showingOGWorkoutGroup)
  return (
    <ScrollView
      style={{backgroundColor: theme.palette.backgroundColor}}
      contentContainerStyle={{
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
      }}>
      <Row style={{}}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
          }}>
          <View style={{flex: 1, justifyContent: 'center', width: '100%'}}>
            {oGIsSuccess && completedIsSuccess ? (
              <View style={{width: '100%', alignItems: 'center'}}>
                <IconButton
                  style={{height: 24}}
                  icon={
                    <Icon
                      name="podium"
                      color={
                        showingOGWorkoutGroup && !oGIsLoading
                          ? theme.palette.text
                          : 'red'
                      }
                      style={{fontSize: 24}}
                    />
                  }
                  onPress={() =>
                    setShowingOGWorkoutGroup(!showingOGWorkoutGroup)
                  }
                />
                <SmallText textStyles={{textAlign: 'center'}}>
                  {showingOGWorkoutGroup && !oGIsLoading ? 'og' : 'completed'}
                </SmallText>
              </View>
            ) : (
              <></>
            )}
          </View>
          <View style={{flex: 3}}>
            <ScrollView horizontal>
              <RegularText>
                {workoutGroup.title} ({workoutGroup.id})
              </RegularText>
            </ScrollView>
          </View>

          <View
            style={{
              flex: 1,
              width: '100%',
              justifyContent: 'flex-end',
              flexDirection: 'row',
              paddingLeft: 12,
            }}>
            {showingOGWorkoutGroup &&
            !oGIsLoading &&
            !(userData && userData.id == oGData.owner_id && !owned_by_class) ? (
              <IconButton
                style={{height: 24}}
                icon={
                  <Icon
                    name="rocket"
                    color={
                      completedIsSuccess
                        ? theme.palette.primary.main
                        : theme.palette.text
                    }
                    style={{fontSize: 24}}
                  />
                }
                onPress={
                  completedIsSuccess ||
                  (userData &&
                    userData.id == oGData.owner_id &&
                    !owned_by_class)
                    ? () => {}
                    : navigateToCompletedWorkoutGroupScreen
                }
              />
            ) : (
              <></>
            )}

            <IconButton
              style={{height: 24}}
              icon={
                <Icon
                  style={{fontSize: 24}}
                  name="remove-circle-sharp"
                  color="red"
                />
              }
              onPress={onConfirmDelete}
            />
          </View>
        </View>
      </Row>
      <Row style={{height: 400}}>
        {workoutGroup.media_ids ? (
          <MediaURLSlider
            data={JSON.parse(workoutGroup.media_ids)}
            mediaClassID={workoutGroup.id}
            mediaClass={MEDIA_CLASSES[mediaClass]}
          />
        ) : (
          <></>
        )}
      </Row>
      <Row style={{}}>
        <SmallText>{workoutGroup.caption}</SmallText>
      </Row>

      {params.editable ? (
        <>
          {oGData && showingOGWorkoutGroup && oGData.finished === false ? (
            <View
              style={{
                flex: 2,
                flexDirection: 'row',
                marginBottom: 12,
                justifyContent: 'flex-end',
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                width: '100%',
              }}>
              <View
                style={{
                  display: showCreate ? 'flex' : 'none',
                  flexDirection: 'row',
                }}>
                <Button
                  onPress={openCreateWorkoutScreenForStandard.bind(this)}
                  title="Reg"
                />
                <Button
                  onPress={openCreateWorkoutScreenForReps.bind(this)}
                  title="Reps"
                />
                <Button
                  onPress={openCreateWorkoutScreenForRounds.bind(this)}
                  title="Rounds"
                />
                <Button
                  onPress={openCreateWorkoutScreenForTime.bind(this)}
                  title="Timed"
                />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Button
                  onPress={() => setShowCreate(!showCreate)}
                  title={showCreate ? 'X' : 'Add workout'}
                />
                <Button
                  onPress={() => setFinishWorkoutGroupModalVisible(true)}
                  title={'Finish'}
                  style={{display: !showCreate ? 'flex' : 'none'}}
                />
              </View>
            </View>
          ) : (
            <></>
          )}
          {oGData && oGData.finished ? (
            <></>
          ) : (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                width: '100%',
                marginBottom: 12,
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <TouchableWithoutFeedback onPress={() => setEditable(!editable)}>
                <View>
                  <Switch
                    value={editable}
                    onValueChange={v => {
                      setEditable(!editable);
                    }}
                    trackColor={{
                      true: theme.palette.primary.contrastText,
                      false: theme.palette.primary.contrastText,
                    }}
                    thumbColor={
                      editable ? theme.palette.primary.main : theme.palette.gray
                    }
                  />
                  <SmallText>Delete</SmallText>
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
        </>
      ) : (
        <></>
      )}
      <Row style={{width: '100%', borderRadius: 8}} />
      <View
        style={{
          flex: 4,
          width: '100%',
          borderRadius: 8,
          backgroundColor: theme.palette.gray,
          paddingVertical: 20,
          paddingLeft: 10,
        }}>
        <Row>
          <StatsPanel tags={tags} names={names} />
          {/* <ScrollView>
                        <View style={{ marginTop: 16, marginRight: 8 }}>

                        </View>
                    </ScrollView> */}
        </Row>
      </View>
      <Row style={{width: '100%', borderRadius: 8}} />

      <Row style={{width: '100%', marginVertical: 28}}>
        {/* // TODO()  Make this a Flat list and render each workout item in sequence not in a flast list*/}
        {(showingOGWorkoutGroup && oGIsLoading) ||
        (!showingOGWorkoutGroup && completedIsLoading) ? (
          <SmallText>Loading....</SmallText>
        ) : (showingOGWorkoutGroup && oGIsSuccess) ||
          (!showingOGWorkoutGroup && completedIsSuccess) ? (
          <WorkoutCardFullList data={workouts} editable={editable} />
        ) : (showingOGWorkoutGroup && oGIsError) ||
          (!showingOGWorkoutGroup && completedIsError) ? (
          <SmallText>
            Error.... {oGError.toString() | completedError.toString()}
          </SmallText>
        ) : (
          <SmallText>No Data</SmallText>
        )}
      </Row>
      <ActionCancelModal
        actionText="Delete Workout Group"
        closeText="Close"
        modalText={`Delete ${title} (${
          showingOGWorkoutGroup ? 'Ori' : 'Comp'
        })?`}
        onAction={onDelete}
        modalVisible={deleteWorkoutGroupModalVisible}
        onRequestClose={() => setDeleteWorkoutGroupModalVisible(false)}
      />

      <ActionCancelModal
        actionText="Finish"
        closeText="Close"
        modalText={`Finish ${title}? \n \t cannot be undone`}
        onAction={_finishGroupWorkout}
        modalVisible={finishWorkoutGroupModalVisible}
        onRequestClose={() => setFinishWorkoutGroupModalVisible(false)}
      />
    </ScrollView>
  );
};

export default WorkoutScreen;
