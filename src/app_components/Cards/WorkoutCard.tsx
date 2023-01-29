import React, {FunctionComponent, useState} from 'react';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components';
import {SmallText, RegularText, LargeText, TitleText} from '../Text/Text';
import {useNavigation} from '@react-navigation/native';
import {
  displayJList,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  WORKOUT_TYPES,
  WORKOUT_TYPE_LABELS,
} from '../shared';
import {GymClassCardProps, WorkoutCardProps} from './types';
import {View} from 'react-native';
import {Props as GymClassScreenProps} from '../../app_pages/GymClassScreen';
import {AnimatedButton} from '../Buttons/buttons';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  useDeleteCompletedWorkoutMutation,
  useDeleteWorkoutMutation,
} from '../../redux/api/apiSlice';
import {WorkoutItemPreviewHorizontalList} from './cardList';

const CardRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

//Todo
// Button for WorkoutName info/ media
// Button to add workout to CompletedWorkouts
// Possbily this will pre-load a new Component/ Model that way we can alter the numbers we used instead....
// Caculate load/ volume of workout.

const WorkoutCard: FunctionComponent<WorkoutCardProps> = props => {
  const theme = useTheme();
  const cardWidth = SCREEN_WIDTH * 0.92;
  const colWidth = cardWidth * 0.45;

  const navigation = useNavigation<GymClassScreenProps['navigation']>();

  const [deleteWorkout, {isLoading}] = useDeleteWorkoutMutation();
  const [deleteCompletedWorkout, {isLoading: deleteCompletedWorkoutIsLoading}] =
    useDeleteCompletedWorkoutMutation();
  // console.log("Workout card props: ", props)
  const isOGWorkout = props.workout_items ? true : false;
  const items = props.workout_items
    ? props.workout_items
    : props.completed_workout_items
    ? props.completed_workout_items
    : [];
  const numItems = items.length - 1;
  const itemsPerCol = 1;
  const numCols = Math.max(1, Math.ceil(items.length / itemsPerCol));
  const navToWorkoutDetail = () => {
    navigation.navigate('WorkoutDetailScreen', props);
  };

  const _deleteWorkout = () => {
    if (isOGWorkout) {
      const data = new FormData();
      data.append('group', props.group?.id);
      data.append('id', props.id);
      deleteWorkout(data);
    } else {
      deleteCompletedWorkout(props.id);
    }
  };

  return (
    <View
      style={{
        width: SCREEN_WIDTH * 1.0,
        borderRadius: 25,
        marginBottom: 24,
        paddingBottom: 12,
      }}>
      <View style={{width: '100%', paddingLeft: 8, paddingTop: 8, flex: 1}}>
        <WorkoutItemPreviewHorizontalList
          data={items}
          schemeType={props.scheme_type}
          itemWidth={colWidth}
        />
      </View>
      <View
        style={{
          borderColor: theme.palette.text,
          borderWidth: props.editable ? 5 : 0,
          borderRadius: 25,
          backgroundColor: theme.palette.transparent,
          flex: 2,
        }}>
        <AnimatedButton
          onFinish={() =>
            props.editable ? _deleteWorkout() : navToWorkoutDetail()
          }
          title="del workout"
          active={props.editable}>
          <CardRow style={{height: '100%'}}>
            <View
              style={{
                flexDirection: 'row',
                paddingLeft: 16,
                justifyContent: 'space-between',
                alignContent: 'space-between',
                alignItems: 'center',
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 8,
              }}>
              <RegularText>{props.title} </RegularText>
              <SmallText>
                {WORKOUT_TYPE_LABELS[props.scheme_type]}{' '}
                {displayJList(props.scheme_rounds)}
              </SmallText>

              <Icon
                name="chevron-forward-outline"
                color={theme.palette.text}
                style={{fontSize: 24}}
              />
            </View>
          </CardRow>
        </AnimatedButton>
      </View>
    </View>
  );
};

export default WorkoutCard;
