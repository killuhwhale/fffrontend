import React, {FunctionComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'styled-components';
import {
  WorkoutStatsByNameHorizontalList,
  WorkoutStatsByTagHorizontalList,
} from '../Cards/cardList';
import {SCREEN_WIDTH} from '../shared';
import {RegularText, SmallText} from '../Text/Text';

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
  console.log('Stats Panel: ', tags);
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
              <RegularText>Tag Summary</RegularText>
            </View>
            <WorkoutStatsByTagHorizontalList data={Object.values(sTags)} />
          </View>
          <View style={{alignItems: 'flex-start'}}>
            <View
              style={{borderBottomWidth: 1, borderColor: theme.palette.text}}>
              <RegularText>Item Summary</RegularText>
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
