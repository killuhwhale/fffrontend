import React, {FunctionComponent, useState} from 'react';
import {View} from 'react-native';

import {useTheme} from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';
import {IconButton} from '@react-native-material/core';
import {SmallText, RegularText, LargeText, TitleText} from '../Text/Text';
import {SCREEN_WIDTH} from '../shared';

import {BarChart} from 'react-native-chart-kit';
import HorizontalPicker from '../Pickers/HorizontalPicker';
import {chartConfig} from '../../app_pages/StatsScreen';

export const dateFormat = (d: Date) => {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const barData = (tags, metric) => {
  // Given a metric [dataTypes], return data

  const data: number[] = [];
  const labels: string[] = [];
  Object.keys(tags).forEach(key => {
    const val = parseInt(tags[key][metric]);
    console.log('Val: ', key, metric, val);
    data.push(val);
    labels.push(key);
  });

  return {
    labels,
    datasets: [
      {
        data,
      },
    ],
  };
};

const TotalsBarChart: FunctionComponent<{
  dataTypes: string[];
  tags: {};
  names: {};
}> = props => {
  const theme = useTheme();

  const [showTags, setShowTags] = useState(true);

  // todo,

  const _barDataFilteredDataTypes = () => {
    const rawData = showTags ? props.tags : props.names;
    const filteredDataTypes: string[] = [];
    props.dataTypes.forEach(metric => {
      let validMetric = false;
      Object.keys(rawData).forEach(key => {
        const val = parseInt(rawData[key][metric]);
        if (val > 0) {
          validMetric = true;
        }
      });
      if (validMetric) {
        filteredDataTypes.push(metric);
      }
    });
    return filteredDataTypes;
  };

  const __barDataFilteredDataTypes = _barDataFilteredDataTypes();
  const barDataFilteredDataTypes =
    __barDataFilteredDataTypes.length === 0 ? [] : __barDataFilteredDataTypes;

  const [showBarChartDataType, setShowBarChartDataType] = useState(
    barDataFilteredDataTypes.length > 1 ? 1 : 0,
  ); // Which data to show in the BarChart [totalReps etc...]

  // generate bar data, given all data with chosen metric/ dataType
  // We can generate a filtered dataTypes by parsing tags or names.
  // If we look at a dataType, metric, we can check if all values are zero...
  //  Then we can use that list for Horizontal Picker and the IDX will match the filteredList, and pick the right metric
  const BarData = barData(
    showTags ? props.tags : props.names,
    barDataFilteredDataTypes[showBarChartDataType],
  );

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
      <View style={{width: '100%', flexDirection: 'row'}}>
        <RegularText>Totals</RegularText>
      </View>
      <View style={{width: '100%', flexDirection: 'row'}}>
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
            setShowTags(!showTags);
          }}
        />

        <HorizontalPicker
          key="barChartKey"
          data={barDataFilteredDataTypes}
          onChange={setShowBarChartDataType}
        />
      </View>

      <View style={{width: '100%', height: 180}}>
        <BarChart
          style={{}}
          yAxisSuffix=""
          data={BarData}
          width={SCREEN_WIDTH}
          height={180}
          yAxisLabel=""
          chartConfig={chartConfig}
          verticalLabelRotation={2}
          showValuesOnTopOfBars
          fromZero
        />
      </View>
    </View>
  );
};

export default TotalsBarChart;
