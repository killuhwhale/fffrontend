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
import {SmallText, RegularText} from '../../../app_components/Text/Text';
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
} from '../../../app_components/shared';
import {useAppDispatch} from '../../../redux/hooks';
import {
  useCreateWorkoutMutation,
  useCreateWorkoutItemsMutation,
} from '../../../redux/api/apiSlice';

import {RootStackParamList} from '../../../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
import {WorkoutItemProps} from '../../../app_components/Cards/types';
import {
  AnimatedButton,
  RegularButton,
} from '../../../app_components/Buttons/buttons';

import Input from '../../../app_components/Input/input';

import ItemString from '../../../app_components/WorkoutItems/ItemString';
import {TestIDs} from '../../../utils/constants';
import AddItem from './AddWorkoutItemPanel';
import AlertModal from '../../../app_components/modals/AlertModal';
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
  containerStyle: {color: 'white'},
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
    <View style={{marginBottom: 15, height: 35}}>
      <Input
        placeholder="Reps"
        editable={props.editable}
        onChangeText={props.onSchemeRoundChange}
        value={props.schemeRounds}
        label="Reps"
        containerStyle={{
          width: '100%',
          backgroundColor: theme.palette.darkGray,
          borderRadius: 8,
          paddingHorizontal: 8,
        }}
        fontSize={mdFontSize}
        leading={
          <Icon
            name="person"
            color={theme.palette.text}
            style={{fontSize: mdFontSize}}
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
    <View style={{marginBottom: 15, height: 35}}>
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
          backgroundColor: theme.palette.darkGray,
          borderRadius: 8,
          paddingHorizontal: 8,
        }}
        fontSize={mdFontSize}
        leading={
          <Icon
            name="person"
            color={theme.palette.text}
            style={{fontSize: mdFontSize}}
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
    <View style={{marginBottom: 15, height: 35}}>
      <Input
        placeholder="Time (mins)"
        onChangeText={props.onSchemeRoundChange}
        value={props.schemeRounds}
        label="Time (mins)"
        helperText="Please enter number of rounds"
        containerStyle={{
          width: '100%',
          backgroundColor: theme.palette.darkGray,
          borderRadius: 8,
          paddingHorizontal: 8,
        }}
        fontSize={mdFontSize}
        leading={
          <Icon
            name="person"
            color={theme.palette.text}
            style={{fontSize: mdFontSize}}
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
  const [isCreating, setIsCreating] = useState(false);

  const [createWorkoutError, setCreateWorkoutError] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const _createWorkoutWithItems = async () => {
    // Need to get file from the URI
    if (items.length == 0 || items.length > 15) return setShowAlert(true);
    setIsCreating(true);

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

      // TODO() Catch this error better, shoudl return a specific error num for  unique constraint errors.
      // eslint-disable-next-line dot-notation
      if (createdWorkout['err_type'] >= 0) {
        console.log('Failed to create workout', createdWorkout.error);
        setCreateWorkoutError('Workout with this name already exists.');
        return;
      }

      items.forEach((item, idx) => {
        console.log('Creating item: ', item);
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
      console.log('Error creating workout', err);
    }
    setIsCreating(false);
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

    console.log('~~~~Adding item: ', _item);
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

  const [allowMarkConstant, setAllowMarkConstant] = useState(false);

  const updateItemConstant = (idx: number) => {
    // Determines if an item should ignore a RepScheme.
    // "Do a constant number of reps each round."
    if (idx < 0 || idx >= items.length) {
      return;
    }

    const item = {...items[idx]};
    item.constant = !item.constant;
    const newItems = [...items];
    newItems[idx] = item;
    setItems(newItems);
    console.log('Toggled item as constant', item);
  };

  return (
    <PageContainer>
      <View>
        <SmallText>Create Workout</SmallText>
      </View>
      <View>
        <RegularText>{workoutGroupTitle}</RegularText>
      </View>

      <View
        style={{
          height: '100%',
          width: '100%',
          flex: 1,
          justifyContent: 'space-between',
        }}>
        {createWorkoutError.length ? (
          <SmallText>{createWorkoutError}</SmallText>
        ) : (
          <></>
        )}

        <View style={{flex: 2, marginBottom: 15}}>
          <View style={{height: 35, marginBottom: 8}}>
            <Input
              onChangeText={t => {
                setTitle(t);
                setCreateWorkoutError('');
                setIsCreating(false);
              }}
              value={title}
              label=""
              testID={TestIDs.CreateWorkoutTitleField.name()}
              placeholder="Title"
              fontSize={mdFontSize}
              inputStyles={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              containerStyle={{
                width: '100%',
                backgroundColor: theme.palette.darkGray,
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

          <View style={{height: 35}}>
            <Input
              label=""
              placeholder="Description"
              testID={TestIDs.CreateWorkoutDescField.name()}
              value={desc}
              fontSize={mdFontSize}
              onChangeText={d => setDesc(d)}
              containerStyle={{
                width: '100%',
                backgroundColor: theme.palette.darkGray,
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
        </View>
        <View style={{flex: 1}}>
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
        <View style={{flex: 10}}>
          <AddItem onAddItem={addWorkoutItem} schemeType={schemeType} />
        </View>

        <View style={{flex: 11}}>
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
                    showAddSSID
                      ? theme.palette.primary.main
                      : theme.palette.gray
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
        <View style={{flex: 2}}>
          {!isCreating ? (
            <RegularButton
              onPress={_createWorkoutWithItems.bind(this)}
              testID={TestIDs.CreateWorkoutCreateBtn.name()}
              btnStyles={{backgroundColor: theme.palette.darkGray}}
              text="Create"
            />
          ) : (
            <ActivityIndicator size="small" color={theme.palette.text} />
          )}
        </View>
      </View>

      <AlertModal
        closeText="Close"
        bodyText={
          items.length == 0
            ? 'Workout must contain workout items.'
            : 'This account can only create 15 workout items per workout max.'
        }
        modalVisible={showAlert}
        onRequestClose={() => setShowAlert(false)}
      />
    </PageContainer>
  );
};

export default CreateWorkoutScreen;
export {numberInputStyle, verifyWorkoutItem};
