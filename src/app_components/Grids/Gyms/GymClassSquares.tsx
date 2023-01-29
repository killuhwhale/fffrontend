import React, {FunctionComponent} from 'react';
import styled from 'styled-components/native';
import {SCREEN_HEIGHT} from '../../shared';
import {useTheme} from 'styled-components';
import {View} from 'react-native';
import ClassGridItem from './ClassGridItem';
import {GymClassCardListProps} from '../../Cards/types';

export const StyledList = styled.FlatList`
  width: 100%;
  padding-left: 12px;
  padding-right: 12px;
  padding-bottom: 15px;
  padding-top: 15px;
`;

const GymClassSquares: FunctionComponent<{
  extraProps: any;
  data: GymClassCardListProps;
}> = props => {
  const theme = useTheme();
  console.log('Listsss', props);
  return (
    <StyledList
      keyboardShouldPersistTaps="always"
      data={props.data}
      extraProps={props.extraProps}
      horizontal={false}
      contentContainerStyle={{paddingBottom: SCREEN_HEIGHT * 0.05}}
      numColumns={2}
      ItemSeparatorComponent={() => <View style={{height: 10}} />}
      keyExtractor={({id}: any) => id.toString()}
      renderItem={(innerprops: any) => {
        console.log('List item_______', props);

        return <ClassGridItem card={innerprops.item} />;
      }}
    />
  );
};

export {GymClassSquares};
