import React, {FunctionComponent, useState, useRef, useEffect} from 'react';
import {View} from 'react-native';
import {useTheme} from 'styled-components';

import {TSCaptionText} from '../../../app_components/Text/Text';
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
  CREATIVE_W,
  REPS_W,
  nanOrNah,
  numFilter,
  numFilterWithSpaces,
  AddItemFontsize,
  lightenHexColor,
} from '../../../app_components/shared';
import {useGetWorkoutNamesQuery} from '../../../redux/api/apiSlice';

import {
  WorkoutItemProps,
  WorkoutNameProps,
} from '../../../app_components/Cards/types';
import {numberInputStyle} from './CreateWorkoutScreen';
import Input from '../../../app_components/Input/input';
import VerticalPicker from '../../../app_components/Pickers/VerticalPicker';
import {RegularButton} from '../../../app_components/Buttons/buttons';
import {TestIDs} from '../../../utils/constants';
import FilterItemsModal from '../../../app_components/modals/filterItemsModal';
import PickerFilterListView from '../../../app_components/modals/pickerFilterListView';

interface AddWorkoutItemProps {
  success: boolean;
  errorType: number;
  errorMsg: string;
}

const AddItem: FunctionComponent<{
  onAddItem(item: WorkoutItemProps): AddWorkoutItemProps;
  schemeType: number;
}> = props => {
  // Need to have blank values, empty strings in the field instead of a default 0

  const initWorkoutName = 0; // index for Workout name from data query
  const initWeight = '';
  const initWeightUnit = 'kg';
  const initPercentOfWeightUnit = '';
  const initSets = '';
  const initReps = '';
  const initPauseDuration = '';
  const initDistance = '';
  const initDistanceUnit = 0;

  const initDuration = '';
  const initDurationUnit = 0;

  const initRestDuration = '';
  const initRestDurationUnit = 0;

  const theme = useTheme();
  const {data, isLoading, isSuccess, isError, error} =
    useGetWorkoutNamesQuery('');
  const workoutNames = data as [WorkoutNameProps];
  const workoutNamesMap = workoutNames
    ? new Map(workoutNames.map((workoutName, idx) => [workoutName.name, idx]))
    : new Map();
  const pickerRef = useRef<any>();

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
  const [pauseDuration, setPauseDuration] = useState(initPauseDuration);
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

  const [showWorkoutNamesModal, setShowWorkoutNamesModal] = useState(false);

  // This NumberInput should vary depedning on the Scheme Type
  // For standard, this will be a single number,
  // For the other types, it should be a single number or match the length of scheme_rounds list
  // Example SchemeType Reps: 21,15,9
  // item Squat weights 200lbs, 100lbs, 50lbs,  ==> this means we do 200 lbs on the first round, 100 on the seocnd, etc...

  const onNameSelect = (_workoutName: WorkoutNameProps) => {
    const name = workoutNamesMap.get(_workoutName.name);
    if (name != undefined) {
      setWorkoutName(name);
      setShowWorkoutNamesModal(false);
    }
  };

  const resetDefaultItem = () => {
    console.log('Resetting item');
    setWeight(initWeight);
    setDistance(initDistance);
    setPercentOfWeightUnit(initPercentOfWeightUnit);
    setSets(initSets);
    setReps(initReps);
    setPauseDuration(initPauseDuration);
    setDuration(initDuration);
    setRestDuration(initRestDuration);
    // setRestDurationUnit(initRestDurationUnit);
  };

  const _addItem = () => {
    if (!data || data.length <= 0) {
      console.log('Error, no workout names to add to item.');
      return;
    }

    let setsItem = nanOrNah(sets);
    let repsItem = reps;
    let durationItem = duration;
    let distanceItem = distance;

    // sets: nanOrNah(sets),
    // reps: reps.length == 0 ? '0' : reps,
    // duration: distance.length == 0 ? '0' : distance,
    // distance: distance.length == 0 ? '0' : distance,

    // Enforce default values per workout type.
    if (setsItem === 0) {
      setsItem = 1; // ensure there is at least 1 set.
    }
    if (repsItem.length === 0 || parseInt(repsItem) === 0) {
      repsItem = '0';
    }
    if (durationItem.length === 0 || parseInt(durationItem) === 0) {
      durationItem = '0';
    }
    if (distanceItem.length === 0 || parseInt(distanceItem) === 0) {
      distanceItem = '0';
    }

    if (QuantityLabels[showQuantity] == 'Reps' && parseInt(repsItem) === 0) {
      repsItem = '1';
    } else if (
      QuantityLabels[showQuantity] == 'Duration' &&
      parseInt(durationItem) === 0
    ) {
      durationItem = '1';
    } else if (
      QuantityLabels[showQuantity] == 'Distance' &&
      parseInt(distanceItem) === 0
    ) {
      distanceItem = '1';
    }

    const item = {
      workout: 0,
      name: data[workoutName] as WorkoutNameProps,
      ssid: -1,
      constant: false,
      pause_duration: nanOrNah(pauseDuration),
      sets: setsItem,
      reps: repsItem,
      duration: durationItem,
      distance: distanceItem,
      duration_unit: durationUnit,
      distance_unit: distanceUnit,
      weights: weight,
      weight_unit: weightUnit,
      rest_duration: nanOrNah(restDuration),
      rest_duration_unit: restDurationUnit,
      percent_of: percentOfWeightUnit,
      order: -1,
      date: '',
      id: 0,
    };
    console.log('Adding item: ', item);

    // // Checks if reps and weights match the repScheme
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

  const isPausedItem =
    !isLoading && isSuccess && data && data.length > 0
      ? data[workoutName].name.match(/pause*/i)
      : false;

  return (
    <View style={{height: SCREEN_HEIGHT * 0.2412}}>
      <View
        style={{
          flex: 1,
          borderColor: 'white',
          borderWidth: 1.5,
          padding: 2,
        }}>
        {/* Row 1 */}
        <View style={{flex: 1, flexDirection: 'row'}}>
          {!isLoading && isSuccess && data ? (
            <View
              style={{justifyContent: 'flex-start', flex: 4, height: '100%'}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 4}}>
                  <TSCaptionText textStyles={{textAlign: 'center'}}>
                    Workout Items
                  </TSCaptionText>
                  <View
                    style={{flex: 1, width: '100%', justifyContent: 'center'}}>
                    {!showWorkoutNamesModal ? (
                      <RegularButton
                        text={
                          data[workoutName]?.name ?? 'No workout name found'
                        }
                        btnStyles={{
                          backgroundColor: lightenHexColor(
                            theme.palette.primary.main,
                            2,
                          ),
                        }}
                        testID={TestIDs.AddItemChooseWorkoutNameField.name()}
                        onPress={() => setShowWorkoutNamesModal(true)}
                      />
                    ) : (
                      <FilterItemsModal
                        key={'FilterWorkoutNames'}
                        modalVisible={showWorkoutNamesModal}
                        onRequestClose={() => {
                          setShowWorkoutNamesModal(!showWorkoutNamesModal);
                        }}
                        items={workoutNames}
                        searchTextPlaceHolder="Search"
                        extraProps={{
                          onSelect: onNameSelect,
                        }}
                        uiView={PickerFilterListView}
                      />
                    )}
                  </View>
                </View>

                {isPausedItem ? (
                  <View style={{flex: 1}}>
                    <TSCaptionText
                      textStyles={{
                        textAlign: 'center',
                      }}>
                      Paused
                    </TSCaptionText>
                    <Input
                      containerStyle={[
                        numberInputStyle.containerStyle,
                        {
                          alignItems: 'center',
                          borderRightWidth: 1,
                          borderColor: theme.palette.text,
                        },
                      ]}
                      testID={TestIDs.AddItemPauseDurField.name()}
                      label=""
                      placeholder="time"
                      centerInput
                      keyboardType="decimal-pad"
                      fontSize={AddItemFontsize}
                      value={pauseDuration}
                      inputStyles={{textAlign: 'center'}}
                      isError={repsSchemeRoundsError}
                      helperText={repSchemeRoundsErrorText}
                      onChangeText={(text: string) => {
                        setPauseDuration(numFilter(text));
                      }}
                    />
                  </View>
                ) : (
                  <></>
                )}
              </View>
            </View>
          ) : (
            <></>
          )}

          <View style={{flex: 2}}>
            <TSCaptionText textStyles={{textAlign: 'center'}}>
              Quantity type
            </TSCaptionText>
            <View style={{flex: 1, width: '100%'}}>
              <VerticalPicker
                key={'qty'}
                data={QuantityLabels}
                testID={TestIDs.VerticalPickerGestureHandlerQtyType.name()}
                onChange={itemIndex => {
                  const itemValue = QuantityLabels[itemIndex];
                  setDistance(initDistance);
                  setDuration(initDuration);
                  setReps(initReps);
                  // updateItem('distance', nanOrNah(initDistance))
                  // updateItem('duration', nanOrNah(initDuration))
                  // updateItem('reps', nanOrNah(initReps))
                  setShowQuantity(itemIndex);
                }}
              />
            </View>
          </View>
        </View>

        {/* Row 2 */}
        <View style={{flexDirection: 'row', flex: 1}}>
          {props.schemeType == 0 ? (
            <View style={{flex: 1}}>
              <TSCaptionText
                textStyles={{
                  textAlign: 'center',
                  backgroundColor: theme.palette.gray,
                }}>
                Sets
              </TSCaptionText>
              <Input
                keyboardType="decimal-pad"
                containerStyle={[
                  numberInputStyle.containerStyle,
                  {
                    backgroundColor: theme.palette.primary.main,
                    borderRightWidth: 1,
                    borderColor: theme.palette.text,
                  },
                ]}
                label=""
                testID={TestIDs.AddItemSetsField.name()}
                placeholder="Sets"
                centerInput={true}
                fontSize={AddItemFontsize}
                value={sets}
                inputStyles={{textAlign: 'center'}}
                onChangeText={(text: string) => {
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
                <TSCaptionText
                  textStyles={{
                    textAlign: 'center',
                    backgroundColor: theme.palette.gray,
                  }}>
                  Reps
                </TSCaptionText>
                <Input
                  keyboardType="decimal-pad"
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
                  testID={TestIDs.AddItemRepsField?.name()}
                  placeholder="Reps"
                  centerInput
                  fontSize={AddItemFontsize}
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
                      WORKOUT_TYPES[props.schemeType] == CREATIVE_W
                    ) {
                      setReps(numFilter(text));
                    } else {
                      setReps(numFilterWithSpaces(text));
                    }
                  }}
                />
              </View>
            ) : showQuantity == 1 ? (
              <View style={{flex: 1}}>
                <TSCaptionText
                  textStyles={{
                    textAlign: 'center',
                    backgroundColor: theme.palette.gray,
                  }}>
                  Duration
                </TSCaptionText>
                <View style={{flexDirection: 'row', width: '100%', flex: 1}}>
                  <View style={{flex: 1}}>
                    <Input
                      keyboardType="decimal-pad"
                      containerStyle={[
                        numberInputStyle.containerStyle,
                        {
                          backgroundColor: theme.palette.primary.main,
                        },
                      ]}
                      label=""
                      placeholder="Duration"
                      testID={TestIDs.AddItemDurationField.name()}
                      centerInput={true}
                      fontSize={AddItemFontsize}
                      value={duration}
                      inputStyles={{textAlign: 'center'}}
                      onChangeText={t => {
                        if (
                          WORKOUT_TYPES[props.schemeType] == STANDARD_W ||
                          WORKOUT_TYPES[props.schemeType] == REPS_W ||
                          WORKOUT_TYPES[props.schemeType] == CREATIVE_W
                        ) {
                          setDuration(numFilter(t));
                        } else {
                          setDuration(numFilterWithSpaces(t));
                        }
                      }}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <View style={{flex: 1, width: '100%'}}>
                      <VerticalPicker
                        key={'dur'}
                        data={DURATION_UNITS}
                        testID={TestIDs.VerticalPickerGestureHandlerDuration.name()}
                        onChange={itemIndex => {
                          const itemValue = DURATION_UNITS[itemIndex];
                          setDurationUnit(itemIndex);
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View style={{flex: 1}}>
                <TSCaptionText
                  textStyles={{
                    textAlign: 'center',
                    backgroundColor: theme.palette.gray,
                  }}>
                  Distance
                </TSCaptionText>
                <View style={{flexDirection: 'row', width: '100%', flex: 1}}>
                  <View style={{flex: 1}}>
                    <Input
                      keyboardType="decimal-pad"
                      containerStyle={[
                        numberInputStyle.containerStyle,
                        {
                          backgroundColor: theme.palette.primary.main,
                        },
                      ]}
                      label=""
                      placeholder="Distance"
                      testID={TestIDs.AddItemDistanceField.name()}
                      centerInput={true}
                      fontSize={AddItemFontsize}
                      value={distance}
                      inputStyles={{textAlign: 'center'}}
                      onChangeText={(t: string) => {
                        if (
                          WORKOUT_TYPES[props.schemeType] == STANDARD_W ||
                          WORKOUT_TYPES[props.schemeType] == REPS_W ||
                          WORKOUT_TYPES[props.schemeType] == CREATIVE_W
                        ) {
                          setDistance(numFilter(t));
                        } else {
                          setDistance(numFilterWithSpaces(t));
                        }
                      }}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <View style={{flex: 1, width: '100%'}}>
                      <VerticalPicker
                        key={'dist'}
                        data={DISTANCE_UNITS}
                        testID={TestIDs.VerticalPickerGestureHandlerDistance.name()}
                        onChange={itemIndex => {
                          const itemValue = DISTANCE_UNITS[itemIndex];
                          setPercentOfWeightUnit(initPercentOfWeightUnit);
                          setDistanceUnit(itemIndex);
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>

          <View
            style={{
              flex: 3,
              backgroundColor: theme.palette.primary.main,
            }}>
            <TSCaptionText
              textStyles={{
                textAlign: 'center',
                backgroundColor: theme.palette.gray,
              }}>
              Weights {weightUnit}
            </TSCaptionText>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
              }}>
              <View style={{flex: 3}}>
                <Input
                  keyboardType="decimal-pad"
                  containerStyle={[
                    numberInputStyle.containerStyle,
                    {
                      backgroundColor: theme.palette.primary.main,
                    },
                  ]}
                  label=""
                  placeholder="Weight(s)"
                  testID={TestIDs.AddItemWeightField.name()}
                  centerInput={true}
                  fontSize={AddItemFontsize}
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
                      setWeight(numFilterWithSpaces(t));
                    } else {
                      setWeight(numFilter(t));
                    }
                  }}
                />
              </View>

              <View style={{flex: 1}}>
                <VerticalPicker
                  key={'wts'}
                  data={WEIGHT_UNITS}
                  testID={TestIDs.VerticalPickerGestureHandlerWtUnit.name()}
                  onChange={itemIndex => {
                    const itemValue = WEIGHT_UNITS[itemIndex];
                    setPercentOfWeightUnit(initPercentOfWeightUnit);
                    setWeightUnit(itemValue);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        {/* Row 3 */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            flex: 1,
          }}>
          {weightUnit === '%' ? (
            <View style={{flex: 1}}>
              <TSCaptionText
                textStyles={{
                  textAlign: 'center',
                  backgroundColor: theme.palette.gray,
                }}>
                % of
              </TSCaptionText>
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
                testID={TestIDs.AddItemPercentOfField.name()}
                centerInput={true}
                fontSize={AddItemFontsize}
                value={percentOfWeightUnit}
                inputStyles={{textAlign: 'center'}}
                onChangeText={t => {
                  setPercentOfWeightUnit(t);
                }}
              />
            </View>
          ) : (
            <></>
          )}
          <View style={{flex: 1}}>
            <TSCaptionText
              textStyles={{
                textAlign: 'center',
                backgroundColor: theme.palette.gray,
              }}>
              Rest
            </TSCaptionText>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Input
                  keyboardType="decimal-pad"
                  containerStyle={[
                    numberInputStyle.containerStyle,
                    {
                      backgroundColor: theme.palette.primary.main,
                    },
                  ]}
                  label=""
                  placeholder="Rest"
                  testID={TestIDs.AddItemRestField.name()}
                  centerInput={true}
                  fontSize={AddItemFontsize}
                  value={restDuration}
                  inputStyles={{textAlign: 'center'}}
                  onChangeText={t => {
                    setRestDuration(numFilter(t));
                  }}
                />
              </View>
              <View style={{flex: weightUnit === '%' ? 2 : 1}}>
                <VerticalPicker
                  key={'rest'}
                  data={DURATION_UNITS}
                  testID={TestIDs.VerticalPickerGestureHandlerRestUnit.name()}
                  onChange={itemIndex => {
                    const itemValue = DURATION_UNITS[itemIndex];
                    setRestDurationUnit(itemIndex);
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={{}}>
          <RegularButton
            onPress={_addItem}
            testID={TestIDs.CreateWorkoutAddItemBtn.name()}
            btnStyles={{
              backgroundColor: theme.palette.darkGray,
            }}
            text="Add Item"
          />
        </View>
      </View>
    </View>
  );
};

export default AddItem;
