import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import {useTheme} from 'styled-components';
import {WorkoutItemProps} from '../Cards/types';
import {displayJList, DISTANCE_UNITS, DURATION_UNITS} from '../shared';
import {TSCaptionText} from '../Text/Text';

const ItemString: FunctionComponent<{
  item: WorkoutItemProps;
  schemeType: number;
  prefix: string;
}> = ({item, schemeType, prefix}) => {
  const theme = useTheme();
  // console.log('Diplaying item: ', item);
  return (
    <View
      style={{width: '100%', borderRadius: 8, marginVertical: 6, padding: 6}}>
      <TSCaptionText>
        {`${prefix} `}
        {item.sets > 0 && schemeType === 0 ? `${item.sets} x ` : ''}

        {item.reps !== '[0]'
          ? `${displayJList(item.reps)}  `
          : item.distance !== '[0]'
          ? `${displayJList(item.distance)} ${
              DISTANCE_UNITS[item.distance_unit]
            } `
          : item.duration !== '[0]'
          ? `${displayJList(item.duration)} ${
              DURATION_UNITS[item.duration_unit]
            } of `
          : ''}

        {item.name.name}
        {JSON.parse(item.weights).length > 0 && JSON.parse(item.weights)[0] > 0
          ? ` @ ${displayJList(item.weights)}`
          : ''}
        {item.weight_unit === '%'
          ? ` percent of ${item.percent_of}`
          : JSON.parse(item.weights).length > 0 &&
            JSON.parse(item.weights)[0] > 0
          ? ` ${item.weight_unit}`
          : ''}

        {item.pause_duration > 0 ? ` for: ${item.pause_duration} s` : ''}
        {item.rest_duration > 0
          ? ` - Rest: ${item.rest_duration} ${
              DURATION_UNITS[item.rest_duration_unit]
            }`
          : ''}
      </TSCaptionText>
    </View>
  );
};

export default ItemString;
