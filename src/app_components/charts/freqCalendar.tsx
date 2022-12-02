import React, {FunctionComponent, useState} from 'react';
import {ScrollView, View} from 'react-native';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components';
import {ContributionGraph} from 'react-native-chart-kit';
import {ContributionChartValue} from 'react-native-chart-kit/dist/contribution-graph/ContributionGraph';
import {RectProps} from 'react-native-svg/lib/typescript/elements/Rect';

import {RegularText} from '../Text/Text';
import {Container, SCREEN_WIDTH} from '../shared';
import {WorkoutCardProps, WorkoutGroupProps} from '../Cards/types';

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

interface FreqDataProps {
  date: string;
  count: number;
}

const frequencyData = (workoutGroups: WorkoutGroupProps[]): FreqDataProps[] => {
  if (!workoutGroups) {
    return [{date: dateFormat(new Date()), count: 0}];
  }

  const rawData = {};
  workoutGroups.forEach(workoutGroup => {
    let _workouts: WorkoutCardProps[] = [];
    if (workoutGroup.workouts?.length) {
      _workouts = workoutGroup.workouts;
    }
    if (workoutGroup.completed_workouts?.length) {
      _workouts = workoutGroup.completed_workouts;
    }
    const dateVal = dateFormat(new Date(workoutGroup.for_date));
    if (!rawData[dateVal]) {
      rawData[dateVal] = 1;
    } else {
      rawData[dateVal] += 1;
    }
  });

  return Object.entries(rawData).map(
    ([date, value]) => ({date, count: value} as FreqDataProps),
  );
};

interface ContributionGraphValue {
  count: number | null;
  date: string | null;
}

const FreqCalendar: FunctionComponent<{
  data: WorkoutGroupProps[];
  startDate: Date;
  endDate: Date;
}> = props => {
  const theme = useTheme();
  const oneday = 1000 * 60 * 60 * 24;
  const today = new Date();
  const now = today.getTime();
  const five_days_ago = new Date(now - oneday * 15);
  const initCalendarText = 'Select workout';

  const _dayDelta = Math.ceil(
    (props.endDate.getTime() - props.startDate.getTime()) / oneday,
  );
  const calendarDayDelta = Math.max(35, _dayDelta);

  const [calendarText, setCalendarText] = useState(initCalendarText);

  // generate bar data, given all data with chosen metric/ dataType
  // We can generate a filtered dataTypes by parsing tags or names.
  // If we look at a dataType, metric, we can check if all values are zero...
  //  Then we can use that list for Horizontal Picker and the IDX will match the filteredList, and pick the right metric

  // Generate Contribution Graph data
  const freqData = frequencyData(props.data);

  return (
    <View
      style={{
        flex: 3,
        width: '100%',
        marginBottom: 24,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderColor: theme.palette.text,
      }}>
      <RegularText>{calendarText}</RegularText>
      <ScrollView horizontal>
        <ContributionGraph
          tooltipDataAttrs={(
            value: ContributionChartValue,
          ): Partial<RectProps> | Partial<RectProps> => {
            const val = value as unknown as ContributionGraphValue;
            return {
              onPress: () => {
                if (val.count && val.date) {
                  setCalendarText(
                    `${val.date?.toString()}: ${val.count ?? 0} workout${
                      val.count ?? 0 > 1 ? 's' : ''
                    }`,
                  );
                } else {
                  setCalendarText(initCalendarText);
                }
              },
            };
          }}
          values={freqData}
          endDate={props.endDate}
          // factor = 2/7 or 7/2 == 3.5
          numDays={calendarDayDelta}
          width={Math.ceil(
            Math.max(SCREEN_WIDTH * 0.92, calendarDayDelta * 3.5),
          )}
          height={220}
          chartConfig={chartConfig}
        />
      </ScrollView>
    </View>
  );
};

export default FreqCalendar;
