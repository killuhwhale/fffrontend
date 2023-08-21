import React, {FunctionComponent, useState, useRef} from 'react';
import {useTheme} from 'styled-components';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native-gesture-handler';
import {ActivityIndicator, TouchableHighlight, View} from 'react-native';
import {
  Container,
  displayJList,
  DISTANCE_UNITS,
  DURATION_UNITS,
  CREATIVE_W,
  jList,
  jsonCopy,
  mdFontSize,
  numFilter,
  numFilterWithSpaces,
  REPS_W,
  ROUNDS_W,
  SCREEN_HEIGHT,
  STANDARD_W,
  WEIGHT_UNITS,
  WORKOUT_TYPES,
  limitTextLength,
  CompletedWorkoutGroupCaptionLimit,
  MaxDigits,
} from '../../../app_components/shared';

import Icon from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';

import {StackScreenProps} from '@react-navigation/stack';
import DatePicker from 'react-native-date-picker';
import {ImageOrVideo} from 'react-native-image-crop-picker';

import {
  TSCaptionText,
  TSParagrapghText,
} from '../../../app_components/Text/Text';
import {useAppDispatch} from '../../../redux/hooks';
import {useCreateCompletedWorkoutMutation} from '../../../redux/api/apiSlice';

import {RootStackParamList} from '../../../navigators/RootStack';
// import {MediaPicker} from './CreateWorkoutGroupScreen';
// import {MediaSlider} from '../../../app_components/MediaSlider/MediaSlider';
import {
  WorkoutCardProps,
  WorkoutGroupProps,
  WorkoutItemProps,
} from '../../../app_components/Cards/types';
import {
  numberInputStyle,
  // pickerStyle,
  verifyWorkoutItem,
} from './CreateWorkoutScreen';
import ActionCancelModal from '../../../app_components/modals/ActionCancelModal';
import {dateFormat} from '../../StatsScreen';
export type Props = StackScreenProps<
  RootStackParamList,
  'CreateCompletedWorkoutScreen'
>;
import Input from '../../../app_components/Input/input';
import ItemString from '../../../app_components/WorkoutItems/ItemString';
import {RegularButton} from '../../../app_components/Buttons/buttons';
import AlertModal from '../../../app_components/modals/AlertModal';
import {isDual} from '../../../app_components/WorkoutItems/ItemPanel';
import EditWorkoutDualItem from './workoutScreen/EditWorkoutDualItem';

const PageContainer = styled(Container)`
  background-color: ${props => props.theme.palette.backgroundColor};
  justify-content: space-between;
  width: 100%;
`;

// Convert a JSON stringified list to a space demilimited string

export const jListToNumStr = jsonListStr => {
  try {
    const list = JSON.parse(jsonListStr);
    // return list.toString().replaceAll(',', ' ');
    return list.toString().replace(/,/g, ' ');
  } catch (err) {
    console.log('Err jListToNumStr ', err);
  }
};

const EditWorkoutItem: FunctionComponent<{
  workoutItem: WorkoutItemProps;
  schemeType: number;
  editItem(
    workoutIdx: number,
    itemIdx: number,
    key: string,
    value: string | number,
  );
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

  console.log(
    'Dur unit:',
    hasDuration,
    duration_unit,
    DURATION_UNITS[duration_unit],
  );
  const editItemWidth = '65%';
  return (
    <View style={{width: '100%', padding: 12}}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          backgroundColor: theme.palette.secondary.main,
          borderRadius: 4,
        }}>
        <ItemString item={workoutItem} prefix="" schemeType={schemeType} />
      </View>

      {hasSets ? (
        <View
          style={{
            flexDirection: 'row',
            height: 35,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
            marginTop: 4,
          }}>
          <TSCaptionText textStyles={{textAlign: 'center'}}>Sets</TSCaptionText>
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
                {borderRadius: 4, backgroundColor: theme.palette.darkGray},
              ]}
              label="Sets"
              value={newSets === 0 ? '' : newSets.toString()}
              isError={setsError.length > 0}
              helperText={setsError}
              onChangeText={(t: string) => {
                let val = '';

                val = limitTextLength(numFilter(t), MaxDigits);

                const {success, errorType, errorMsg} = props.editItem(
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
            height: 35,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
          }}>
          <TSCaptionText textStyles={{textAlign: 'center'}}>Reps</TSCaptionText>
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
                {borderRadius: 4, backgroundColor: theme.palette.darkGray},
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
                  WORKOUT_TYPES[props.schemeType] == CREATIVE_W
                ) {
                  val = limitTextLength(numFilter(t), MaxDigits);
                } else {
                  val = limitTextLength(numFilterWithSpaces(t), MaxDigits);
                }

                const {success, errorType, errorMsg} = props.editItem(
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
            height: 35,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
          }}>
          <TSCaptionText textStyles={{textAlign: 'center'}}>
            Duration ({DURATION_UNITS[oldDurationUnit]})
          </TSCaptionText>
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
                  {borderRadius: 4, backgroundColor: theme.palette.darkGray},
                ]}
                onChangeText={t => {
                  let val = '';

                  if (
                    WORKOUT_TYPES[props.schemeType] == STANDARD_W ||
                    WORKOUT_TYPES[props.schemeType] == REPS_W ||
                    WORKOUT_TYPES[props.schemeType] == CREATIVE_W
                  ) {
                    val = limitTextLength(numFilter(t), MaxDigits);
                  } else {
                    val = limitTextLength(numFilterWithSpaces(t), MaxDigits);
                  }

                  const {success, errorType, errorMsg} = props.editItem(
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

                  props.editItem(
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
                  },
                  inputIOSContainer: {
                    alignItems: 'center',
                  },
                  inputIOS: {
                    color: theme.palette.text,
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

              {/* <Picker
                ref={durationUnitPickRef}
                selectedValue={newDurationUnit}
                style={pickerStyle.containerStyle}
                itemStyle={[
                  pickerStyle.itemStyle,
                  {
                    color: theme.palette.text,
                    backgroundColor: theme.palette.gray,
                  },
                ]}
                onValueChange={(itemValue, itemIndex) => {
                  setNewDurationUnit(itemValue);

                  props.editItem(
                    props.workoutIdx,
                    props.itemIdx,
                    'duration_unit',
                    itemIndex,
                  );
                }}>
                {DURATION_UNITS.map((unit, i) => {
                  return (
                    <Picker.Item
                      key={`${id}_duration_${unit}`}
                      label={unit}
                      value={i}
                    />
                  );
                })}
              </Picker> */}
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
            height: 35,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
          }}>
          <TSCaptionText textStyles={{textAlign: 'center'}}>
            Distance ({DISTANCE_UNITS[oldDistanceUnit]})
          </TSCaptionText>
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
                  {borderRadius: 4, backgroundColor: theme.palette.darkGray},
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
                    WORKOUT_TYPES[props.schemeType] == CREATIVE_W
                  ) {
                    // updateItem('distance', numFilter(t))
                    val = limitTextLength(numFilter(t), MaxDigits);
                  } else {
                    // updateItem('distance', numFilterWithSpaces(t))
                    val = limitTextLength(numFilterWithSpaces(t), MaxDigits);
                  }
                  const {success, errorType, errorMsg} = props.editItem(
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

                  props.editItem(
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
                  },
                  inputIOSContainer: {
                    alignItems: 'center',
                  },
                  inputIOS: {
                    color: theme.palette.text,
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

              {/* <Picker
                ref={distanceUnitPickRef}
                selectedValue={newDistanceUnit}
                style={pickerStyle.containerStyle}
                itemStyle={[
                  pickerStyle.itemStyle,
                  {
                    color: theme.palette.text,
                    backgroundColor: theme.palette.gray,
                  },
                ]}
                onValueChange={(itemValue, itemIndex) => {
                  setNewDistanceUnit(itemValue);

                  props.editItem(
                    props.workoutIdx,
                    props.itemIdx,
                    'distance_unit',
                    itemIndex,
                  );
                }}>
                {DISTANCE_UNITS.map((unit, i) => {
                  return (
                    <Picker.Item
                      key={`${id}_distance_${unit}`}
                      label={unit}
                      value={i}
                    />
                  );
                })}
              </Picker> */}
            </View>
          </View>
        </View>
      ) : (
        <></>
      )}

      {
        <View
          style={{
            flexDirection: 'row',
            height: 35,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
          }}>
          <TSCaptionText textStyles={{textAlign: 'center'}}>
            Weights
          </TSCaptionText>
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
                  {borderRadius: 4, backgroundColor: theme.palette.darkGray},
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
                  val = limitTextLength(numFilterWithSpaces(t), MaxDigits);
                } else {
                  val = limitTextLength(numFilter(t), MaxDigits);
                }

                const {success, errorType, errorMsg} = props.editItem(
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
      }
      {
        <View
          style={{
            flexDirection: 'row',
            height: 45,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
          }}>
          <TSCaptionText textStyles={{textAlign: 'center'}}>
            Weight Unit ({oldWeightUnit})
          </TSCaptionText>
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
                        backgroundColor: theme.palette.darkGray,
                      },
                    ],
                    {width: '100%'},
                  ]}
                  onChangeText={t => {
                    let val = t; // No need to filter as of now.

                    const {success, errorType, errorMsg} = props.editItem(
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
                    props.editItem(
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
                    },
                    inputIOSContainer: {
                      alignItems: 'center',
                    },
                    inputIOS: {
                      color: theme.palette.text,
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

                {/* <Picker
                  ref={weightUnitPickRef}
                  style={pickerStyle.containerStyle}
                  itemStyle={[
                    pickerStyle.itemStyle,
                    {
                      color: theme.palette.text,
                      backgroundColor: theme.palette.gray,
                    },
                  ]}
                  selectedValue={newWeightUnit}
                  onValueChange={(itemValue, itemIndex) => {
                    setNewWeightUnit(itemValue);
                    props.editItem(
                      props.workoutIdx,
                      props.itemIdx,
                      'weight_unit',
                      itemValue,
                    );
                  }}>
                  {WEIGHT_UNITS.map((unit, i) => {
                    return (
                      <Picker.Item
                        key={`${id}_weight_${unit}`}
                        label={unit}
                        value={unit}
                      />
                    );
                  })}
                </Picker> */}
              </View>
            </View>
          </View>
        </View>
      }
    </View>
  );
};

const EditWorkout: FunctionComponent<{
  workout: WorkoutCardProps;
  editItem(
    workoutIdx: number,
    itemIdx: number,
    key: string,
    value: string | number,
  );
  workoutIdx: number;
}> = props => {
  const {workout} = props;
  console.log('Workout infoooo ', workout.title, '\n');
  return (
    <View style={{width: '100%', marginVertical: 12}}>
      <View
        style={{
          width: '100%',
          justifyContent: 'space-between',
          alignContent: 'center',
          flexDirection: 'row',
          paddingHorizontal: 15,
        }}>
        <TSParagrapghText>Edit {workout.title}</TSParagrapghText>
        <TSParagrapghText>
          {displayJList(workout.scheme_rounds)}
        </TSParagrapghText>
      </View>
      <View style={{width: '100%', paddingLeft: 45}}>
        {/* {workout.workout_items?.map((item, i) => {
          return (
            <EditWorkoutItem
              key={`edititem_${item.id}`}
              workoutItem={item}
              schemeType={workout.scheme_type}
              editItem={props.editItem}
              itemIdx={i}
              workoutIdx={props.workoutIdx}
            />
          );
        })} */}
      </View>
    </View>
  );
};

const CreateCompletedWorkoutScreen: FunctionComponent<Props> = ({
  navigation,
  route: {params},
}) => {
  const theme = useTheme();
  // Access/ send actions
  const dispatch = useAppDispatch();

  // todo() put this in state,....
  let initGroup = jsonCopy(params) as WorkoutGroupProps;
  const [editedWorkoutGroup, setEditedWorkoutGroup] =
    useState<WorkoutGroupProps>(initGroup);
  const [showCompleteWorkout, setShowCompleteWorkout] = useState(false);
  const [files, setFiles] = useState<ImageOrVideo[]>();
  const [caption, setCaption] = useState('');
  const [forDate, setForDate] = useState<Date>(new Date());
  const [selectedWorkoutIdx, setSelectedWorkoutIdx] = useState(-1);

  const [createCompletedWorkout, {isLoading}] =
    useCreateCompletedWorkoutMutation();

  const editItem = (
    workoutIdx,
    itemIdx,
    key,
    value,
  ): {success: boolean; errorType: number; errorMsg: string} => {
    // console.log("Editing item: ", newWorkoutGroup.workouts[workoutIdx].workout_items[itemIdx], value)
    // Before updating the item we need to verify it....
    // Here we just have
    const newWorkoutGroup = {...editedWorkoutGroup} as WorkoutGroupProps;
    if (
      !newWorkoutGroup.workouts ||
      workoutIdx >= newWorkoutGroup.workouts.length
    ) {
      return {success: false, errorType: 11, errorMsg: 'Workouts not found'};
    }

    const workout = newWorkoutGroup.workouts[workoutIdx];
    if (!workout.workout_items || itemIdx >= workout.workout_items.length) {
      return {
        success: false,
        errorType: 10,
        errorMsg: 'Workout items not found',
      };
    }

    const item = workout.workout_items[itemIdx];
    console.log('Settings key', key, value, item);
    if (
      [
        'sets',
        'weight_unit',
        'percent_of',
        'duration_unit',
        'distance_unit',
      ].indexOf(key) >= 0
    ) {
      item[key] = value;
    } else {
      item[key] = jList(value);
    }

    const {success, errorType, errorMsg} = verifyWorkoutItem(
      item,
      workout.scheme_type,
      workout.scheme_rounds,
    );

    if (success) {
      console.log('New workout group', newWorkoutGroup);
      setEditedWorkoutGroup({...newWorkoutGroup});
    } else {
      console.log('Error editing item for Complete Workout Item', item);
    }

    return {success, errorType, errorMsg};
  };

  const editDualItem = (
    workoutIdx,
    itemIdx,
    key,
    value,
  ): {success: boolean; errorType: number; errorMsg: string} => {
    const newWorkoutGroup = jsonCopy(editedWorkoutGroup) as WorkoutGroupProps;
    if (
      !newWorkoutGroup.workouts ||
      workoutIdx >= newWorkoutGroup.workouts.length
    ) {
      console.log('Err dualitem: ', 'Workouts not found');
      return {success: false, errorType: 11, errorMsg: 'Workouts not found'};
    }

    const workout = newWorkoutGroup.workouts[workoutIdx];
    if (!workout.workout_items || itemIdx >= workout.workout_items.length) {
      console.log('Err dualitem: ', 'Workout items not found');
      return {
        success: false,
        errorType: 10,
        errorMsg: 'Workout items not found',
      };
    }

    const item = workout.workout_items[itemIdx];
    console.log('Settings key', `r_${key}`, value, item);
    if (
      [
        'sets',
        'weight_unit',
        'percent_of',
        'duration_unit',
        'distance_unit',
      ].indexOf(key) >= 0
    ) {
      item[`r_${key}`] = value;
    } else {
      item[`r_${key}`] = jList(value);
    }

    setEditedWorkoutGroup(jsonCopy(newWorkoutGroup));

    return {
      success: true,
      errorType: -1,
      errorMsg: '',
    };
  };

  const [isCreating, setIsCreating] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const completeWorkout = async () => {
    setShowCompleteWorkout(false);

    setIsCreating(true);
    console.log(
      'Creating completed workout group!',
      editedWorkoutGroup.workouts ? editedWorkoutGroup.workouts[0] : '',
    );
    if (
      !editedWorkoutGroup.workouts ||
      editedWorkoutGroup.workouts?.length == 0
    ) {
      console.log('NO workouts, cannot complete.');
      return;
    }

    const data = new FormData();

    data.append('title', editedWorkoutGroup.title);
    data.append('caption', caption);
    data.append('for_date', dateFormat(forDate));
    data.append('workouts', JSON.stringify(editedWorkoutGroup.workouts));
    data.append('workout_group', editedWorkoutGroup.id);
    console.log(
      'Creating comp workout - workouts: ',
      JSON.stringify(editedWorkoutGroup.workouts),
    );

    if (files) {
      files.forEach(file => {
        console.log('Uploading files ', file.path);
        // Path Android:  file:///data/user/0/com.fitform/cache/react-native-image-crop-picker/Screenshot_20221118-114259.png
        data.append('files', {
          uri: file.path,
          name: file.path,
          type: file.mime,
        });
      });
    }

    const res = await createCompletedWorkout(data).unwrap();
    console.log('CompltedWG formdata: ', data);
    console.log('CompltedWG res: ', res);
    if (res.id) {
      navigation.goBack();
    } else if (res.err_type === 1 || res.detail) {
      setShowAlert(true);
    }
    setIsCreating(false);
  };

  const selectedIdxIsvalid = () => {
    return (
      editedWorkoutGroup.workouts &&
      selectedWorkoutIdx >= 0 &&
      selectedWorkoutIdx < editedWorkoutGroup.workouts?.length
    );
  };

  const selectedWorkout: WorkoutCardProps =
    editedWorkoutGroup.workouts && selectedWorkoutIdx >= 0
      ? editedWorkoutGroup.workouts[selectedWorkoutIdx]
      : ({workout_items: []} as unknown as WorkoutCardProps);

  const numWorkouts = editedWorkoutGroup.workouts?.length ?? 0;
  const workoutScrollViewSectionFlex = numWorkouts > 2 ? 4 : 1;
  console.log(
    'editedWorkoutGroup.workouts?.length ',
    numWorkouts,
    workoutScrollViewSectionFlex,
  );
  return (
    <PageContainer>
      <View style={{width: '100%', flex: 1}}>
        <View style={{flex: 1}}>
          <TSParagrapghText textStyles={{textAlign: 'center'}}>
            Complete: {params.title}
          </TSParagrapghText>
          <View style={{height: 35, marginTop: 16}}>
            <Input
              onChangeText={t =>
                setCaption(
                  limitTextLength(t, CompletedWorkoutGroupCaptionLimit),
                )
              }
              value={caption}
              containerStyle={{
                width: '100%',
                backgroundColor: theme.palette.darkGray,
                borderRadius: 8,
                paddingHorizontal: 8,
              }}
              leading={
                <Icon
                  name="information-circle-outline"
                  style={{fontSize: 16}}
                  color={theme.palette.text}
                />
              }
              label=""
              placeholder="Caption"
            />
          </View>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            margin: 10,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}>
          <TSCaptionText textStyles={{textAlign: 'center', paddingLeft: 16}}>
            For:{' '}
          </TSCaptionText>
          <DatePicker
            date={forDate}
            onDateChange={setForDate}
            mode="date"
            locale="en"
            fadeToColor={theme.palette.darkGray}
            textColor={theme.palette.text}
            style={{height: SCREEN_HEIGHT * 0.06, transform: [{scale: 0.65}]}}
          />
        </View>

        {/* <View style={{flex: 1}}>
          <MediaPicker setState={setFiles.bind(this)} title="Select Media" />
        </View>
        {files && files.length > 0 ? (
          <View style={{flex: 3}}>
            <MediaSlider data={files} />
          </View>
        ) : (
          <></>
        )} */}
        <View style={{flex: workoutScrollViewSectionFlex}}>
          <ScrollView>
            <View style={{flex: 3}}>
              <TSParagrapghText>Edit workouts below</TSParagrapghText>

              {editedWorkoutGroup.workouts?.map((workout, i) => {
                return (
                  <TouchableHighlight
                    onPress={() => setSelectedWorkoutIdx(i)}
                    key={`editworkout_${workout.id}`}
                    underlayColor={
                      selectedWorkoutIdx === i
                        ? theme.palette.tertiary.main
                        : theme.palette.primary.main
                    }
                    style={{
                      backgroundColor:
                        selectedWorkoutIdx === i
                          ? theme.palette.primary.main
                          : theme.palette.tertiary.main,
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                      marginVertical: 3,
                    }}>
                    <EditWorkout
                      workout={workout}
                      editItem={editItem}
                      workoutIdx={i}
                    />
                  </TouchableHighlight>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <View style={{flex: 7}}>
          <ScrollView>
            <View>
              {selectedIdxIsvalid() ? (
                selectedWorkout.workout_items?.map((item, i) => {
                  const isD = isDual(item);
                  console.log('Complete workout isD: ', isD, item);
                  return !isD ? (
                    <EditWorkoutItem
                      key={`edititem_${selectedWorkoutIdx}_${item.id}`}
                      workoutItem={item}
                      schemeType={selectedWorkout.scheme_type}
                      editItem={editItem}
                      itemIdx={i}
                      workoutIdx={selectedWorkoutIdx}
                    />
                  ) : (
                    <ScrollView
                      style={{flex: 1, height: '100%'}}
                      key={`edititem_${selectedWorkoutIdx}_${item.id}`}>
                      <View style={{height: '100%', padding: 12}}>
                        <View
                          style={{
                            backgroundColor: theme.palette.secondary.main,
                            borderRadius: 4,
                          }}>
                          <ItemString
                            item={item}
                            schemeType={selectedWorkout.scheme_type}
                            prefix="Total completed for: "
                            color={theme.palette.lightGray}
                          />
                        </View>
                        <View style={{marginBottom: 12}}>
                          <EditWorkoutDualItem
                            editDualItem={editDualItem}
                            itemIdx={i}
                            workoutIdx={selectedWorkoutIdx}
                            schemeType={selectedWorkout.scheme_type}
                            workoutItem={item}
                            greyInputBackground={true}
                            key={`editdualitem_${selectedWorkoutIdx}_${item.id}`}
                          />
                        </View>
                      </View>
                    </ScrollView>
                  );
                })
              ) : (
                <></>
              )}
            </View>
          </ScrollView>
        </View>
        <View style={{flex: 1, justifyContent: 'center', marginBottom: 2}}>
          {!isCreating ? (
            <RegularButton
              onPress={() => setShowCompleteWorkout(true)}
              btnStyles={{
                backgroundColor: theme.palette.darkGray,
              }}
              text="Complete!"
            />
          ) : (
            <ActivityIndicator size="small" color={theme.palette.text} />
          )}
        </View>
      </View>

      <ActionCancelModal
        actionText="Complete"
        closeText="Close"
        modalText={'Complete workout?'}
        onAction={completeWorkout}
        modalVisible={showCompleteWorkout}
        onRequestClose={() => setShowCompleteWorkout(false)}
      />

      <AlertModal
        closeText="Close"
        bodyText="Failed to complete workout: non-members can only create or complete 1 workout per day. All users have 15 workouts per day limit."
        modalVisible={showAlert}
        onRequestClose={() => setShowAlert(false)}
      />
    </PageContainer>
  );
};

export default CreateCompletedWorkoutScreen;
