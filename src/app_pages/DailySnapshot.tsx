import React, {FunctionComponent, useMemo, useState} from 'react';
import {Image, View} from 'react-native';
import {useTheme} from 'styled-components';
import {
  WorkoutCardProps,
  WorkoutGroupCardProps,
  WorkoutGroupProps,
  WorkoutItemProps,
} from '../app_components/Cards/types';
import noDailyWorkout from '../../assets/bgs/nodailyworkout.png';
import FilterGrid from '../app_components/Grids/FilterGrid';
import {WorkoutGroupSquares} from '../app_components/Grids/GymClasses/WorkoutGroupSquares';
import {
  useGetDailySnapshotQuery,
  useGetProfileViewQuery,
  useGetProfileWorkoutGroupsQuery,
} from '../redux/api/apiSlice';
import {
  LargeText,
  TSParagrapghText,
  TSCaptionText,
  TSListTitleText,
  TSTitleText,
  TSSnippetText,
} from '../app_components/Text/Text';
import {RegularButton} from '../app_components/Buttons/buttons';
import * as RootNavigation from '../navigators/RootNavigation';
import Icon from 'react-native-vector-icons/Ionicons';
import BannerAddMembership from '../app_components/ads/BannerAd';
import ItemString from '../app_components/WorkoutItems/ItemString';
import {CalcWorkoutStats, SCREEN_HEIGHT} from '../app_components/shared';
import {StatsPanel} from '../app_components/Stats/StatsPanel';
import {ScrollView} from 'react-native-gesture-handler';
import EmojiScore from '../app_components/snapshots/emojiScore';

const DailySnapshotScreen: FunctionComponent = props => {
  const theme = useTheme();

  const {
    data: workoutGroups,
    isLoading: isLoadingWG,
    isSuccess: isSuccessWG,
    isError: isErrorWG,
    error: errorWG,
  } = useGetDailySnapshotQuery('');

  console.log('Daily Snapshot: ', workoutGroups);
  const [score, setScore] = useState(500);
  const [tags, names] = useMemo(() => {
    const calc = new CalcWorkoutStats();

    // Extract workouts from Group
    const workoutsFromGroup = workoutGroups?.map(
      (workoutGroup: WorkoutGroupProps) => {
        const _workouts: WorkoutCardProps[] =
          (workoutGroup.completed_workouts
            ? workoutGroup.completed_workouts
            : workoutGroup.workouts) ?? [];

        //   workouts.push(..._workouts);
        return _workouts;
      },
    );

    let workouts = [] as WorkoutCardProps[];
    if (workoutsFromGroup && workoutsFromGroup.length > 0) {
      workouts = workoutsFromGroup.reduce(
        (accWorkouts: WorkoutCardProps[], workouts: WorkoutCardProps[]) => {
          return accWorkouts.concat(workouts);
        },
      );
    }

    console.log('Workouts flattened: ', workouts);

    if (!workouts) return [{}, {}];

    calc.calcMulti(workouts, false);
    setScore(1000);
    return calc.getStats();
  }, [workoutGroups]);

  console.log('tags: ', tags);

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: theme.palette.backgroundColor,
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
      <BannerAddMembership />

      {isLoadingWG ? (
        <TSCaptionText>Loading...</TSCaptionText>
      ) : workoutGroups && workoutGroups.length > 0 ? (
        <View style={{flex: 1, flexDirection: 'column'}}>
          <View
            style={{
              backgroundColor: theme.palette.darkGray,
              borderRadius: 8,
              flex: 1,
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            {/* <EmojiScore score={score} /> */}
            <TSTitleText textStyles={{textAlign: 'center'}}>
              Completed
            </TSTitleText>
            <TSCaptionText textStyles={{textAlign: 'center'}}>
              October 10th
            </TSCaptionText>
          </View>
          <View
            style={{
              backgroundColor: theme.palette.darkGray,
              marginTop: 16,
              padding: 4,
              borderRadius: 8,
              flex: 4,
              justifyContent: 'center',
              alignContent: 'center',
              height: '100%',
            }}>
            <ScrollView style={{height: '100%', width: '100%'}}>
              {workoutGroups.map((workoutGroup: WorkoutGroupProps) => {
                const workouts: WorkoutCardProps[] =
                  (workoutGroup.completed_workouts
                    ? workoutGroup.completed_workouts
                    : workoutGroup.workouts) ?? [];

                return (
                  <View>
                    <TSListTitleText
                      textStyles={{
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 8,
                        padding: 2,
                        paddingLeft: 8,
                        textAlign: 'center',
                      }}>
                      {workoutGroup.title}
                    </TSListTitleText>
                    {workouts &&
                      workouts.map((workout: WorkoutCardProps) => {
                        return (
                          <View>
                            <TSSnippetText
                              textStyles={{
                                marginLeft: 6,
                                color: theme.palette.accent,
                              }}>
                              {workout.title}
                            </TSSnippetText>

                            {workout.workout_items &&
                              workout.workout_items.map(
                                (workout_item: WorkoutItemProps) => {
                                  return (
                                    <View style={{marginLeft: 12}}>
                                      <ItemString
                                        item={workout_item}
                                        prefix=""
                                        schemeType={workout.scheme_type}
                                      />
                                    </View>
                                  );
                                },
                              )}
                          </View>
                        );
                      })}
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <View
            style={{
              backgroundColor: theme.palette.darkGray,
              marginTop: 16,
              padding: 4,
              borderRadius: 8,
              flex: 3,
              marginBottom: 12,
            }}>
            <TSListTitleText
              textStyles={{
                backgroundColor: theme.palette.accent,
                borderRadius: 8,
                padding: 2,
                paddingLeft: 8,
                textAlign: 'center',
              }}>
              Stats
            </TSListTitleText>
            <ScrollView style={{width: '100%'}}>
              <StatsPanel tags={tags} names={names} />
            </ScrollView>
          </View>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: theme.palette.darkGray,

            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
            width: '100%',
          }}>
          <Image
            style={{width: '100%', height: '100%'}}
            source={noDailyWorkout}
          />
        </View>
      )}
    </View>
  );
};

export default DailySnapshotScreen;
