import React, {FunctionComponent, useState, useRef, useEffect} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'styled-components';

import RNPickerSelect from 'react-native-picker-select';

import {SmallText} from '../Text/Text';
import {WorkoutNameProps} from '../Cards/types';
import {useGetWorkoutNamesQuery} from '../../redux/api/apiSlice';
import {TestIDs} from '../../utils/constants';
import Input from '../Input/input';
import {numberInputStyle} from '../../app_pages/input_pages/gyms/CreateWorkoutScreen';
import {AddItemFontsize} from '../shared';
import {TouchableHighlight} from 'react-native-gesture-handler';

interface WorkoutNameRowItemProps {
  workoutName: WorkoutNameProps;
  onSelect(workoutName: WorkoutNameProps);
}

class WorkoutNameRowItem extends React.PureComponent<WorkoutNameRowItemProps> {
  render() {
    return (
      <TouchableOpacity
        testID={this.props.workoutName.name}
        onPress={() => this.props.onSelect(this.props.workoutName)}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            paddingHorizontal: 16,
            flex: 1,
            borderBottomColor: 'white',
            borderBottomWidth: 1,
            paddingVertical: 8,
          }}>
          <SmallText>{this.props.workoutName.name}</SmallText>
        </View>
      </TouchableOpacity>
    );
  }
}

// const WorkoutNameRowItem: FunctionComponent<WorkoutNameRowItemProps> = (
//   props: WorkoutNameRowItemProps,
// ) => {
//   return (
//     <TouchableHighlight
//       underlayColor="white"
//       style={{borderColor: 'red', borderWidth: 1}}
//       onPress={() => {
//         console.log('alskdnasklnd');
//       }}>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'center',
//           alignItems: 'center',
//           alignContent: 'center',
//           paddingHorizontal: 16,
//           flex: 1,
//           borderBottomColor: 'white',
//           borderBottomWidth: 1,
//           paddingVertical: 8,
//         }}>
//         <SmallText>{props.workoutName.name}</SmallText>
//       </View>
//     </TouchableHighlight>
//   );
// };

const PickerFilterListView: FunctionComponent<{
  data: [WorkoutNameProps];
  onSelect(workoutName: WorkoutNameProps);
}> = props => {
  const theme = useTheme();

  return (
    <View>
      <FlatList
        data={props.data}
        horizontal={false}
        contentContainerStyle={{flexGrow: 1}}
        keyExtractor={({id}: any) => id.toString()}
        renderItem={({item}: {item: WorkoutNameProps}) => {
          console.log('WorkoutName item: ', item);
          return (
            <WorkoutNameRowItem workoutName={item} onSelect={props.onSelect} />
          );
        }}
      />
    </View>
  );
};

export default PickerFilterListView;
