import React, {FunctionComponent, useState} from 'react';
import {ScrollView, View} from 'react-native';

import {useTheme} from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';
import {TSParagrapghText} from '../Text/Text';
import {SCREEN_WIDTH} from '../shared';

import {PieChart} from 'react-native-chart-kit';
import HorizontalPicker from '../Pickers/HorizontalPicker';
import {chartConfig} from '../../app_pages/StatsScreen';
import twrnc from 'twrnc';

export const dateFormat = (d: Date) => {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const shade = 400;
const pieColors = [
  twrnc.color(`bg-red-${shade}`),
  twrnc.color(`bg-orange-${shade + 100}`),

  twrnc.color(`bg-amber-${shade}`),
  twrnc.color(`bg-yellow-${shade}`),

  twrnc.color(`bg-lime-${shade}`),
  twrnc.color(`bg-green-${shade}`),
  twrnc.color(`bg-emerald-${shade}`),

  twrnc.color(`bg-teal-${shade + 100}`),
  twrnc.color(`bg-cyan-${shade}`),
  twrnc.color(`bg-sky-${shade}`),
  twrnc.color(`bg-blue-${shade + 100}`),

  twrnc.color(`bg-indigo-${shade}`),
  twrnc.color(`bg-violet-${shade + 100}`),
  twrnc.color(`bg-purple-${shade}`),

  twrnc.color(`bg-fuchsia-${shade}`),
  twrnc.color(`bg-pink-${shade}`),
  twrnc.color(`bg-rose-${shade}`),
];

const pieData = (tags, metric) => {
  // Given a metric [dataTypes], return data

  const data: any[] = [];
  const labels: string[] = [];
  Object.keys(tags)
    .sort((a, b) => (a < b ? -1 : 1))
    .forEach((key, i) => {
      labels.push(key);
      if (tags[key] && tags[key][metric]) {
        const val = parseInt(tags[key][metric]);
        console.log('Val: ', key, metric, val);
        data.push({
          total: val,
          name: key,
          color: pieColors[i % pieColors.length],
          legendFontColor: '#FFF',
          legendFontSize: 10,
        });
      }
      // } else {
      //   data.push({
      //     total: 0,
      //     name: key,
      //     color: '#94a3b8',
      //     legendFontColor: '#94a3b8',
      //     legendFontSize: 8,
      //   });
      // }
    });

  return data;
};

const TotalsBarChart: FunctionComponent<{
  dataTypes: string[];
  tags: {};
  names: {};
}> = props => {
  const theme = useTheme();

  const [showAbsolute, setShowAbsolute] = useState(false);
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
  const PieData = pieData(
    showTags ? props.tags : props.names,
    barDataFilteredDataTypes[showBarChartDataType],
  );

  return (
    <View
      style={{
        marginBottom: 24,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderColor: theme.palette.text,
      }}>
      <View style={{width: '100%', flexDirection: 'row'}}>
        <TSParagrapghText>Totals</TSParagrapghText>
      </View>
      <View style={{width: '100%', flexDirection: 'row'}}>
        <Icon
          name="repeat"
          color={theme.palette.text}
          style={{fontSize: 24, marginHorizontal: 8}}
          onPress={() => {
            setShowTags(!showTags);
          }}
        />
        <Icon
          name="analytics"
          color={theme.palette.text}
          style={{fontSize: 24, marginHorizontal: 8}}
          onPress={() => {
            setShowAbsolute(!showAbsolute);
          }}
        />

        <HorizontalPicker
          key={`barChartKey_${barDataFilteredDataTypes.length}`}
          data={barDataFilteredDataTypes}
          onChange={setShowBarChartDataType}
        />
      </View>

      <ScrollView horizontal={true} style={{flex: 1, height: 200}}>
        <PieChart
          backgroundColor="transparent"
          paddingLeft="5"
          data={PieData}
          width={SCREEN_WIDTH}
          height={200}
          yAxisLabel=""
          chartConfig={chartConfig}
          accessor="total"
          fromZero
          absolute={showAbsolute}
        />
      </ScrollView>
    </View>
  );
};

export default TotalsBarChart;
