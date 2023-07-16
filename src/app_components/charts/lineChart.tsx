import React, {FunctionComponent, useEffect, useMemo, useState} from 'react';
import {ScrollView, View} from 'react-native';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  SmallText,
  RegularText,
  LargeText,
  TitleText,
  XSmallText,
} from '../Text/Text';
import {Container, SCREEN_WIDTH} from '../shared';

import {LineChart} from 'react-native-chart-kit';
import HorizontalPicker from '../Pickers/HorizontalPicker';
import {chartConfig} from '../../app_pages/StatsScreen';

const displayNum = (x: number): string => {
  const s = x.toString();
  const slen = s.length;
  let num3s = Math.floor(slen / 3);
  let suffix = '';

  if (slen <= 3) {
    return s;
  }

  if (num3s === 0) {
    suffix = '';
  } else if (num3s === 1) {
    suffix = 'k';
  } else if (num3s === 2) {
    suffix = 'm';
  } else if (num3s === 3) {
    suffix = 'b';
  } else if (num3s === 4) {
    suffix = 't';
  } else if (num3s === 5) {
    suffix = 'quad';
  } else if (num3s === 5) {
    suffix = 'quint';
  }

  return `${s[0]}.${s[1]}${s[2]}${suffix}`;
};

const Decorator = ({x, y, index, indexData}) => {
  const trialAndErrorFactor = 4;
  const numChars = Math.ceil(
    (indexData.toString().length * trialAndErrorFactor) / 2,
  ); // divide by 2 for midpoint

  return (
    <XSmallText
      textStyles={{
        position: 'absolute',
        left: x - numChars,
        top: y - 15,
        textAlign: 'center',
      }}
      key={index}>
      {displayNum(indexData)}
    </XSmallText>
  );
};

export const dateFormat = (d: Date) => {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};
const shortDateFormat = (d: Date) => {
  return `${d.getMonth() + 1}-${d.getDate()}`;
};
const bLineData = (workouts: any[], tagName, metric) => {
  let labels: string[] = [];
  let data: number[] = [];
  workouts
    .sort((a, b) => (a['date'] < b['date'] ? -1 : 1))
    .forEach(workoutStats => {
      // console.log('bLineData:', workoutStats);
      labels.push(shortDateFormat(new Date(workoutStats.date)));

      if (workoutStats[tagName] && workoutStats[tagName][metric]) {
        const stat = workoutStats[tagName][metric];
        data.push(stat);
      } else {
        data.push(0);
      }
    });
  // console.log('Line data: ', data);
  return {
    labels,
    datasets: [
      {
        data,
      },
    ],
  };
};

const TotalsLineChart: FunctionComponent<{
  tagLabels: string[];
  nameLabels: string[];
  dataTypeYAxisSuffix: string[];
  dataTypes: string[];
  workoutTagStats: {}[];
  workoutNameStats: {}[];
}> = props => {
  const theme = useTheme();

  const filterLineDataTypes = (tagName: string): string[][] => {
    const workouts: {}[] = showTags
      ? props.workoutTagStats
      : props.workoutNameStats;

    let filteredDataTypes: string[] = [];
    let filteredDataTypesAbbrev: string[] = [];

    props.dataTypes.forEach((metric, i) => {
      let validMetric = false;
      // tagNames.forEach(tagName => {
      workouts.forEach(workoutStats => {
        if (workoutStats[tagName]) {
          const stat = workoutStats[tagName][metric];
          // console.log(`Tag: ${tagName} - Metric: ${metric} -  Stat: ${stat} `);
          if (stat > 0) {
            validMetric = true;
          }
        }
      });
      // });

      if (validMetric) {
        filteredDataTypes.push(metric);
        filteredDataTypesAbbrev.push(props.dataTypeYAxisSuffix[i]);
      }
    });

    return [filteredDataTypes, filteredDataTypesAbbrev];
  };

  const [showTags, setShowTags] = useState(true); // Toggles between names and tags on the Bar Chart graph

  // To stay aligned with horizontal picker, we will start at Idx 1, expcet when we only have 1 item to select from. Then it is set to 0

  const [showLineChartTagType, setShowLineChartTagType] = useState(
    props.tagLabels.length == 1 ? 0 : 1,
  ); // Which data to show in the LineChart

  const [showLineChartNameType, setShowLineChartNameType] = useState(
    props.nameLabels.length == 1 ? 0 : 1,
  ); // Which data to show in the LineChart

  const [__filteredDataTypes, __filteredDataTypesAbbrev] = useMemo(() => {
    return filterLineDataTypes(
      showTags
        ? props.tagLabels[showLineChartTagType]
        : props.nameLabels[showLineChartNameType],
    );
  }, [showLineChartTagType, showLineChartNameType]);

  // Filtered data types line: ["totalKgSec", "totalKgs", "totalLbSec", "totalLbs", "totalReps", "totalTime"] ["kg*sec", "kgs", "lb*sec", "lbs", "reps", "sec"]
  // console.log(
  //   'Filtered data types line:',
  //   __filteredDataTypes,
  //   __filteredDataTypesAbbrev,
  // );

  const [showLineChartDataType, setShowLineChartDataType] = useState(
    __filteredDataTypes.length > 1 ? 1 : 0,
  ); // Which data to show in the LineChart [totalReps etc...]
  const [prevDTLength, setPrevDTLength] = useState(__filteredDataTypes.length);

  // Helps align data and horizontal list when Tag or Name Chagnes.
  useEffect(() => {
    // Case 1
    // WE are at a data point with only reps length 1 showLineChartDataType== 0
    // Switch to Length 2> and the list shows highlighted at 2 but data is at 1 still from previous
    // We should then switch to 1 since we are at 0 or less than something...?

    // Case 2
    // We are at length 3 and move to length 1
    // Nothing shows.
    // We should update showLineChartDataType to the end index

    // Rule 1
    // When at a single data point list, and move to something with 2 or more, set to index 1.
    // idx 0 when Len of 1 to Len of 2> set to 1

    // Horizontal list, anytime it goes to a new list with a different length, it will go to 0 if Length of new liust is 1 and 1 if the new list is longer than 1.
    //       If the lists are the same length, the highlighted index remains the same

    //

    if (prevDTLength == __filteredDataTypes.length) {
      return;
    } else if (__filteredDataTypes.length == 1) {
      setShowLineChartDataType(0);
    } else {
      //else if(__filteredDataTypes.length > prevDTLength)
      setShowLineChartDataType(1);
    }
    // else if (__filteredDataTypes.length < prevDTLength) {
    //   setShowLineChartDataType(__filteredDataTypes.length - 1);
    // }
    setPrevDTLength(__filteredDataTypes.length);
  }, [showLineChartTagType, showLineChartNameType, showLineChartDataType]);

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
          key={`hp_${showTags}_${
            showTags ? props.tagLabels.length : props.nameLabels.length
          }`}
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
          <Icon
            name="repeat"
            color={theme.palette.text}
            style={{fontSize: 24, marginHorizontal: 8}}
            onPress={() => {
              // When the user changes between the 2 sets of data for the bLine Chart,
              // The horizontal picker resets to to 1, so we need to update the data to reflect the change in the child component.
              setShowLineChartTagType(props.tagLabels.length == 1 ? 0 : 1);
              setShowLineChartNameType(props.nameLabels.length == 1 ? 0 : 1);
              setShowTags(!showTags);
            }}
          />

          <HorizontalPicker
            key={`hpDataTypes_${__filteredDataTypesAbbrev.length}`}
            data={__filteredDataTypesAbbrev}
            onChange={setShowLineChartDataType}
          />
        </View>
      </View>

      <ScrollView horizontal={true} style={{flex: 1, height: 260}}>
        <LineChart
          data={BLineData}
          width={BLineData.labels.length * 30}
          height={260}
          verticalLabelRotation={90}
          chartConfig={chartConfig}
          renderDotContent={Decorator}
          bezier
          fromZero
        />
      </ScrollView>
    </View>
  );
};

export default TotalsLineChart;
