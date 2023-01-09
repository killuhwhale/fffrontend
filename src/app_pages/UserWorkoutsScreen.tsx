import React, {FunctionComponent, useState} from 'react';
import {View} from 'react-native';
import {useTheme} from 'styled-components';
import {WorkoutGroupCardProps} from '../app_components/Cards/types';
import FilterGrid from '../app_components/Grids/FilterGrid';
import {WorkoutGroupSquares} from '../app_components/Grids/GymClasses/WorkoutGroupSquares';
import {useGetProfileWorkoutGroupsQuery} from '../redux/api/apiSlice';

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
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
      }}>
      <FilterGrid
        searchTextPlaceHolder="Search Workouts"
        uiView={WorkoutGroupSquares}
        items={userWorkouts}
        extraProps={{
          editable: true,
        }}
      />
    </View>

    // <WorkoutGroupCardList data={props.data} extraProps={{editable: true}} />
  );
};

export default UserWorkoutsScreen;
