import React, {FunctionComponent} from 'react';
import styled from 'styled-components/native';
import {Container, SCREEN_HEIGHT, SCREEN_WIDTH} from '../shared';
import {SmallText, RegularText, LargeText, TitleText} from '../Text/Text';
import {useTheme} from 'styled-components';
import {
  GymCardListProps,
  GymClassCardListProps,
  WorkoutGroupCardListProps,
  WorkoutCardListProps,
  WorkoutItemListProps,
  WorkoutItemProps,
  WorkoutGroupCardProps,
  GymCardProps,
  GymClassCardProps,
} from './types';
import GymCard from './GymCard';
import GymClassCard, {GymClassTextCard} from './GymClassCard';
import WorkoutCard from './WorkoutCard';

import WorkoutGroupCard from './WorkoutGroupCard';

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
        console.log('Gym card item', item);
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

const WorkoutGroupCardList: FunctionComponent<{
  extraProps: any;
  data: WorkoutGroupCardProps[];
}> = props => {
  const theme = useTheme();

  return (
    <StyledList
      data={props.data}
      horizontal={false}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: SCREEN_HEIGHT * 0.1,
      }}
      ItemSeparatorComponent={() => <View style={{height: 20}} />}
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
          <WorkoutGroupCard
            card={innerprops.item}
            editable={props.extraProps.editable}
            closeParentModal={
              props.extraProps.closeModalOnNav
                ? props.extraProps.closeModalOnNav
                : () => {}
            }
          />
        );
      }}
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
            // TODO() deepcopy
            {...item}
          />
        );
      })}
    </View>
  );
};

const WorkoutItemPreviewHorizontalList: FunctionComponent<{
  data: WorkoutItemProps[];
  schemeType: number;
  itemWidth: number;
  testID?: string;
}> = props => {
  const theme = useTheme();
  console.log('TestID for Horiz WOrkout Items', props.testID);
  console.log('Data for Horiz WOrkout Items', props.data);
  return (
    <FlatList
      data={props.data}
      horizontal={true}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 15,
        paddingTop: 15,
      }}
      accessibilityLabel={props.testID}
      testID={props.testID}
      keyExtractor={(item: any) => {
        console.log('Null id item ', item);
        // id.toString();
        return ':';
      }}
      renderItem={renderProps => {
        const index = renderProps.index == undefined ? 0 : renderProps.index;
        return (
          <WorkoutItemPanel
            item={renderProps.item}
            schemeType={props.schemeType}
            itemWidth={props.itemWidth}
            idx={index + 1}
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
  WorkoutGroupCardList,
  WorkoutItemPreviewHorizontalList,
  WorkoutStatsByTagHorizontalList,
  WorkoutStatsByNameHorizontalList,
  WorkoutCardFullList,
};
