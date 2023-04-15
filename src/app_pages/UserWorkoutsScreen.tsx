import React, {FunctionComponent, useState} from 'react';
import {View} from 'react-native';
import {useTheme} from 'styled-components';
import {WorkoutGroupCardProps} from '../app_components/Cards/types';
import FilterGrid from '../app_components/Grids/FilterGrid';
import {WorkoutGroupSquares} from '../app_components/Grids/GymClasses/WorkoutGroupSquares';
import {useGetProfileWorkoutGroupsQuery} from '../redux/api/apiSlice';
import {SmallText} from '../app_components/Text/Text';

const UserWorkoutsScreen: FunctionComponent = props => {
  const theme = useTheme();

  const {
    data: dataWG,
    isLoading: isLoadingWG,
    isSuccess: isSuccessWG,
    isError: isErrorWG,
    error: errorWG,
  } = useGetProfileWorkoutGroupsQuery('');

  const _userWorkouts =
    !isLoadingWG && isSuccessWG
      ? ([
          ...dataWG.workout_groups?.created_workout_groups,
          ...dataWG.workout_groups?.completed_workout_groups,
        ] as WorkoutGroupCardProps[])
      : [];

  const userWorkouts = _userWorkouts.sort((a, b) =>
    a.for_date > b.for_date ? -1 : 1,
  );

  console.log('userWorkouts length', userWorkouts.length);
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: theme.palette.tertiary.main,
      }}>
      {userWorkouts.length ? (
        <View style={{padding: 12}}>
          <FilterGrid
            searchTextPlaceHolder="Search Workouts"
            uiView={WorkoutGroupSquares}
            items={userWorkouts}
            extraProps={{
              editable: true,
            }}
          />
        </View>
      ) : (
        <View style={{height: '100%', width: '100%', justifyContent: 'center'}}>
          <SmallText textStyles={{textAlign: 'center'}}>
            No workouts, go add a workout!
          </SmallText>
        </View>
      )}
    </View>
  );
};

export default UserWorkoutsScreen;
