import React, {FunctionComponent} from 'react';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components';
import {
  GymCardListProps,
  GymClassCardListProps,
  WorkoutCardListProps,
  GymCardProps,
  GymClassCardProps,
  WorkoutDualItemProps,
  WorkkoutItemsList,
} from './types';
import GymCard from './GymCard';
import GymClassCard from './GymClassCard';
import WorkoutCard from './WorkoutCard';

import {FlatList, View} from 'react-native';
import {NamePanelItem, TagPanelItem, WorkoutStats} from '../Stats/StatsPanel';
import WorkoutItemPanel from '../WorkoutItems/ItemPanel';
import {TestIDs} from '../../utils/constants';

export const StyledList = styled.FlatList`
  width: 100%;
  padding-left: 12px;
  padding-right: 12px;
  padding-bottom: 15px;
  padding-top: 15px;
`;

const NarrowList = styled.FlatList`
  width: 100%;
  padding-left: 12px;
  padding-bottom: 6px;
`;

const GymCardList: FunctionComponent<GymCardListProps> = props => {
  const theme = useTheme();

  return (
    <StyledList
      data={props.data}
      horizontal={false}
      contentContainerStyle={{flexGrow: 1}}
      ItemSeparatorComponent={() => <View style={{height: 20}} />}
      keyExtractor={({id}: any) => id.toString()}
      renderItem={({item}: {item: GymCardProps}) => {
        return <GymCard {...item} />;
      }}
    />
  );
};

const GymClassCardList: FunctionComponent<GymClassCardListProps> = props => {
  const theme = useTheme();

  return (
    <StyledList
      data={props.data}
      horizontal={false}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      ItemSeparatorComponent={() => <View style={{height: 20}} />}
      keyExtractor={({id}: any) => id.toString()}
      renderItem={({item}: {item: GymClassCardProps}) => (
        <GymClassCard {...item} />
      )}
    />
  );
};

const WorkoutCardList: FunctionComponent<WorkoutCardListProps> = props => {
  const theme = useTheme();

  return (
    <StyledList
      data={props.data}
      horizontal={false}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      keyExtractor={({id}: any) => id.toString()}
      renderItem={({item}: any) => (
        <WorkoutCard editable={props.editable} {...item} />
      )}
    />
  );
};

const WorkoutCardFullList: FunctionComponent<WorkoutCardListProps> = props => {
  const theme = useTheme();
  // Testing
  // WorkoutCardList - 1 list of all Workoutsworkout
  // WorkoutCardItemList - List containing WorkoutItems, count for items per workout
  return (
    <View
      testID={TestIDs.WorkoutCardList.name()}
      style={{
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      {props.data.map(item => {
        const num_items = item.workout_items?.length || 0;
        return (
          <WorkoutCard
            testID={`${TestIDs.WorkoutCardItemList}_${item.title}_${num_items}`}
            key={`wcfl__${item.id}`}
            editable={props.editable}
            {...item}
            ownedByClass={props.group.owned_by_class}
          />
        );
      })}
    </View>
  );
};

const WorkoutItemPreviewHorizontalList: FunctionComponent<{
  data: WorkkoutItemsList;
  schemeType: number;
  itemWidth: number;
  testID?: string;
  ownedByClass: boolean;
}> = props => {
  const theme = useTheme();
  return (
    <FlatList
      data={props.data}
      horizontal={true}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'space-between',
        // width: '100%', baddd
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 15,
        paddingTop: 15,
      }}
      accessibilityLabel={props.testID}
      testID={props.testID}
      keyExtractor={(item: any, idx) => {
        // id.toString();
        return `${idx}_${item.id}`;
      }}
      renderItem={renderProps => {
        const index = renderProps.index == undefined ? 0 : renderProps.index;

        return (
          <WorkoutItemPanel
            item={renderProps.item as WorkoutDualItemProps}
            schemeType={props.schemeType}
            itemWidth={props.itemWidth}
            idx={index + 1}
            ownedByClass={props.ownedByClass}
          />
        );
      }}
      style={{height: '100%'}}
    />
  );
};
const WorkoutStatsByTagHorizontalList: FunctionComponent<{
  data: WorkoutStats[];
}> = props => {
  const theme = useTheme();

  return (
    <NarrowList
      data={props.data}
      horizontal={true}
      contentContainerStyle={{
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}
      keyExtractor={({key}: any) => `${Math.random()}_${key}`}
      renderItem={renderProps => {
        return <TagPanelItem tag={renderProps.item} />;
      }}
    />
  );
};

const WorkoutStatsByNameHorizontalList: FunctionComponent<{
  data: WorkoutStats[];
}> = props => {
  const theme = useTheme();

  return (
    <NarrowList
      data={props.data}
      horizontal={true}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      keyExtractor={({key}: any) => `${Math.random()}_${key}`}
      renderItem={renderProps => {
        return <NamePanelItem name={renderProps.item} />;
      }}
    />
  );
};

export {
  GymCardList,
  GymClassCardList,
  WorkoutCardList,
  WorkoutItemPreviewHorizontalList,
  WorkoutStatsByTagHorizontalList,
  WorkoutStatsByNameHorizontalList,
  WorkoutCardFullList,
};
