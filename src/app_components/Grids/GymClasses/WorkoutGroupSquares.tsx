import React, {FunctionComponent} from 'react';
import styled from 'styled-components/native';
import {Container, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../shared';
import {SmallText, RegularText, LargeText, TitleText} from '../../Text/Text';
import {useTheme} from 'styled-components';

import {View} from 'react-native';

import {WorkoutGroupCardProps} from '../../Cards/types';

import WorkoutGroupGridItem from './WorkoutGroupGridItem';

export const StyledList = styled.FlatList`
  width: 100%;
  padding-left: 12px;
  padding-right: 12px;
  padding-bottom: 15px;
  padding-top: 15px;
`;

const WorkoutGroupSquares: FunctionComponent<{
  extraProps: any;
  data: WorkoutGroupCardProps[];
}> = props => {
  const theme = useTheme();

  return (
    <StyledList
      data={props.data}
      horizontal={false}
      contentContainerStyle={{paddingBottom: SCREEN_HEIGHT * 0.05}}
      ItemSeparatorComponent={() => <View style={{height: 1}} />}
      keyExtractor={(item: any) => {
        // In profile, we have combined WorkoutGroups
        // WorkoutGroups & CompletedWorkoutGroups, thus we will have conflicting key when using id
        // Only WorkoutGroups contain the key, owned_by_class.
        return item.owned_by_class !== undefined
          ? `wg-${item.id.toString()}`
          : `cwg-${item.id.toString()}`;
      }}
      renderItem={(innerprops: any) => {
        return (
          <WorkoutGroupGridItem
            card={innerprops.item}
            editable={props.extraProps.editable}
          />
        );
      }}
    />
  );
};

export {WorkoutGroupSquares};
