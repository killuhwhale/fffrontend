import React, {FunctionComponent, useState, useRef} from 'react';
import {useTheme} from 'styled-components';

import {View} from 'react-native';
import {
  Container,
  displayJList,
  DISTANCE_UNITS,
  DURATION_UNITS,
  DURATION_W,
  jList,
  mdFontSize,
  numFilter,
  numFilterWithSpaces,
  REPS_W,
  ROUNDS_W,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  STANDARD_W,
  WEIGHT_UNITS,
  WORKOUT_TYPES,
} from '../../../../app_components/shared';

import Icon from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';

import {SmallText} from '../../../../app_components/Text/Text';
import {
  WorkoutDualItemProps,
  WorkoutItemProps,
} from '../../../../app_components/Cards/types';
import {numberInputStyle} from '../CreateWorkoutScreen';
import Input from '../../../../app_components/Input/input';
import ItemString from '../../../../app_components/WorkoutItems/ItemString';
import {jListToNumStr} from '../CreateCompletedWorkoutScreen';

const EditWorkoutDualItem: FunctionComponent<{
  workoutItem: WorkoutDualItemProps;
  schemeType: number;
  editDualItem(
    workoutIdx: number,
    itemIdx: number,
    key: string,
    value: string | number,
  ): {success: boolean; errorType: number; errorMsg: string};
  itemIdx: number;
  workoutIdx: number;
}> = props => {
  const theme = useTheme();
  const {workoutItem, schemeType} = props;
  const {
    id,
    sets,
    reps,
    duration,
    distance,
    weights,
    weight_unit,
    percent_of,
    duration_unit,
    distance_unit,
  } = workoutItem;

  const weightUnitPickRef = useRef<any>();
  const durationUnitPickRef = useRef<any>();
  const distanceUnitPickRef = useRef<any>();

  const [newWeights, setNewWeights] = useState(jListToNumStr(weights)); // Json string list of numbers.
  const [newWeightUnit, setNewWeightUnit] = useState(weight_unit);
  const [oldWeightUnit, setOldWeightUnit] = useState(weight_unit);
  const [newSets, setNewSets] = useState(sets); // Need this for Standard workouts.
  const [newReps, setNewReps] = useState(jListToNumStr(reps));
  const [newDuration, setNewDuration] = useState(jListToNumStr(duration));
  const [newDurationUnit, setNewDurationUnit] = useState(duration_unit);
  const [oldDurationUnit, setOldDurationUnit] = useState(duration_unit);
  const [newDistance, setNewDistance] = useState(jListToNumStr(distance));
  const [newDistanceUnit, setNewDistanceUnit] = useState(distance_unit);
  const [oldDistanceUnit, setOldDistanceUnit] = useState(distance_unit);
  const [newPercentOf, setNewPercentOf] = useState(percent_of);

  const [weightsError, setWeightsError] = useState('');
  const [setsError, setSetsError] = useState('');
  const [repsError, setRepsError] = useState('');
  const [durationError, setDurationError] = useState('');
  const [distanceError, setDistanceError] = useState('');

  // Prevents text field from disappearing when user removes all text from item
  const [hasReps, _hasReps] = useState(JSON.parse(reps)[0] != 0);
  const [hasDuration, _hasDuration] = useState(JSON.parse(duration)[0] != 0);
  const [hasDistance, _hasDistance] = useState(JSON.parse(distance)[0] != 0);
  const [hasSets, _hasSets] = useState(sets != 0);

  const editItemWidth = '65%';
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        borderWidth: 1,
        borderColor: theme.palette.backgroundColor,
        borderRadius: 8,
        padding: 4,
      }}>
      {/** Dual items are for timed workouts where sets are not a part of the scheme */}
      {hasSets && false ? (
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
          }}>
          <SmallText textStyles={{textAlign: 'center'}}>Sets</SmallText>
          <View
            style={{
              marginHorizontal: 8,
              marginBottom: 8,
              width: editItemWidth,
            }}>
            <Input
              inputStyles={{textAlign: 'center'}}
              containerStyle={[
                numberInputStyle.containerStyle,
                {
                  borderRadius: 4,
                  backgroundColor: theme.palette.backgroundColor,
                },
              ]}
              label="Sets"
              value={newSets === 0 ? '' : newSets.toString()}
              isError={setsError.length > 0}
              helperText={setsError}
              onChangeText={(t: string) => {
                let val = '';

                val = numFilter(t);

                const {success, errorType, errorMsg} = props.editDualItem(
                  props.workoutIdx,
                  props.itemIdx,
                  'sets',
                  val,
                );
                if (!success) {
                  setSetsError(errorMsg);
                } else {
                  setSetsError('');
                }
                setNewSets(isNaN(parseInt(val)) ? 0 : parseInt(val));
              }}
            />
          </View>
        </View>
      ) : (
        <></>
      )}

      {hasReps ? (
        <View
          style={{
            flexDirection: 'row',
            flex: 1,

            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
          }}>
          <SmallText textStyles={{textAlign: 'center'}}>Reps</SmallText>
          <View
            style={{
              marginHorizontal: 8,
              marginBottom: 8,
              zIndex: 100,
              width: editItemWidth,
            }}>
            <Input
              inputStyles={{textAlign: 'center'}}
              containerStyle={[
                numberInputStyle.containerStyle,
                {
                  borderRadius: 4,
                  backgroundColor: theme.palette.backgroundColor,
                },
              ]}
              label="Reps"
              value={newReps}
              isError={repsError.length > 0}
              helperText={repsError}
              onChangeText={(t: string) => {
                let val = '';
                if (
                  WORKOUT_TYPES[props.schemeType] == STANDARD_W ||
                  WORKOUT_TYPES[props.schemeType] == REPS_W ||
                  WORKOUT_TYPES[props.schemeType] == DURATION_W
                ) {
                  val = numFilter(t);
                } else {
                  val = numFilterWithSpaces(t);
                }

                const {success, errorType, errorMsg} = props.editDualItem(
                  props.workoutIdx,
                  props.itemIdx,
                  'reps',
                  val,
                );
                if (!success) {
                  setRepsError(errorMsg);
                } else {
                  setRepsError('');
                }
                setNewReps(val);
              }}
            />
          </View>
        </View>
      ) : (
        <></>
      )}

      {hasDuration ? (
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
          }}>
          <SmallText textStyles={{textAlign: 'center'}}>
            Duration ({DURATION_UNITS[oldDurationUnit]})
          </SmallText>
          <View
            style={{
              marginHorizontal: 8,
              marginBottom: 8,
              width: editItemWidth,
              flexDirection: 'row',
            }}>
            <View style={{flex: 3}}>
              <Input
                inputStyles={{textAlign: 'center'}}
                containerStyle={[
                  numberInputStyle.containerStyle,
                  {
                    borderRadius: 4,
                    backgroundColor: theme.palette.backgroundColor,
                  },
                ]}
                onChangeText={t => {
                  let val = '';

                  if (
                    WORKOUT_TYPES[props.schemeType] == STANDARD_W ||
                    WORKOUT_TYPES[props.schemeType] == REPS_W ||
                    WORKOUT_TYPES[props.schemeType] == DURATION_W
                  ) {
                    val = numFilter(t);
                  } else {
                    val = numFilterWithSpaces(t);
                  }

                  const {success, errorType, errorMsg} = props.editDualItem(
                    props.workoutIdx,
                    props.itemIdx,
                    'duration',
                    val,
                  );
                  if (!success) {
                    setDurationError(errorMsg);
                  } else {
                    setDurationError('');
                  }
                  setNewDuration(val);
                }}
                fontSize={mdFontSize}
                value={newDuration}
                label="Duration"
                isError={durationError.length > 0}
                helperText={durationError}
              />
            </View>
            <View style={{flex: 3}}>
              <RNPickerSelect
                ref={durationUnitPickRef}
                onValueChange={(itemValue, itemIndex) => {
                  setNewDurationUnit(itemValue);

                  props.editDualItem(
                    props.workoutIdx,
                    props.itemIdx,
                    'duration_unit',
                    itemIndex,
                  );
                }}
                useNativeAndroidPickerStyle={false}
                placeholder={{}}
                value={newDurationUnit}
                style={{
                  inputAndroidContainer: {
                    alignItems: 'center',
                  },
                  inputAndroid: {
                    color: theme.palette.text,
                    borderBottomColor: theme.palette.text,
                    borderBottomWidth: 1,
                  },
                  inputIOSContainer: {
                    alignItems: 'center',
                  },
                  inputIOS: {
                    color: theme.palette.text,
                    borderBottomColor: theme.palette.text,
                    height: '100%',
                  },
                }}
                items={DURATION_UNITS.map((unit, i) => {
                  return {
                    label: unit,
                    value: i,
                  };
                })}
              />
            </View>
          </View>
        </View>
      ) : (
        <></>
      )}

      {hasDistance ? (
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
          }}>
          <SmallText textStyles={{textAlign: 'center'}}>
            Distance ({DISTANCE_UNITS[oldDistanceUnit]})
          </SmallText>
          <View
            style={{
              marginHorizontal: 8,
              marginBottom: 8,
              width: editItemWidth,
              flexDirection: 'row',
            }}>
            <View style={{flex: 3}}>
              <Input
                fontSize={mdFontSize}
                inputStyles={{textAlign: 'center'}}
                containerStyle={[
                  numberInputStyle.containerStyle,
                  {
                    borderRadius: 4,
                    backgroundColor: theme.palette.backgroundColor,
                  },
                ]}
                label="Distance"
                value={newDistance}
                isError={distanceError.length > 0}
                helperText={distanceError}
                onChangeText={(t: string) => {
                  let val = '';
                  if (
                    WORKOUT_TYPES[props.schemeType] == STANDARD_W ||
                    WORKOUT_TYPES[props.schemeType] == REPS_W ||
                    WORKOUT_TYPES[props.schemeType] == DURATION_W
                  ) {
                    // updateItem('distance', numFilter(t))
                    val = numFilter(t);
                  } else {
                    // updateItem('distance', numFilterWithSpaces(t))
                    val = numFilterWithSpaces(t);
                  }
                  const {success, errorType, errorMsg} = props.editDualItem(
                    props.workoutIdx,
                    props.itemIdx,
                    'distance',
                    val,
                  );

                  if (!success) {
                    setDistanceError(errorMsg);
                  } else {
                    setDistanceError('');
                  }

                  setNewDistance(val);
                }}
              />
            </View>
            <View style={{flex: 3}}>
              <RNPickerSelect
                ref={distanceUnitPickRef}
                onValueChange={(itemValue, itemIndex) => {
                  setNewDistanceUnit(itemValue);

                  props.editDualItem(
                    props.workoutIdx,
                    props.itemIdx,
                    'distance_unit',
                    itemIndex,
                  );
                }}
                useNativeAndroidPickerStyle={false}
                placeholder={{}}
                value={newDistanceUnit}
                style={{
                  inputAndroidContainer: {
                    alignItems: 'center',
                  },
                  inputAndroid: {
                    color: theme.palette.text,
                    borderBottomColor: theme.palette.text,
                    borderBottomWidth: 1,
                  },
                  inputIOSContainer: {
                    alignItems: 'center',
                  },
                  inputIOS: {
                    color: theme.palette.text,
                    borderBottomColor: theme.palette.text,
                    borderBottomWidth: 1,
                    height: '100%',
                  },
                }}
                items={DISTANCE_UNITS.map((unit, i) => {
                  return {
                    label: unit,
                    value: i,
                  };
                })}
              />
            </View>
          </View>
        </View>
      ) : (
        <></>
      )}

      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '90%',
        }}>
        <SmallText textStyles={{textAlign: 'center'}}>Weights</SmallText>
        <View
          style={{
            marginHorizontal: 8,
            marginBottom: 8,
            width: editItemWidth,
          }}>
          <Input
            inputStyles={{textAlign: 'center'}}
            containerStyle={[
              [
                numberInputStyle.containerStyle,
                {
                  borderRadius: 4,
                  backgroundColor: theme.palette.backgroundColor,
                },
              ],
              {width: '100%'},
            ]}
            onChangeText={t => {
              let val = '';
              if (
                WORKOUT_TYPES[props.schemeType] == STANDARD_W ||
                WORKOUT_TYPES[props.schemeType] == REPS_W ||
                WORKOUT_TYPES[props.schemeType] == ROUNDS_W
              ) {
                val = numFilterWithSpaces(t);
              } else {
                val = numFilter(t);
              }

              const {success, errorType, errorMsg} = props.editDualItem(
                props.workoutIdx,
                props.itemIdx,
                'weights',
                val,
              );

              if (!success) {
                setWeightsError(errorMsg);
              } else {
                setWeightsError('');
              }

              setNewWeights(val);
            }}
            isError={weightsError.length > 0}
            helperText={weightsError}
            value={newWeights}
            label="Weight(s)"
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '90%',
        }}>
        <SmallText textStyles={{textAlign: 'center'}}>
          Weight Unit ({oldWeightUnit})
        </SmallText>
        <View
          style={{
            marginHorizontal: 8,
            marginBottom: 8,
            width: editItemWidth,
          }}>
          {/* If percentage */}

          <View style={{flexDirection: 'row', width: '100%'}}>
            {newWeightUnit === WEIGHT_UNITS[2] ? (
              // If its percent, we need to show textfield
              <Input
                inputStyles={{textAlign: 'center'}}
                containerStyle={[
                  [
                    numberInputStyle.containerStyle,
                    {
                      borderRadius: 4,
                      backgroundColor: theme.palette.backgroundColor,
                    },
                  ],
                  {width: '100%'},
                ]}
                onChangeText={t => {
                  let val = t; // No need to filter as of now.

                  const {success, errorType, errorMsg} = props.editDualItem(
                    props.workoutIdx,
                    props.itemIdx,
                    'percent_of',
                    val,
                  );

                  setNewPercentOf(val);
                }}
                value={newPercentOf}
                label="Percent of"
              />
            ) : (
              <></>
            )}
            <View
              style={{
                width: newWeightUnit === WEIGHT_UNITS[2] ? '50%' : '100%',
              }}>
              <RNPickerSelect
                ref={weightUnitPickRef}
                onValueChange={(itemValue, itemIndex) => {
                  setNewWeightUnit(itemValue);
                  props.editDualItem(
                    props.workoutIdx,
                    props.itemIdx,
                    'weight_unit',
                    itemValue,
                  );
                }}
                useNativeAndroidPickerStyle={false}
                value={newWeightUnit}
                placeholder={{}}
                style={{
                  inputAndroidContainer: {
                    alignItems: 'center',
                  },
                  inputAndroid: {
                    color: theme.palette.text,
                    borderBottomColor: theme.palette.text,
                    borderBottomWidth: 1,
                  },
                  inputIOSContainer: {
                    alignItems: 'center',
                  },
                  inputIOS: {
                    color: theme.palette.text,
                    borderBottomColor: theme.palette.text,
                    borderBottomWidth: 1,
                    height: '100%',
                  },
                }}
                items={WEIGHT_UNITS.map((unit, i) => {
                  return {
                    label: unit,
                    value: unit,
                  };
                })}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EditWorkoutDualItem;
