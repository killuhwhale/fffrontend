import React, {FunctionComponent, useState} from 'react';

import {
  StyleSheet,
  View,
  Switch,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';

import {useTheme} from 'styled-components';
import styled from 'styled-components/native';

import Icon from 'react-native-vector-icons/Ionicons';
import {SmallText, RegularText} from '../../../../app_components/Text/Text';
import {
  Container,
  SCREEN_HEIGHT,
  WORKOUT_TYPES,
  STANDARD_W,
  ROUNDS_W,
  DURATION_W,
  REPS_W,
  numFilter,
  numFilterWithSpaces,
  parseNumList,
  jList,
  mdFontSize,
  TIMESCORE_W,
  TIMELIMIT_W,
} from '../../../../app_components/shared';
import {COLORSPALETTE, ColorPalette} from '../CreateWorkoutScreen';
import {WorkoutItemProps} from '../../../../app_components/Cards/types';
import ItemString from '../../../../app_components/WorkoutItems/ItemString';
import {AnimatedButton} from '../../../../app_components/Buttons/buttons';

const CreateWorkoutItemList: FunctionComponent<{
  items: WorkoutItemProps[];
  schemeType: number;
  curColor: number;
  showAddSSID: boolean;
  setShowAddSSID(n: boolean): void;
  setCurColor(n: number): void;
  removeItemSSID(n: number): void;
  addItemToSSID(n: number): void;
  updateItemConstant(n: number): void;
  removeItem(n: number): void;
}> = ({
  items,
  schemeType,
  curColor,
  showAddSSID,
  setShowAddSSID,
  setCurColor,
  removeItemSSID,
  addItemToSSID,
  updateItemConstant,
  removeItem,
}) => {
  const theme = useTheme();
  const [allowMarkConstant, setAllowMarkConstant] = useState(false);
  return (
    <View style={{flex: 4}}>
      {schemeType == 0 ? (
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 2,
              alignItems: 'flex-start',
              alignContent: 'flex-start',
              justifyContent: 'flex-start',
            }}>
            <SmallText
              textStyles={{color: theme.palette.text, textAlign: 'left'}}>
              Add Superset
            </SmallText>
            <Switch
              value={showAddSSID}
              onValueChange={v => {
                setShowAddSSID(v);
                if (!v) {
                  setCurColor(-1);
                }
              }}
              trackColor={{
                true: theme.palette.primary.contrastText,
                false: theme.palette.darkGray,
              }}
              thumbColor={
                showAddSSID ? theme.palette.primary.main : theme.palette.gray
              }
            />
          </View>
          <View style={{flex: 5}}>
            {showAddSSID ? (
              <ColorPalette onSelect={setCurColor} selectedIdx={curColor} />
            ) : (
              <></>
            )}
          </View>
        </View>
      ) : schemeType === 1 ? (
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'baseline',
          }}>
          <SmallText
            textStyles={{color: theme.palette.text, textAlign: 'left'}}>
            Mark item as constant (ignore rep scheme)
          </SmallText>
          <Switch
            value={allowMarkConstant}
            onValueChange={v => {
              console.log('Allow mark constant', v);
              setAllowMarkConstant(v);
            }}
            trackColor={{
              true: theme.palette.primary.contrastText,
              false: theme.palette.darkGray,
            }}
            thumbColor={
              showAddSSID ? theme.palette.primary.main : theme.palette.gray
            }
          />
        </View>
      ) : (
        <></>
      )}

      {/** Item List */}
      {showAddSSID || allowMarkConstant ? (
        <View>
          <ScrollView>
            {items.map((item, idx) => {
              return (
                <TouchableWithoutFeedback
                  key={`item_test_${Math.random()}`}
                  style={{}}
                  onPress={() => {
                    if (WORKOUT_TYPES[schemeType] == STANDARD_W) {
                      item.ssid >= 0
                        ? removeItemSSID(idx)
                        : curColor > -1
                        ? addItemToSSID(idx)
                        : console.log('Select a color first!');
                    } else if (WORKOUT_TYPES[schemeType] == REPS_W) {
                      updateItemConstant(idx);
                    }
                  }}>
                  <View
                    style={{
                      height: SCREEN_HEIGHT * 0.05,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                    <View style={{flex: 10}}>
                      <ItemString item={item} schemeType={schemeType} />
                    </View>
                    <View style={{flex: 1}}>
                      {WORKOUT_TYPES[schemeType] == STANDARD_W ? (
                        <Icon
                          name="person"
                          color={
                            item.ssid >= 0
                              ? COLORSPALETTE[item.ssid]
                              : theme.palette.text
                          }
                        />
                      ) : (
                        <Icon
                          name="person"
                          color={
                            item.constant
                              ? COLORSPALETTE[0]
                              : theme.palette.text
                          }
                        />
                      )}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </ScrollView>
        </View>
      ) : (
        <ScrollView>
          {items.map((item, idx) => {
            return (
              <AnimatedButton
                title={item.name.name}
                style={{width: '100%'}}
                onFinish={() => removeItem(idx)}
                key={`itemz_${idx}_${Math.random()}`}>
                <View
                  style={{
                    height: SCREEN_HEIGHT * 0.05,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flex: 10}}>
                    <ItemString item={item} schemeType={schemeType} />
                  </View>
                  <View style={{flex: 1}}>
                    <Icon
                      name="person"
                      color={
                        WORKOUT_TYPES[schemeType] == REPS_W && item.constant
                          ? COLORSPALETTE[0]
                          : WORKOUT_TYPES[schemeType] == STANDARD_W &&
                            item.ssid >= 0
                          ? COLORSPALETTE[item.ssid]
                          : theme.palette.text
                      }
                    />
                  </View>
                </View>
              </AnimatedButton>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default CreateWorkoutItemList;
