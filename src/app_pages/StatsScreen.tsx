import React, {FunctionComponent, useState} from 'react';
import {ScrollView, TouchableWithoutFeedback, View} from 'react-native';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components';
import {SmallText} from '../app_components/Text/Text';
import {
  Container,
  SCREEN_HEIGHT,
  processMultiWorkoutStats,
} from '../app_components/shared';
import {RootStackParamList} from '../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
import {useGetCompletedWorkoutGroupsForUserByDateRangeQuery} from '../redux/api/apiSlice';
import {WorkoutCardProps} from '../app_components/Cards/types';
import DatePicker from 'react-native-date-picker';

import TotalsBarChart from '../app_components/charts/barChart';
import TotalsLineChart from '../app_components/charts/lineChart';
import FreqCalendar from '../app_components/charts/freqCalendar';
export type Props = StackScreenProps<RootStackParamList, 'StatsScreen'>;

const ScreenContainer = styled(Container)`
  background-color: ${props => props.theme.palette.backgroundColor};
  justify-content: space-between;
  width: 100%;
`;
export const dateFormat = (d: Date) => {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

export const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

const StatsScreen: FunctionComponent<Props> = ({
  navigation,
  route: {params},
}) => {
  const theme = useTheme();
  const oneday = 1000 * 60 * 60 * 24;
  const today = new Date();
  const now = today.getTime();
  const five_days_ago = new Date(now - oneday * 15);

  const [startDate, setStartDate] = useState<Date>(five_days_ago);
  const [endDate, setEndDate] = useState<Date>(today);

  const {data, isLoading, isSuccess, isError, error} =
    useGetCompletedWorkoutGroupsForUserByDateRangeQuery({
      id: '0',
      startDate: dateFormat(startDate),
      endDate: dateFormat(endDate),
    });

  let allWorkouts: WorkoutCardProps[] = [];
  let workoutTagStats: {}[] = [];
  let workoutNameStats: {}[] = [];
  let tags = {};
  let names = {};

  // process selected workouts, tally up by name and tag(category)
  if (data && data.length > 0) {
    data.forEach(workoutGroup => {
      allWorkouts.push(...workoutGroup.completed_workouts); // Collect all workouts for bar data
      const [__tags, __names] = processMultiWorkoutStats(
        workoutGroup.completed_workouts,
      );

      // For bar Line data, series data.
      workoutTagStats.push({...__tags, date: workoutGroup.date});
      workoutNameStats.push({...__names, date: workoutGroup.date});
    });

    const [_tags, _names] = processMultiWorkoutStats(allWorkouts);

    tags = _tags;
    names = _names;
  }

  const tagLabels: string[] = Array.from(new Set(Object.keys(tags)));
  const nameLabels: string[] = Array.from(new Set(Object.keys(names)));

  // I dont need to show all of these
  // This is on both Bar and Line Chart....
  // But if the current dataset shows zero for one of these, it should not show.
  const dataTypes = [
    'totalDistanceM',
    'totalKgM',
    'totalKgSec',
    'totalKgs',
    'totalLbM',
    'totalLbSec',
    'totalLbs',
    'totalReps',
    'totalTime',
  ];

  // Abbrev. for dataTypes
  const dataTypeYAxisSuffix = [
    'm',
    'kg*m',
    'kg*sec',
    'kgs',
    'lb*m',
    'lb*sec',
    'lbs',
    'reps',
    'sec',
  ];

  const dataReady = workoutTagStats.length || workoutNameStats.length;

  return (
    <ScreenContainer>
      {/* Date Picker */}
      <View style={{flex: 2, width: '100%', alignItems: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            backgroundColor: theme.palette.darkGray,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 2,
            borderColor: theme.palette.text,
          }}>
          <SmallText textStyles={{textAlign: 'center', paddingLeft: 16}}>
            Start Date
          </SmallText>
          <DatePicker
            date={startDate}
            onDateChange={setStartDate}
            mode="date"
            locale="en"
            fadeToColor={theme.palette.darkGray}
            textColor={theme.palette.text}
            maximumDate={new Date(new Date().getTime() + oneday)}
            style={{height: SCREEN_HEIGHT * 0.06, transform: [{scale: 0.65}]}}
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
            End Date
          </SmallText>
          <DatePicker
            date={endDate}
            onDateChange={setEndDate}
            mode="date"
            locale="en"
            fadeToColor={theme.palette.darkGray}
            textColor={theme.palette.text}
            style={{height: SCREEN_HEIGHT * 0.06, transform: [{scale: 0.65}]}}
          />
        </View>
      </View>
      <View style={{flex: 8}}>
        <ScrollView>
          {dataReady ? (
            <>
              <FreqCalendar
                startDate={startDate}
                endDate={endDate}
                data={data}
              />

              <TotalsBarChart dataTypes={dataTypes} tags={tags} names={names} />

              <TotalsLineChart
                dataTypes={dataTypes}
                nameLabels={nameLabels}
                tagLabels={tagLabels}
                dataTypeYAxisSuffix={dataTypeYAxisSuffix}
                workoutNameStats={workoutNameStats}
                workoutTagStats={workoutTagStats}
              />
            </>
          ) : (
            <></>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
};

export default StatsScreen;
