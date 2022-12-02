import React, {FunctionComponent} from 'react';
import styled from 'styled-components/native';
import {Container, SCREEN_HEIGHT} from '../shared';
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
} from './types';
import GymCard from './GymCard';
import GymClassCard, {GymClassTextCard} from './GymClassCard';
import WorkoutCard from './WorkoutCard';
import WorkoutItemRow from './WorkoutItemRow';
import WorkoutRow from './WorkoutRow';
import WorkoutGroupCard from './WorkoutGroupCard';
import {
  ItemPanel,
  ItemString,
} from '../../app_pages/input_pages/gyms/CreateWorkoutScreen';
import {
  NamePanelItem,
  TagPanelItem,
  WorkoutStats,
} from '../../app_pages/WorkoutDetailScreen';
import {View} from 'react-native';
// import { PickerListItem } from "../../app_pages/StatsScreen";

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
      contentContainerStyle={{
        alignItems: 'center',
      }}
      ItemSeparatorComponent={() => <View style={{height: 20}} />}
      keyExtractor={({id}: any) => id.toString()}
      renderItem={({item}: any) => <GymCard {...item} />}
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
      renderItem={({item}: any) => <GymClassCard {...item} />}
    />
  );
};
const GymClassTextCardList: FunctionComponent<{
  extraProps: any;
  data: GymClassCardListProps;
}> = props => {
  const theme = useTheme();
  console.log('Listsss', props);
  return (
    <StyledList
      data={props.data}
      extraProps={props.extraProps}
      horizontal={false}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      ItemSeparatorComponent={() => <View style={{height: 20}} />}
      keyExtractor={({id}: any) => id.toString()}
      renderItem={(innerprops: any) => {
        console.log('List item_______', props);

        return (
          <GymClassTextCard
            closeParentModal={props.extraProps.closeModalOnNav}
            card={innerprops.item}
          />
        );
      }}
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

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      {props.data.map(item => {
        return (
          <WorkoutCard
            key={`wcfl__${item.id}`}
            editable={props.editable}
            {...item}
          />
        );
      })}
    </View>
  );

  // <StyledList
  //   data={props.data}
  //   horizontal={false}
  //   contentContainerStyle={{
  //     alignItems: 'center',
  //     justifyContent: 'space-between',
  //   }}
  //   keyExtractor={({id}: any) => id.toString()}
  //   renderItem={({item}: any) => (
  //     <WorkoutCard editable={props.editable} {...item} />
  //   )}
  // />
};

const WorkoutItemCardList: FunctionComponent<WorkoutItemListProps> = props => {
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
      renderItem={({item}: any) => <WorkoutItemRow {...item} />}
    />
  );
};

const WorkoutItemPreviewHorizontalList: FunctionComponent<{
  data: WorkoutItemProps[];
  schemeType: number;
  itemWidth: number;
}> = props => {
  const theme = useTheme();

  return (
    <StyledList
      data={props.data}
      horizontal={true}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      keyExtractor={({id}: any) => id.toString()}
      renderItem={renderProps => {
        const index = renderProps.index == undefined ? 0 : renderProps.index;
        return (
          <ItemPanel
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
  WorkoutItemCardList,
  WorkoutGroupCardList,
  WorkoutItemPreviewHorizontalList,
  WorkoutStatsByTagHorizontalList,
  WorkoutStatsByNameHorizontalList,
  GymClassTextCardList,
  WorkoutCardFullList,
};
