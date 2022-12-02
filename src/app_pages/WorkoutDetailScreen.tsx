import React, {FunctionComponent} from 'react';
import styled from 'styled-components/native';
import {
  Container,
  displayJList,
  DISTANCE_UNITS,
  DURATION_UNITS,
  DURATION_W,
  processWorkoutStats,
  REPS_W,
  ROUNDS_W,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  STANDARD_W,
  WORKOUT_TYPES,
} from '../app_components/shared';
import {
  SmallText,
  RegularText,
  LargeText,
  TitleText,
} from '../app_components/Text/Text';
// import { withTheme } from 'styled-components'
import {useTheme} from 'styled-components';
import {
  WorkoutGroupCardList,
  WorkoutItemPreviewHorizontalList,
  WorkoutStatsByNameHorizontalList,
  WorkoutStatsByTagHorizontalList,
} from '../app_components/Cards/cardList';

import {RootStackParamList} from '../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
import {StyleSheet, View} from 'react-native';
import {useGetGymClassDataViewQuery} from '../redux/api/apiSlice';
import {
  WorkoutCardProps,
  WorkoutItemListProps,
  WorkoutItemProps,
} from '../app_components/Cards/types';
export type Props = StackScreenProps<RootStackParamList, 'WorkoutDetailScreen'>;

const ScreenContainer = styled(Container)`
  background-color: ${props => props.theme.palette.backgroundColor};
  justify-content: space-between;
  width: 100%;
  padding: 16px;
`;

/**
 *
 * @param schemeRounds
 * @param schemeType
 * @param items
 * @returns
 *
 * [{name: {primary: "lower"},...}, {},....]
 *
 * TAGS = {
 *  "lower": {
 *      totalReps: 10,
        totalLbs: 10,
        totalKgs: 10,
 *  },
 * }
 *
 *
 */

export interface WorkoutStats {
  totalReps: number;
  totalLbs: number;
  totalKgs: number;
  // Total duration seconds
  totalTime: number;
  totalKgSec: number;
  totalLbSec: number;

  // Total Distance Meters
  totalDistanceM: number;
  totalKgM: number;
  totalLbM: number;
  key?: string;
}

export const TagPanelItem: FunctionComponent<{tag: WorkoutStats}> = ({tag}) => {
  return (
    <View style={PanelStyle.container}>
      <RegularText>{tag.key}</RegularText>
      {tag.totalReps ? <SmallText>Reps: {tag.totalReps}</SmallText> : <></>}
      {tag.totalKgs ? <SmallText>Volume: {tag.totalKgs} kg</SmallText> : <></>}
      {tag.totalLbs ? <SmallText>Volume: {tag.totalLbs} lb</SmallText> : <></>}

      {tag.totalTime ? (
        <SmallText>Duration: {tag.totalTime} sec</SmallText>
      ) : (
        <></>
      )}
      {tag.totalKgSec ? (
        <SmallText>Volume: {tag.totalKgSec} kg secs</SmallText>
      ) : (
        <></>
      )}
      {tag.totalLbSec ? (
        <SmallText>Volume: {tag.totalLbSec} lb secs</SmallText>
      ) : (
        <></>
      )}

      {tag.totalDistanceM ? (
        <SmallText>Distance: {tag.totalDistanceM} m </SmallText>
      ) : (
        <></>
      )}
      {tag.totalKgM ? (
        <SmallText>Volume: {tag.totalKgM} kg Meters</SmallText>
      ) : (
        <></>
      )}
      {tag.totalLbM ? (
        <SmallText>Volume: {tag.totalLbM} lb Meters</SmallText>
      ) : (
        <></>
      )}
    </View>
  );
};

/**
 *  totalReps: 0,
    totalLbs: 0,
    totalKgs: 0,

    // Total duration seconds
    totalTime: 0,
    totalKgSec: 0,
    totalLbSec: 0,

    // Total Distance Meters
    totalDistanceM: 0,
    totalKgM: 0,
    totalLbM: 0,
*/
export const NamePanelItem: FunctionComponent<{name: WorkoutStats}> = ({
  name,
}) => {
  // console.log("Name props", name)
  return (
    <View style={PanelStyle.container}>
      <RegularText>{name.key}</RegularText>
      {name.totalReps ? <SmallText>Reps: {name.totalReps}</SmallText> : <></>}
      {name.totalKgs ? (
        <SmallText>Volume: {name.totalKgs} kg</SmallText>
      ) : (
        <></>
      )}
      {name.totalLbs ? (
        <SmallText>Volume: {name.totalLbs} lb</SmallText>
      ) : (
        <></>
      )}

      {name.totalTime ? (
        <SmallText>Duration: {name.totalTime} sec</SmallText>
      ) : (
        <></>
      )}
      {name.totalKgSec ? (
        <SmallText>Volume: {name.totalKgSec} kg secs</SmallText>
      ) : (
        <></>
      )}
      {name.totalLbSec ? (
        <SmallText>Volume: {name.totalLbSec} lb secs</SmallText>
      ) : (
        <></>
      )}

      {name.totalDistanceM ? (
        <SmallText>Distance: {name.totalDistanceM} m </SmallText>
      ) : (
        <></>
      )}
      {name.totalKgM ? (
        <SmallText>Volume: {name.totalKgM} kg Meters</SmallText>
      ) : (
        <></>
      )}
      {name.totalLbM ? (
        <SmallText>Volume: {name.totalLbM} lb Meters</SmallText>
      ) : (
        <></>
      )}
    </View>
  );
};

const PanelStyle = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH / 3,
    flexDirection: 'column',
  },
});

export const StatsPanel: FunctionComponent<{tags: {}; names: {}}> = ({
  tags,
  names,
}) => {
  const theme = useTheme();

  return (
    <View style={{margin: 4}}>
      <View style={{alignItems: 'flex-start'}}>
        <View style={{borderBottomWidth: 1, borderColor: theme.palette.text}}>
          <RegularText>Tag Summary</RegularText>
        </View>
        <WorkoutStatsByTagHorizontalList data={Object.values(tags)} />
      </View>
      <View style={{alignItems: 'flex-start'}}>
        <View style={{borderBottomWidth: 1, borderColor: theme.palette.text}}>
          <RegularText>Item Summary</RegularText>
        </View>
        <WorkoutStatsByNameHorizontalList data={Object.values(names)} />
      </View>
    </View>
  );
};

const WorkoutDetailScreen: FunctionComponent<Props> = ({
  navigation,
  route: {params},
}) => {
  const theme = useTheme();
  const {
    id,
    workout_items,
    completed_workout_items,
    title,
    desc,
    date,
    scheme_rounds,
    scheme_type,
    editable,
  } = params || {};
  const items = workout_items
    ? workout_items
    : completed_workout_items
    ? completed_workout_items
    : [];
  const [tags, names] = processWorkoutStats(scheme_rounds, scheme_type, items);

  return (
    <ScreenContainer>
      <View style={{width: '100%'}}>
        <View style={{width: '100%', alignItems: 'flex-end'}} />
        <LargeText>{title}</LargeText>
        <RegularText>{desc}</RegularText>
        <SmallText>{date}</SmallText>
        <View style={{marginTop: 8}}>
          <RegularText>
            {WORKOUT_TYPES[scheme_type]} {displayJList(scheme_rounds)}
          </RegularText>
        </View>
        <View style={{height: 150}}>
          <WorkoutItemPreviewHorizontalList
            data={items}
            schemeType={scheme_type}
            itemWidth={200}
          />
        </View>
        <StatsPanel tags={tags} names={names} />
      </View>
    </ScreenContainer>
  );
};

export default WorkoutDetailScreen;
