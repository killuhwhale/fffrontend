import React, {FunctionComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'styled-components';
import {
  WorkoutStatsByNameHorizontalList,
  WorkoutStatsByTagHorizontalList,
} from '../Cards/cardList';
import {SCREEN_WIDTH} from '../shared';
import {TSParagrapghText, TSCaptionText} from '../Text/Text';

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
      <TSParagrapghText>{tag.key}</TSParagrapghText>
      {tag.totalReps ? (
        <TSCaptionText>Reps: {tag.totalReps}</TSCaptionText>
      ) : (
        <></>
      )}
      {tag.totalKgs ? (
        <TSCaptionText>Volume: {tag.totalKgs} kg</TSCaptionText>
      ) : (
        <></>
      )}
      {tag.totalLbs ? (
        <TSCaptionText>Volume: {tag.totalLbs} lb</TSCaptionText>
      ) : (
        <></>
      )}

      {tag.totalTime ? (
        <TSCaptionText>Duration: {tag.totalTime} sec</TSCaptionText>
      ) : (
        <></>
      )}
      {tag.totalKgSec ? (
        <TSCaptionText>Volume: {tag.totalKgSec} kg secs</TSCaptionText>
      ) : (
        <></>
      )}
      {tag.totalLbSec ? (
        <TSCaptionText>Volume: {tag.totalLbSec} lb secs</TSCaptionText>
      ) : (
        <></>
      )}

      {tag.totalDistanceM ? (
        <TSCaptionText>Distance: {tag.totalDistanceM} m </TSCaptionText>
      ) : (
        <></>
      )}
      {tag.totalKgM ? (
        <TSCaptionText>Volume: {tag.totalKgM} kg Meters</TSCaptionText>
      ) : (
        <></>
      )}
      {tag.totalLbM ? (
        <TSCaptionText>Volume: {tag.totalLbM} lb Meters</TSCaptionText>
      ) : (
        <></>
      )}
    </View>
  );
};

export const NamePanelItem: FunctionComponent<{name: WorkoutStats}> = ({
  name,
}) => {
  // console.log("Name props", name)
  return (
    <View style={PanelStyle.container}>
      <TSParagrapghText>{name.key}</TSParagrapghText>
      {name.totalReps ? (
        <TSCaptionText>Reps: {name.totalReps}</TSCaptionText>
      ) : (
        <></>
      )}
      {name.totalKgs ? (
        <TSCaptionText>Volume: {name.totalKgs} kg</TSCaptionText>
      ) : (
        <></>
      )}
      {name.totalLbs ? (
        <TSCaptionText>Volume: {name.totalLbs} lb</TSCaptionText>
      ) : (
        <></>
      )}

      {name.totalTime ? (
        <TSCaptionText>Duration: {name.totalTime} sec</TSCaptionText>
      ) : (
        <></>
      )}
      {name.totalKgSec ? (
        <TSCaptionText>Volume: {name.totalKgSec} kg secs</TSCaptionText>
      ) : (
        <></>
      )}
      {name.totalLbSec ? (
        <TSCaptionText>Volume: {name.totalLbSec} lb secs</TSCaptionText>
      ) : (
        <></>
      )}

      {name.totalDistanceM ? (
        <TSCaptionText>Distance: {name.totalDistanceM} m </TSCaptionText>
      ) : (
        <></>
      )}
      {name.totalKgM ? (
        <TSCaptionText>Volume: {name.totalKgM} kg Meters</TSCaptionText>
      ) : (
        <></>
      )}
      {name.totalLbM ? (
        <TSCaptionText>Volume: {name.totalLbM} lb Meters</TSCaptionText>
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

  const sTags = Object.keys(tags)
    .sort((a, b) => (a < b ? -1 : 1))
    .map(key => tags[key]);
  const sNames = Object.keys(names)
    .sort((a, b) => (a < b ? -1 : 1))
    .map(key => names[key]);
  return (
    <View style={{margin: 4, flex: 1}}>
      {Object.values(tags).length > 0 ? (
        <>
          <View
            style={{
              borderTopWidth: 1,
              height: 1,
              borderColor: theme.palette.text,
            }}
          />
          <View style={{alignItems: 'flex-start'}}>
            <View
              style={{borderBottomWidth: 1, borderColor: theme.palette.text}}>
              <TSParagrapghText>Tag Summary</TSParagrapghText>
            </View>
            <WorkoutStatsByTagHorizontalList data={Object.values(sTags)} />
          </View>
          <View style={{alignItems: 'flex-start'}}>
            <View
              style={{borderBottomWidth: 1, borderColor: theme.palette.text}}>
              <TSParagrapghText>Item Summary</TSParagrapghText>
            </View>
            <WorkoutStatsByNameHorizontalList data={Object.values(sNames)} />
          </View>
          <View
            style={{
              borderTopWidth: 1,
              height: 1,
              borderColor: theme.palette.text,
            }}
          />
        </>
      ) : (
        <></>
      )}
    </View>
  );
};
