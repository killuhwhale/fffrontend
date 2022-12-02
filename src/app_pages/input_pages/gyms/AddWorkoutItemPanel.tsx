import React, {FunctionComponent, useState, useRef} from 'react';
import {View} from 'react-native';
import {createGlobalStyle, useTheme} from 'styled-components';
import styled from 'styled-components/native';
import {Button} from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';

import {
  SmallText,
  RegularText,
  LargeText,
  TitleText,
} from '../../../app_components/Text/Text';
import {
  Container,
  SCREEN_WIDTH,
  DURATION_UNITS,
  DISTANCE_UNITS,
  SCREEN_HEIGHT,
  WEIGHT_UNITS,
  WORKOUT_TYPES,
  STANDARD_W,
  ROUNDS_W,
  DURATION_W,
  REPS_W,
  nanOrNah,
  numFilter,
  numFilterWithSpaces,
} from '../../../app_components/shared';
import {useGetWorkoutNamesQuery} from '../../../redux/api/apiSlice';

import {
  WorkoutItemProps,
  WorkoutNameProps,
} from '../../../app_components/Cards/types';
import {numberInputStyle, pickerStyle} from './CreateWorkoutScreen';
import Input from '../../../app_components/Input/input';

interface AddWorkoutItemProps {
  success: boolean;
  errorType: number;
  errorMsg: string;
}

const AddItem: FunctionComponent<{
  onAddItem(item: WorkoutItemProps): AddWorkoutItemProps;
  schemeType: number;
}> = props => {
  const inputFontSize = 14;
  // Needs duration and SSID feature.

  const initWorkoutName = 0;
  const initWeight = '';
  const initWeightUnit = 'kg';
  const initPercentOfWeightUnit = '';
  const initSets = '0';
  const initReps = '0';
  const initDistance = '0';
  const initDistanceUnit = 0;

  const initDuration = '0';
  const initDurationUnit = 0;

  const initRestDuration = '0';
  const initRestDurationUnit = 0;

  const theme = useTheme();
  const {data, isLoading, isSuccess, isError, error} =
    useGetWorkoutNamesQuery('');

  const pickerRef = useRef<any>();
  const weightUnitPickRef = useRef<any>();
  const durationUnitPickRef = useRef<any>();
  const distanceUnitPickRef = useRef<any>();
  const restDurationUnitPickRef = useRef<any>();
  const showRepsOrDurationInputRef = useRef<any>();

  const [workoutName, setWorkoutName] = useState(initWorkoutName);

  const [weight, setWeight] = useState(initWeight); // Json string list of numbers.
  const [weightUnit, setWeightUnit] = useState(initWeightUnit); // Json string list of numbers.
  const [weightError, setWeightError] = useState('');

  const [percentOfWeightUnit, setPercentOfWeightUnit] = useState(
    initPercentOfWeightUnit,
  ); // Json string list of numbers.

  const [sets, setSets] = useState(initSets); // Need this for Standard workouts.
  // With schemeType Rounds, allow user to enter space delimited list of numbers that must match number of rounds...
  const [reps, setReps] = useState(initReps);
  const [distance, setDistance] = useState(initDistance);
  const [distanceUnit, setDistanceUnit] = useState(initDistanceUnit);

  const [duration, setDuration] = useState(initDuration);
  const [durationUnit, setDurationUnit] = useState(initDurationUnit);

  // Rest should be an item. I can implement something to ensure rest is entered when the WorkoutItem is Rest...
  const [restDuration, setRestDuration] = useState(initRestDuration);
  const [restDurationUnit, setRestDurationUnit] =
    useState(initRestDurationUnit);
  const [showQuantity, setShowQuantity] = useState(0);
  const QuantityLabels = ['Reps', 'Duration', 'Distance'];

  const [repsSchemeRoundsError, setRepsSchemeRoundsError] = useState(false);
  const [repSchemeRoundsErrorText, setRepsSchemeRoundsErrorText] = useState('');

  // This NumberInput should vary depedning on the Scheme Type
  // For standard, this will be a single number,
  // For the other types, it should be a single number or match the length of scheme_rounds list
  // Example SchemeType Reps: 21,15,9
  // item Squat weights 200lbs, 100lbs, 50lbs,  ==> this means we do 200 lbs on the first round, 100 on the seocnd, etc...

  const defaultItem = {
    sets: nanOrNah(initSets),
    reps: initReps,
    distance: initDistance,
    distance_unit: initDistanceUnit,
    ssid: -1,
    duration: initDuration,
    name: data ? data[initWorkoutName] : ({} as WorkoutNameProps),
    duration_unit: initDurationUnit,
    date: '',

    rest_duration: nanOrNah(initRestDuration),
    rest_duration_unit: initRestDurationUnit,
    weights: initWeight,
    weight_unit: initWeightUnit,
    percent_of: initPercentOfWeightUnit,
    workout: 0,
    id: 0,
  } as WorkoutItemProps;

  const [item, setItem] = useState(defaultItem);

  const resetDefaultItem = () => {
    console.log('Resetting item');

    resetItem();
    setWeight(initWeight);
    setDistance(initDistance);

    setPercentOfWeightUnit(initPercentOfWeightUnit);
    setSets(initSets);
    setReps(initReps);

    setDuration(initDuration);

    setRestDuration(initRestDuration);
    setRestDurationUnit(initRestDurationUnit);
  };
  const resetItem = () => {
    // Reset item to default item values when user adds an item except
    //   we need to preserve the units the user has changed.
    setItem({
      ...defaultItem,
      name: data[workoutName],
      distance_unit: distanceUnit,
      duration_unit: durationUnit,
      rest_duration_unit: restDurationUnit,
      weight_unit: weightUnit,
    });
  };
  const updateItem = (key, val) => {
    const newItem = item;
    newItem[key] = val;
    setItem(newItem);
  };
  const _addItem = () => {
    if (!item.name.name) {
      item.name = data[workoutName];
    }

    if (WORKOUT_TYPES[props.schemeType] == STANDARD_W) {
      if (item.sets === 0) {
        item.sets = 1; // ensure there is at least 1 set.
      }

      if (QuantityLabels[showQuantity] == 'Reps' && parseInt(item.reps) === 0) {
        item.reps = '1';
      } else if (
        QuantityLabels[showQuantity] == 'Duration' &&
        parseInt(item.duration) === 0
      ) {
        item.duration = '1';
      } else if (
        QuantityLabels[showQuantity] == 'Distance' &&
        parseInt(item.distance) === 0
      ) {
        item.distance = '1';
      }
    } else if (WORKOUT_TYPES[props.schemeType] == REPS_W) {
    } else if (WORKOUT_TYPES[props.schemeType] == ROUNDS_W) {
    } else if (WORKOUT_TYPES[props.schemeType] == DURATION_W) {
    }

    console.log('_Adding item: ', item);

    // Checks if reps and weights match the repScheme
    const {success, errorType, errorMsg} = props.onAddItem(item);

    if (success) {
      resetDefaultItem();
    } else if (errorType == 0) {
      // Missing Reps in Scheme, parent should highlight SchemeRounds Input
      console.log('Add item error: ', errorMsg);
    } else if (errorType == 1) {
      // Item reps do not match Reps in Scheme
      console.log('Add item error: ', errorMsg);
      setRepsSchemeRoundsError(true);
      setRepsSchemeRoundsErrorText(errorMsg);
    } else if (errorType == 3) {
      // Invalid Weights
      setWeightError(errorMsg);
    }
  };

  return (
    <View
      style={{
        height: SCREEN_HEIGHT * 0.28,
        borderColor: 'white',
        borderWidth: 1.5,
        padding: 2,
      }}>
      <View style={{flex: 1, flexDirection: 'row', marginBottom: 4}}>
        {!isLoading && isSuccess && data ? (
          <View style={{justifyContent: 'flex-start', flex: 4, height: '100%'}}>
            <SmallText>Workout Items</SmallText>
            <View style={{flex: 1, width: '100%'}}>
              <Picker
                ref={pickerRef}
                style={{flex: 1}}
                itemStyle={{
                  height: '100%',
                  color: theme.palette.text,
                  backgroundColor: theme.palette.gray,
                  fontSize: 16,
                }}
                selectedValue={workoutName}
                onValueChange={(itemValue, itemIndex) => {
                  setWorkoutName(itemIndex);
                  updateItem('name', data[itemIndex]);
                }}>
                {data.map((name, i) => {
                  return (
                    <Picker.Item key={name.id} label={name.name} value={i} />
                  );
                })}
              </Picker>
            </View>
          </View>
        ) : (
          <></>
        )}
        <View style={{flex: 2}}>
          <SmallText>Quantity type</SmallText>
          <View style={{flex: 1, width: '100%'}}>
            <Picker
              ref={showRepsOrDurationInputRef}
              style={[pickerStyle.containerStyle, {flex: 1}]}
              itemStyle={[
                pickerStyle.itemStyle,
                {
                  color: theme.palette.text,
                  backgroundColor: theme.palette.gray,
                  height: '100%',
                },
              ]}
              selectedValue={showQuantity}
              onValueChange={(itemValue, itemIndex) => {
                setDistance(initDistance);
                setDuration(initDuration);
                setReps(initReps);
                // updateItem('distance', nanOrNah(initDistance))
                // updateItem('duration', nanOrNah(initDuration))
                // updateItem('reps', nanOrNah(initReps))
                setShowQuantity(itemIndex);
              }}>
              {QuantityLabels.map((label, i) => {
                return (
                  <Picker.Item key={`show_${label}`} label={label} value={i} />
                );
              })}
            </Picker>
          </View>
        </View>
      </View>

      <View style={{flexDirection: 'row', flex: 1, marginBottom: 4}}>
        {props.schemeType == 0 ? (
          <View style={{flex: 1}}>
            <SmallText
              textStyles={{
                textAlign: 'center',
                backgroundColor: theme.palette.gray,
              }}>
              Sets
            </SmallText>
            <Input
              containerStyle={[
                numberInputStyle.containerStyle,
                {
                  backgroundColor: theme.palette.primary.main,
                  borderRightWidth: 1,
                  borderColor: theme.palette.text,
                },
              ]}
              label=""
              placeholder="Sets"
              centerInput={true}
              fontSize={inputFontSize}
              value={sets}
              inputStyles={{textAlign: 'center'}}
              onChangeText={(text: string) => {
                updateItem('sets', nanOrNah(numFilter(text)));
                setSets(numFilter(text));
              }}
            />
          </View>
        ) : (
          <></>
        )}

        <View style={{alignContent: 'center', flex: 3}}>
          {showQuantity == 0 ? (
            <View style={{flex: 1}}>
              <SmallText
                textStyles={{
                  textAlign: 'center',
                  backgroundColor: theme.palette.gray,
                }}>
                Reps
              </SmallText>
              <Input
                containerStyle={[
                  numberInputStyle.containerStyle,
                  {
                    backgroundColor: theme.palette.primary.main,
                    alignItems: 'center',
                    borderRightWidth: 1,
                    borderColor: theme.palette.text,
                  },
                ]}
                label=""
                placeholder="Reps"
                centerInput
                fontSize={inputFontSize}
                value={reps}
                inputStyles={{textAlign: 'center'}}
                isError={repsSchemeRoundsError}
                helperText={repSchemeRoundsErrorText}
                onChangeText={(text: string) => {
                  if (repsSchemeRoundsError) {
                    setRepsSchemeRoundsError(false);
                    setRepsSchemeRoundsErrorText('');
                  }
                  if (
                    WORKOUT_TYPES[props.schemeType] == STANDARD_W ||
                    WORKOUT_TYPES[props.schemeType] == REPS_W ||
                    WORKOUT_TYPES[props.schemeType] == DURATION_W
                  ) {
                    updateItem('reps', numFilter(text));
                    setReps(numFilter(text));
                  } else {
                    updateItem('reps', numFilterWithSpaces(text));
                    setReps(numFilterWithSpaces(text));
                  }
                }}
              />
            </View>
          ) : showQuantity == 1 ? (
            <View style={{flex: 1}}>
              <SmallText
                textStyles={{
                  textAlign: 'center',
                  backgroundColor: theme.palette.gray,
                }}>
                Duration
              </SmallText>
              <View style={{flexDirection: 'row', width: '100%', flex: 1}}>
                <View style={{flex: 1}}>
                  <Input
                    containerStyle={[
                      numberInputStyle.containerStyle,
                      {
                        backgroundColor: theme.palette.primary.main,
                      },
                    ]}
                    label=""
                    placeholder="Duration"
                    centerInput={true}
                    fontSize={inputFontSize}
                    value={duration}
                    inputStyles={{textAlign: 'center'}}
                    onChangeText={t => {
                      if (
                        WORKOUT_TYPES[props.schemeType] == STANDARD_W ||
                        WORKOUT_TYPES[props.schemeType] == REPS_W ||
                        WORKOUT_TYPES[props.schemeType] == DURATION_W
                      ) {
                        updateItem('duration', numFilter(t));
                        setDuration(numFilter(t));
                      } else {
                        updateItem('duration', numFilterWithSpaces(t));
                        setDuration(numFilterWithSpaces(t));
                      }
                    }}
                  />
                </View>
                <View style={{flex: 1}}>
                  <View style={{flex: 1, width: '100%'}}>
                    <Picker
                      ref={durationUnitPickRef}
                      style={[pickerStyle.containerStyle]}
                      itemStyle={[
                        pickerStyle.itemStyle,
                        {
                          height: '100%',
                          color: theme.palette.text,
                          backgroundColor: theme.palette.gray,
                        },
                      ]}
                      selectedValue={durationUnit}
                      onValueChange={(itemValue, itemIndex) => {
                        setDurationUnit(itemIndex);
                        updateItem('duration_unit', itemIndex);
                      }}>
                      {DURATION_UNITS.map((unit, i) => {
                        return (
                          <Picker.Item
                            key={`rest_${unit}`}
                            label={unit}
                            value={i}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={{flex: 1}}>
              <SmallText
                textStyles={{
                  textAlign: 'center',
                  backgroundColor: theme.palette.gray,
                }}>
                Distance
              </SmallText>
              <View style={{flexDirection: 'row', width: '100%', flex: 1}}>
                <View style={{flex: 1}}>
                  <Input
                    containerStyle={[
                      numberInputStyle.containerStyle,
                      {
                        backgroundColor: theme.palette.primary.main,
                      },
                    ]}
                    label=""
                    placeholder="Distance"
                    centerInput={true}
                    fontSize={inputFontSize}
                    value={distance}
                    inputStyles={{textAlign: 'center'}}
                    onChangeText={(t: string) => {
                      if (
                        WORKOUT_TYPES[props.schemeType] == STANDARD_W ||
                        WORKOUT_TYPES[props.schemeType] == REPS_W ||
                        WORKOUT_TYPES[props.schemeType] == DURATION_W
                      ) {
                        updateItem('distance', numFilter(t));
                        setDistance(numFilter(t));
                      } else {
                        updateItem('distance', numFilterWithSpaces(t));
                        setDistance(numFilterWithSpaces(t));
                      }
                    }}
                  />
                </View>
                <View style={{flex: 1}}>
                  <View style={{flex: 1, width: '100%'}}>
                    <Picker
                      ref={distanceUnitPickRef}
                      style={[pickerStyle.containerStyle]}
                      itemStyle={[
                        pickerStyle.itemStyle,
                        {
                          height: '100%',
                          color: theme.palette.text,
                          backgroundColor: theme.palette.gray,
                        },
                      ]}
                      selectedValue={distanceUnit}
                      onValueChange={(itemValue, itemIndex) => {
                        setDistanceUnit(itemIndex);
                        updateItem('distance_unit', itemIndex);
                      }}>
                      {DISTANCE_UNITS.map((unit, i) => {
                        return (
                          <Picker.Item
                            key={`rest_${unit}`}
                            label={unit}
                            value={i}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={{flex: 3}}>
          <SmallText
            textStyles={{
              textAlign: 'center',
              backgroundColor: theme.palette.gray,
            }}>
            Weights {weightUnit}
          </SmallText>
          <View style={{flexDirection: 'row', flex: 1}}>
            <View style={{flex: 2}}>
              <Input
                containerStyle={[
                  numberInputStyle.containerStyle,
                  {
                    backgroundColor: theme.palette.primary.main,
                  },
                ]}
                label=""
                placeholder="Weight(s)"
                centerInput={true}
                fontSize={inputFontSize}
                value={weight}
                isError={weightError.length > 0}
                helperText={weightError}
                inputStyles={{textAlign: 'center'}}
                onChangeText={t => {
                  if (
                    WORKOUT_TYPES[props.schemeType] == STANDARD_W ||
                    WORKOUT_TYPES[props.schemeType] == REPS_W ||
                    WORKOUT_TYPES[props.schemeType] == ROUNDS_W
                  ) {
                    if (weightError.length > 0) {
                      setWeightError('');
                    }
                    updateItem('weights', numFilterWithSpaces(t));
                    setWeight(numFilterWithSpaces(t));
                  } else {
                    updateItem('weights', numFilter(t));
                    setWeight(numFilter(t));
                  }
                }}
              />
            </View>

            <View style={{flex: 1}}>
              <View style={{flex: 1, width: '100%'}}>
                <Picker
                  ref={weightUnitPickRef}
                  style={pickerStyle.containerStyle}
                  itemStyle={[
                    pickerStyle.itemStyle,
                    {
                      height: '100%',
                      color: theme.palette.text,
                      backgroundColor: theme.palette.gray,
                    },
                  ]}
                  selectedValue={weightUnit}
                  onValueChange={(itemValue, itemIndex) => {
                    setPercentOfWeightUnit(initPercentOfWeightUnit);
                    setWeightUnit(itemValue);
                    updateItem('weight_unit', itemValue);
                  }}>
                  {WEIGHT_UNITS.map((unit, i) => {
                    return (
                      <Picker.Item
                        key={`rest_${unit}`}
                        label={unit}
                        value={unit}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          flex: 1,
          marginBottom: 4,
        }}>
        {weightUnit === '%' ? (
          <View style={{flex: 1}}>
            <SmallText
              textStyles={{
                textAlign: 'center',
                backgroundColor: theme.palette.gray,
              }}>
              % of
            </SmallText>
            <Input
              containerStyle={[
                numberInputStyle.containerStyle,
                {
                  backgroundColor: theme.palette.primary.main,
                  borderRightWidth: 1,
                  borderColor: theme.palette.text,
                },
              ]}
              label=""
              placeholder="% of"
              centerInput={true}
              fontSize={inputFontSize}
              value={percentOfWeightUnit}
              inputStyles={{textAlign: 'center'}}
              onChangeText={t => {
                updateItem('percent_of', t);
                setPercentOfWeightUnit(t);
              }}
            />
          </View>
        ) : (
          <></>
        )}
        <View style={{flex: 1}}>
          <SmallText
            textStyles={{
              textAlign: 'center',
              backgroundColor: theme.palette.gray,
            }}>
            Rest
          </SmallText>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Input
                containerStyle={[
                  numberInputStyle.containerStyle,
                  {
                    backgroundColor: theme.palette.primary.main,
                  },
                ]}
                label=""
                placeholder="Rest"
                centerInput={true}
                fontSize={inputFontSize}
                value={restDuration}
                inputStyles={{textAlign: 'center'}}
                onChangeText={t => {
                  updateItem('rest_duration', nanOrNah(numFilter(t)));
                  setRestDuration(numFilter(t));
                }}
              />
            </View>
            <View style={{flex: weightUnit === '%' ? 2 : 1}}>
              <Picker
                ref={restDurationUnitPickRef}
                style={[pickerStyle.containerStyle]}
                itemStyle={[
                  pickerStyle.itemStyle,
                  {
                    height: '100%',
                    color: theme.palette.text,
                    backgroundColor: theme.palette.gray,
                    textAlign: 'center',
                    justifyContent: 'center',
                  },
                ]}
                selectedValue={restDurationUnit}
                onValueChange={(itemValue, itemIndex) => {
                  setRestDurationUnit(itemIndex);
                  updateItem('rest_duration_unit', itemIndex);
                }}>
                {DURATION_UNITS.map((unit, i) => {
                  return (
                    <Picker.Item
                      key={`rest_${unit}`}
                      style={{alignItems: 'center'}}
                      label={unit}
                      value={i}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
        </View>
      </View>

      <View style={{}}>
        <Button
          onPress={_addItem}
          title="Add Item"
          style={{backgroundColor: theme.palette.lightGray}}
        />
      </View>
    </View>
  );
};

export default AddItem;
