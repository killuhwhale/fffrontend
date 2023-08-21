import React, {FunctionComponent} from 'react';
import styled from 'styled-components/native';
import {
  CalcWorkoutStats,
  Container,
  displayJList,
  formatLongDate,
  SCREEN_HEIGHT,
  WORKOUT_TYPES,
} from '../app_components/shared';
import {
  TSCaptionText,
  TSParagrapghText,
  LargeText,
  TSTitleText,
} from '../app_components/Text/Text';
import {useTheme} from 'styled-components';
import {WorkoutItemPreviewHorizontalList} from '../app_components/Cards/cardList';

import {RootStackParamList} from '../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
import {View} from 'react-native';
import {StatsPanel} from '../app_components/Stats/StatsPanel';
import BannerAddMembership from '../app_components/ads/BannerAd';

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
    instruction,
    editable,
    for_date,
    ownedByClass,
  } = params || {};
  const items = workout_items
    ? workout_items
    : completed_workout_items
    ? completed_workout_items
    : [];

  const stats = new CalcWorkoutStats();
  stats.setWorkoutParams(scheme_rounds, scheme_type, items);
  stats.calc();

  const [tags, names] = stats.getStats();
  // const tags = stats.tags;
  // const names = stats.names;

  return (
    <ScreenContainer>
      <BannerAddMembership />
      <View style={{width: '100%', flex: 1}}>
        <View style={{flex: 1}}>
          <TSTitleText>
            {title.length < 1 ? 'Title here...' : title}
          </TSTitleText>

          <TSCaptionText textStyles={{padding: 6}}>
            {desc.length < 1 ? 'Description here...' : desc}
          </TSCaptionText>
          {instruction ? (
            <TSParagrapghText textStyles={{padding: 6}}>
              {instruction}
            </TSParagrapghText>
          ) : (
            <></>
          )}
          <TSCaptionText textStyles={{padding: 6}}>
            {for_date
              ? formatLongDate(new Date(for_date))
              : 'Unsure which date this is for...'}
          </TSCaptionText>
        </View>

        <View style={{flex: 3}}>
          <StatsPanel tags={tags} names={names} />
        </View>

        <View style={{flex: 3, justifyContent: 'center'}}>
          <View style={{marginTop: 8, padding: 6}}>
            <TSParagrapghText>
              {WORKOUT_TYPES[scheme_type]} {displayJList(scheme_rounds)}
            </TSParagrapghText>
          </View>

          <WorkoutItemPreviewHorizontalList
            testID={''}
            data={items}
            schemeType={scheme_type}
            itemWidth={200}
            ownedByClass={ownedByClass}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

export default WorkoutDetailScreen;
