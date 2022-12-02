import React, {FunctionComponent, useState} from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';
import {IconButton} from '@react-native-material/core';
import {SmallText, RegularText, LargeText, TitleText} from '../Text/Text';
import {Container, SCREEN_WIDTH} from '../shared';

import {LineChart} from 'react-native-chart-kit';
import HorizontalPicker from '../Pickers/HorizontalPicker';
import {chartConfig} from '../../app_pages/StatsScreen';

const ScreenContainer = styled(Container)`
  background-color: ${props => props.theme.palette.backgroundColor};
  justify-content: space-between;
  width: 100%;
`;
export const dateFormat = (d: Date) => {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};
const shortDateFormat = (d: Date) => {
  return `${d.getMonth() + 1}-${d.getDate()}`;
};
const bLineData = (workouts, tagName, metric) => {
  let labels: string[] = [];
  let data: number[] = [];
  workouts.forEach(workoutStats => {
    labels.push(shortDateFormat(new Date(workoutStats.date)));

    if (workoutStats[tagName]) {
      const stat = workoutStats[tagName][metric];
      data.push(stat);
    } else {
      data.push(0);
    }
  });
  // console.log('Line data: ', data)
  return {
    labels,
    datasets: [
      {
        data,
      },
    ],
  };
};

interface ContributionGraphValue {
  count: number | null;
  date: string | null;
}

const TotalsLineChart: FunctionComponent<{
  tagLabels: string[];
  nameLabels: string[];
  dataTypeYAxisSuffix: string[];
  dataTypes: string[];
  workoutTagStats: {}[];
  workoutNameStats: {}[];
}> = props => {
  const theme = useTheme();

  const filterLineDataTypes = (): string[][] => {
    const workouts: {}[] = showTags
      ? props.workoutTagStats
      : props.workoutNameStats;

    const tagNames = showTags ? props.tagLabels : props.nameLabels;

    let filteredDataTypes: string[] = [];
    let filteredDataTypesAbbrev: string[] = [];

    props.dataTypes.forEach((metric, i) => {
      let validMetric = false;
      tagNames.forEach(tagName => {
        workouts.forEach(workoutStats => {
          if (workoutStats[tagName]) {
            const stat = workoutStats[tagName][metric];
            if (stat > 0) {
              validMetric = true;
            }
          }
        });
      });

      if (validMetric) {
        filteredDataTypes.push(metric);
        filteredDataTypesAbbrev.push(props.dataTypeYAxisSuffix[i]);
      }
    });
    return [filteredDataTypes, filteredDataTypesAbbrev];
  };

  const [__filteredDataTypes, __filteredDataTypesAbbrev] =
    filterLineDataTypes();

  console.log(
    'Filtered data types line:',
    __filteredDataTypes,
    __filteredDataTypesAbbrev,
  );

  const [showTags, setShowTags] = useState(true); // Toggles between names and tags on the Bar Chart graph
  const [showLineChartDataType, setShowLineChartDataType] = useState(1); // Which data to show in the LineChart [totalReps etc...]

  // To stay aligned with horizontal picker, we will start at Idx 1, expcet when we only have 1 item to select from. Then it is set to 0
  const [showLineChartTagType, setShowLineChartTagType] = useState(
    props.tagLabels.length == 1 ? 0 : 1,
  ); // Which data to show in the LineChart

  const [showLineChartNameType, setShowLineChartNameType] = useState(
    props.nameLabels.length == 1 ? 0 : 1,
  ); // Which data to show in the LineChart

  // generate bar data, given all data with chosen metric/ dataType
  // We can generate a filtered dataTypes by parsing tags or names.
  // If we look at a dataType, metric, we can check if all values are zero...
  //  Then we can use that list for Horizontal Picker and the IDX will match the filteredList, and pick the right metric

  // Generate line data
  const BLineData = bLineData(
    showTags ? props.workoutTagStats : props.workoutNameStats,
    showTags
      ? props.tagLabels[showLineChartTagType]
      : props.nameLabels[showLineChartNameType],
    __filteredDataTypes[showLineChartDataType],
  );

  return (
    <View style={{flex: 3, width: '100%', marginBottom: 24}}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <RegularText>Totals by date</RegularText>

        <HorizontalPicker
          key={`magic${showTags}`}
          data={
            showTags && props.tagLabels.length > 0
              ? props.tagLabels
              : !showTags && props.nameLabels.length > 0
              ? props.nameLabels
              : []
          }
          onChange={
            showTags && props.tagLabels.length > 0
              ? setShowLineChartTagType
              : !showTags && props.nameLabels.length > 0
              ? setShowLineChartNameType
              : val => {
                  console.log('Empty onChange called!!', val);
                }
          }
        />
      </View>

      <View style={{flex: 1, width: '100%', flexDirection: 'row'}}>
        <View
          style={{
            flex: 1,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <IconButton
            style={{height: 24, marginHorizontal: 8}}
            icon={
              <Icon
                name="repeat"
                color={theme.palette.text}
                style={{fontSize: 24}}
              />
            }
            onPress={() => {
              // When the user changes between the 2 sets of data for the bLine Chart,
              // The horizontal picker resets to to 1, so we need to update the data to reflect the change in the child component.
              setShowLineChartTagType(props.tagLabels.length == 1 ? 0 : 1);
              setShowLineChartNameType(props.nameLabels.length == 1 ? 0 : 1);
              setShowTags(!showTags);
            }}
          />
          <HorizontalPicker
            key={'LineChart'}
            data={__filteredDataTypesAbbrev}
            onChange={setShowLineChartDataType}
          />
        </View>
      </View>

      <View style={{width: '100%', height: 180}}>
        <LineChart
          data={BLineData}
          width={SCREEN_WIDTH}
          height={180}
          verticalLabelRotation={8}
          chartConfig={chartConfig}
          bezier
          fromZero
        />
      </View>
    </View>
  );
};

export default TotalsLineChart;
