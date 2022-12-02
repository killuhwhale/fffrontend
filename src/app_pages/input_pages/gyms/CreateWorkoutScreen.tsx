import React, {FunctionComponent, useState} from 'react';
import {
  StyleSheet,
  View,
  Switch,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {createGlobalStyle, useTheme} from 'styled-components';
import styled from 'styled-components/native';
import {Button} from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  SmallText,
  RegularText,
  LargeText,
  TitleText,
} from '../../../app_components/Text/Text';
import {
  Container,
  DURATION_UNITS,
  DISTANCE_UNITS,
  SCREEN_HEIGHT,
  WEIGHT_UNITS,
  WORKOUT_TYPES,
  STANDARD_W,
  ROUNDS_W,
  DURATION_W,
  REPS_W,
  numFilter,
  numFilterWithSpaces,
  parseNumList,
  jList,
  displayJList,
  mdFontSize,
} from '../../../app_components/shared';
import {useAppSelector, useAppDispatch} from '../../../redux/hooks';
import {
  useCreateWorkoutMutation,
  useCreateWorkoutItemsMutation,
} from '../../../redux/api/apiSlice';

import {RootStackParamList} from '../../../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
import {WorkoutItemProps} from '../../../app_components/Cards/types';
import {AnimatedButton} from '../../../app_components/Buttons/buttons';
import {TouchableHighlight} from 'react-native-gesture-handler';
import * as RootNavigation from '../../../navigators/RootNavigation';

import Input from '../../../app_components/Input/input';
import AddItem from './AddWorkoutItemPanel';
export type Props = StackScreenProps<RootStackParamList, 'CreateWorkoutScreen'>;

export const COLORSPALETTE = [
  '#fa4659',
  '#ed93cb',
  '#a3de83',
  '#2eb872',
  '#f469a9',

  '#fd2eb3',
  '#add1fc',
  '#9870fc',
];
const PageContainer = styled(Container)`
  background-color: ${props => props.theme.palette.backgroundColor};
  justify-content: space-between;
  width: 100%;
`;
const numberInputStyle = StyleSheet.create({
  containerStyle: {
    width: '100%',
  },
});
export const pickerStyle = StyleSheet.create({
  containerStyle: {},
  itemStyle: {
    height: SCREEN_HEIGHT * 0.05,
    textAlign: 'center',
    fontSize: 12,
  },
});

interface AddWorkoutItemProps {
  success: boolean;
  errorType: number;
  errorMsg: string;
}

const RepSheme: FunctionComponent<{
  onSchemeRoundChange(scheme: string);
  schemeRounds: string;
  editable?: boolean;
}> = props => {
  const theme = useTheme();

  return (
    <View style={{marginBottom: 15, height: 40}}>
      <Input
        placeholder="Reps"
        editable={props.editable}
        onChangeText={props.onSchemeRoundChange}
        value={props.schemeRounds}
        label="Reps"
        containerStyle={{
          width: '100%',
          backgroundColor: theme.palette.lightGray,
          borderRadius: 8,
          paddingHorizontal: 8,
        }}
        leading={
          <Icon
            name="person"
            color={theme.palette.text}
            style={{fontSize: 16}}
          />
        }
      />
    </View>
  );
};

const RoundSheme: FunctionComponent<{
  onSchemeRoundChange(scheme: string);
  schemeRounds: string;
  isError: boolean;
  editable?: boolean;
}> = props => {
  const theme = useTheme();
  const errorStyles = props.isError
    ? {
        borderBottomWidth: 2,
        borderColor: 'red',
      }
    : {};
  return (
    <View style={{marginBottom: 15, height: 40}}>
      <Input
        placeholder="Rounds"
        onChangeText={props.onSchemeRoundChange}
        value={props.schemeRounds}
        label=""
        helperText="Please enter number of rounds"
        isError={props.isError}
        editable={props.editable}
        containerStyle={{
          width: '100%',
          backgroundColor: theme.palette.lightGray,
          borderRadius: 8,
          paddingHorizontal: 8,
        }}
        leading={
          <Icon
            name="person"
            color={theme.palette.text}
            style={{fontSize: 16}}
          />
        }
      />
    </View>
  );
};

const TimeSheme: FunctionComponent<{
  onSchemeRoundChange(scheme: string);
  schemeRounds: string;
}> = props => {
  const theme = useTheme();
  return (
    <View style={{marginBottom: 15, height: 40}}>
      <Input
        placeholder="Time (mins)"
        onChangeText={props.onSchemeRoundChange}
        value={props.schemeRounds}
        label="Time (mins)"
        helperText="Please enter number of rounds"
        containerStyle={{
          width: '100%',
          backgroundColor: theme.palette.lightGray,
          borderRadius: 8,
          paddingHorizontal: 8,
        }}
        leading={
          <Icon
            name="person"
            color={theme.palette.text}
            style={{fontSize: 16}}
          />
        }
      />
    </View>
  );
};

const ColorPalette: FunctionComponent<{
  onSelect(colorIdx: number);
  selectedIdx: number;
}> = props => {
  const boxSize = 16;
  const theme = useTheme();
  return (
    <View style={{width: '100%', height: boxSize, flexDirection: 'row'}}>
      {Array.from(Array(8).keys()).map(idx => {
        return (
          <View
            key={idx}
            style={{
              width: boxSize,
              height: boxSize,
              backgroundColor: COLORSPALETTE[idx],
              margin: 1,
            }}>
            <TouchableWithoutFeedback
              style={{width: '100%', height: '100%', margin: 1}}
              onPress={() => props.onSelect(idx)}>
              <View
                style={[
                  {
                    width: boxSize,
                    height: boxSize,
                    backgroundColor: COLORSPALETTE[idx],
                  },
                  props.selectedIdx === idx
                    ? {
                        borderWidth: 3,
                        borderColor: theme.palette.text,
                      }
                    : {},
                ]}
              />
            </TouchableWithoutFeedback>
          </View>
        );
      })}
    </View>
  );
};

const ItemString: FunctionComponent<{
  item: WorkoutItemProps;
  schemeType: number;
}> = ({item, schemeType}) => {
  const theme = useTheme();
  // console.log('Item str: ', item, item.reps == '[0]')

  return (
    <View
      style={{width: '100%', borderRadius: 8, marginVertical: 6, padding: 6}}>
      <SmallText>
        {item.sets > 0 && schemeType === 0 ? `${item.sets} x ` : ''}

        {item.reps !== '[0]'
          ? `${displayJList(item.reps)}  `
          : item.distance !== '[0]'
          ? `${displayJList(item.distance)} ${
              DISTANCE_UNITS[item.distance_unit]
            } `
          : item.duration !== '[0]'
          ? `${displayJList(item.duration)} ${
              DURATION_UNITS[item.duration_unit]
            } of `
          : ''}

        {item.name.name}
        {JSON.parse(item.weights).length > 0
          ? ` @ ${displayJList(item.weights)}`
          : ''}
        {JSON.parse(item.weights).length === 0
          ? ''
          : item.weight_unit === '%'
          ? ` percent of ${item.percent_of}`
          : ` ${item.weight_unit}`}
        {item.rest_duration > 0
          ? ` Rest: ${item.rest_duration} ${
              DURATION_UNITS[item.rest_duration_unit]
            }`
          : ''}
      </SmallText>
    </View>
  );
};

const ItemPanel: FunctionComponent<{
  item: WorkoutItemProps;
  schemeType: number;
  itemWidth: number;
  idx?: number;
}> = ({item, schemeType, itemWidth, idx}) => {
  const theme = useTheme();

  const navToWorkoutNameDetail = () => {
    console.log('Navigating with props:', item);
    RootNavigation.navigate('WorkoutNameDetailScreen', item.name);
  };
  const itemReps = item.reps == '' || item.reps == '0' ? '0' : item.reps;
  const itemDistance =
    item.distance == '' || item.distance == '0' ? '0' : item.distance;
  const itemDuration =
    item.duration == '' || item.duration == '0' ? '0' : item.duration;
  return (
    <View
      style={{
        width: itemWidth,
        minWidth: itemWidth,
        height: SCREEN_HEIGHT * 0.15,
        borderRadius: 8,
        marginVertical: 6,
        padding: 6,
        backgroundColor: theme.palette.primary.main,
        marginHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{position: 'absolute', top: 6, left: 6, flex: 1}}>
        <SmallText>{idx}</SmallText>
      </View>
      <View style={{flex: 1}}>
        <SmallText>
          {item.name.name} ({item.id})
        </SmallText>
      </View>
      <View
        style={{
          flex: 4,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableHighlight
          onPress={() => navToWorkoutNameDetail()}
          style={{width: '100%'}}
          underlayColor={theme.palette.transparent}
          activeOpacity={0.9}>
          <View style={{width: '100%'}}>
            <Icon
              name="menu"
              onPress={navToWorkoutNameDetail}
              color={
                schemeType == 0 && item.ssid >= 0
                  ? COLORSPALETTE[item.ssid]
                  : theme.palette.text
              }
              style={{fontSize: 40}}
            />
            {schemeType == 0 && item.ssid >= 0 ? (
              <SmallText
                textStyles={{
                  color: COLORSPALETTE[item.ssid],
                  textAlign: 'center',
                }}>
                SS
              </SmallText>
            ) : (
              <></>
            )}
          </View>
        </TouchableHighlight>
      </View>
      <View
        style={{
          alignSelf: 'center',
          flex: 2,
          width: '100%',
          justifyContent: 'center',
        }}>
        <SmallText textStyles={{textAlign: 'center'}}>
          {item.sets > 0 && schemeType === 0 ? `${item.sets} x ` : ''}

          {item.reps !== '[0]'
            ? `${displayJList(item.reps)}  `
            : item.distance !== '[0]'
            ? `${displayJList(item.distance)} ${
                DISTANCE_UNITS[item.distance_unit]
              } `
            : item.duration !== '[0]'
            ? `${displayJList(item.duration)} ${
                DURATION_UNITS[item.duration_unit]
              }`
            : ''}
        </SmallText>
      </View>
      <View style={{alignItems: 'center', flex: 2, width: '100%'}}>
        {item.weights.length > 0 ? (
          <SmallText>
            {`@ ${displayJList(item.weights)} ${
              item.weight_unit === '%' ? '' : item.weight_unit
            }`}
          </SmallText>
        ) : (
          <></>
        )}
        {item.weights.length === 0 ? (
          <></>
        ) : item.weight_unit === '%' ? (
          <SmallText>{`Percent of ${item.percent_of}`}</SmallText>
        ) : (
          <></>
        )}
        <SmallText textStyles={{alignSelf: 'center'}}>
          {item.rest_duration > 0
            ? `Rest: ${item.rest_duration} ${
                DURATION_UNITS[item.rest_duration_unit]
              }`
            : ''}
        </SmallText>
      </View>
    </View>
  );
};

const verifyWorkoutItem = (
  _item: WorkoutItemProps,
  schemeType: number,
  schemeRounds: string,
): {success: boolean; errorType: number; errorMsg: string} => {
  // For standard workouts: weights must match sets per item...
  // Reps are single and weights are multiple
  if (WORKOUT_TYPES[schemeType] == STANDARD_W) {
    // check weights match sets 0 || 1 -> 1 or ==
    const itemSets = _item.sets;
    const weightList = parseNumList(_item.weights);
    console.log('Verifyin Standard_w', weightList, itemSets, weightList.length);

    if (itemSets != weightList.length && weightList.length != 1) {
      console.log('Not VALID!');
      return {
        success: false,
        errorType: 3,
        errorMsg: 'Weights must match sets',
      };
    }
  }

  // For reps based workout,  weights must match repScheme, repscheme must be entered.
  // Reps are single and weights are multiple
  else if (WORKOUT_TYPES[schemeType] == REPS_W) {
    const weightList = parseNumList(_item.weights);
    console.log('Edit item verify: ', weightList);
    if (parseNumList(schemeRounds).length < 1) {
      return {
        success: false,
        errorType: 0,
        errorMsg: 'Please add number of reps per round',
      };
    }

    if (
      weightList.length > 1 &&
      weightList.length !== parseNumList(schemeRounds).length
    ) {
      return {
        success: false,
        errorType: 2,
        errorMsg: 'Weights must match repscheme',
      };
    }
  }

  // For rounds based workout, reps and weights must match repScheme
  // Reps and weights are multiple nums
  else if (WORKOUT_TYPES[schemeType] == ROUNDS_W) {
    // If scheme rounds have not been entered....
    console.log('Current shcemeRounds ', schemeRounds);
    if (schemeRounds.length == 0) {
      return {
        success: false,
        errorType: 0,
        errorMsg: 'Please add number of rounds',
      };
    }

    // IF item does not match number of rounds
    // Ensure reps is 1 number of matches the number of roungs
    // Eg 5 Rounds => Reps [1] or [5,5,3,3,1] (different sets for each round)

    console.log('Bad item reps? ', _item.reps);
    const itemRepsList = parseNumList(_item.reps);
    const itemWeightsList = parseNumList(_item.weights);

    if (
      itemRepsList.length > 1 &&
      itemRepsList.length !== parseInt(schemeRounds)
    ) {
      console.log('Dont add item!', itemRepsList, schemeRounds);
      return {success: false, errorType: 1, errorMsg: 'Match rounds'};
    }
    if (
      itemWeightsList.length > 1 &&
      itemWeightsList.length !== parseInt(schemeRounds)
    ) {
      console.log('Dont add item!', itemWeightsList, schemeRounds);
      return {success: false, errorType: 1, errorMsg: 'Match rounds'};
    }
  }
  // For Time Based workouts, reps and weights should just be single, no check required.
  // Reps and weights are single
  return {success: true, errorType: -1, errorMsg: ''};
};

const CreateWorkoutScreen: FunctionComponent<Props> = ({
  navigation,
  route: {
    params: {workoutGroupID, workoutGroupTitle, schemeType},
  },
}) => {
  const theme = useTheme();

  // Access/ send actions
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [schemeRounds, setSchemeRounds] = useState('');
  const [items, setItems] = useState([] as WorkoutItemProps[]);
  const [showAddSSID, setShowAddSSID] = useState(false);
  const [curColor, setCurColor] = useState(-1);
  const [createWorkout, {isLoading: workoutIsLoading}] =
    useCreateWorkoutMutation();
  const [createWorkoutItem, {isLoading: workoutItemIsLoading}] =
    useCreateWorkoutItemsMutation();

  const [schemeRoundsError, setSchemeRoundsError] = useState(false);

  const _createWorkoutWithItems = async () => {
    // Need to get file from the URI
    const workoutData = new FormData();
    const data = new FormData();
    workoutData.append('group', workoutGroupID);
    workoutData.append('title', title);
    workoutData.append('desc', desc);
    workoutData.append('scheme_type', schemeType);
    workoutData.append('scheme_rounds', schemeRounds);

    console.log(
      'Creatting workout with Group ID and Data: ',
      workoutGroupID,
      workoutData,
    );

    try {
      const createdWorkout = await createWorkout(workoutData).unwrap();
      console.log('Workout res', createdWorkout);

      items.forEach((item, idx) => {
        item.order = idx;
        item.workout = createdWorkout.id;
      });
      data.append('items', JSON.stringify(items));
      data.append('workout', createdWorkout.id);
      data.append('workout_group', workoutGroupID);
      const createdItems = await createWorkoutItem(data).unwrap();
      console.log('Workout item res', createdItems);

      // TODO handle errors
      if (createdItems) {
        navigation.goBack();
      }
    } catch (err) {
      console.log('Error creating gym', err);
    }
    // TODO possibly dispatch to refresh data
  };

  const removeItem = idx => {
    const _items = [...items];
    _items.splice(idx, 1);
    setItems(_items);
  };

  const addWorkoutItem = (item: WorkoutItemProps): AddWorkoutItemProps => {
    const _item = {...item};

    const {success, errorType, errorMsg} = verifyWorkoutItem(
      _item,
      schemeType,
      schemeRounds,
    );

    if (!success) {
      if (errorType === 0) {
        setSchemeRoundsError(true);
      }
      return {success, errorType, errorMsg};
    }
    if (schemeRoundsError) {
      setSchemeRoundsError(false);
    }

    _item.weights = jList(_item.weights);
    _item.reps = jList(_item.reps);
    _item.duration = jList(_item.duration);
    _item.distance = jList(_item.distance);

    console.log('Adding item: ', _item);
    setItems([...items, _item]);
    return {success: true, errorType: -1, errorMsg: ''};
  };

  const removeItemSSID = idx => {
    console.log('Removing idx: ', idx);
    const newItems = [...items];
    const newItem = newItems[idx];
    newItem.ssid = -1;
    newItems[idx] = newItem;
    setItems(newItems);
  };

  const addItemToSSID = idx => {
    const newItems = [...items];

    const newItem = newItems[idx];
    if (newItem.ssid == -1) {
      newItem.ssid = curColor;
      console.log(newItem.ssid);
      newItems[idx] = newItem;
      setItems(newItems);
    }
  };

  return (
    <PageContainer>
      <View style={{margin: 5}}>
        <RegularText>
          {workoutGroupTitle} ({workoutGroupID})
        </RegularText>
      </View>

      <View style={{height: '100%', width: '100%'}}>
        <View style={{marginBottom: 15, height: 40}}>
          <Input
            onChangeText={t => setTitle(t)}
            value={title}
            label=""
            placeholder="Title"
            fontSize={mdFontSize}
            containerStyle={{
              width: '100%',
              backgroundColor: theme.palette.lightGray,
              borderRadius: 8,
              paddingHorizontal: 8,
            }}
            leading={
              <Icon
                name="person"
                color={theme.palette.text}
                style={{fontSize: mdFontSize}}
              />
            }
          />
        </View>

        <View style={{marginBottom: 15, height: 40}}>
          <Input
            label=""
            placeholder="Description"
            value={desc}
            fontSize={mdFontSize}
            onChangeText={d => setDesc(d)}
            containerStyle={{
              width: '100%',
              backgroundColor: theme.palette.lightGray,
              borderRadius: 8,
              paddingHorizontal: 8,
            }}
            leading={
              <Icon
                name="person"
                color={theme.palette.text}
                style={{fontSize: mdFontSize}}
              />
            }
          />
        </View>
        <View>
          {WORKOUT_TYPES[schemeType] == STANDARD_W ? (
            <></>
          ) : WORKOUT_TYPES[schemeType] == REPS_W ? (
            <>
              <SmallText>Rep Scheme</SmallText>
              <RepSheme
                onSchemeRoundChange={t =>
                  setSchemeRounds(numFilterWithSpaces(t))
                }
                schemeRounds={schemeRounds}
              />
            </>
          ) : WORKOUT_TYPES[schemeType] == ROUNDS_W ? (
            <>
              <SmallText>Number of Rounds</SmallText>
              <RoundSheme
                onSchemeRoundChange={t => {
                  // Reset
                  if (schemeRoundsError) {
                    setSchemeRoundsError(false);
                  }
                  setSchemeRounds(numFilter(t));
                }}
                editable={items.length === 0}
                isError={schemeRoundsError}
                schemeRounds={schemeRounds}
              />
            </>
          ) : WORKOUT_TYPES[schemeType] == DURATION_W ? (
            <>
              <SmallText>Duration of workout</SmallText>
              <TimeSheme
                onSchemeRoundChange={t => setSchemeRounds(numFilter(t))}
                schemeRounds={schemeRounds}
              />
            </>
          ) : (
            <></>
          )}
        </View>
        <AddItem onAddItem={addWorkoutItem} schemeType={schemeType} />

        <View style={{flex: schemeType == 0 ? 2 : 1}}>
          {schemeType == 0 ? (
            <View>
              <SmallText textStyles={{color: theme.palette.text}}>
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
                  false: theme.palette.lightGray,
                }}
                thumbColor={
                  showAddSSID ? theme.palette.primary.main : theme.palette.gray
                }
              />
            </View>
          ) : (
            <></>
          )}

          {showAddSSID ? (
            <View>
              <ColorPalette onSelect={setCurColor} selectedIdx={curColor} />
              <ScrollView>
                {items.map((item, idx) => {
                  return (
                    <View
                      key={`item_test_${Math.random()}`}
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
                        <TouchableWithoutFeedback
                          onPress={() => {
                            item.ssid >= 0
                              ? removeItemSSID(idx)
                              : curColor > -1
                              ? addItemToSSID(idx)
                              : console.log('Select a color first!');
                          }}>
                          <Icon
                            name="person"
                            color={
                              item.ssid >= 0
                                ? COLORSPALETTE[item.ssid]
                                : theme.palette.text
                            }
                          />
                        </TouchableWithoutFeedback>
                      </View>
                    </View>
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
        <View style={{flex: 1}}>
          <Button
            onPress={_createWorkoutWithItems.bind(this)}
            title="Create"
            style={{backgroundColor: theme.palette.lightGray}}
          />
        </View>
      </View>
    </PageContainer>
  );
};

export default CreateWorkoutScreen;
export {ItemString, ItemPanel, numberInputStyle, verifyWorkoutItem};
