import React, {FunctionComponent, useState, useRef} from 'react';
import {useTheme} from 'styled-components';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native-gesture-handler';
import {TouchableHighlight, View} from 'react-native';
import {
  Container,
  displayJList,
  DURATION_W,
  jList,
  numFilter,
  numFilterWithSpaces,
  REPS_W,
  ROUNDS_W,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  STANDARD_W,
  WEIGHT_UNITS,
  WORKOUT_TYPES,
} from '../../../app_components/shared';
import {Button} from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';

import {StackScreenProps} from '@react-navigation/stack';
import DatePicker from 'react-native-date-picker';
import {ImageOrVideo} from 'react-native-image-crop-picker';

import {
  SmallText,
  RegularText,
  LargeText,
  TitleText,
} from '../../../app_components/Text/Text';
import {useAppDispatch} from '../../../redux/hooks';
import {useCreateCompletedWorkoutMutation} from '../../../redux/api/apiSlice';

import {RootStackParamList} from '../../../navigators/RootStack';
import {MediaPicker} from './CreateWorkoutGroupScreen';
import {MediaSlider} from '../../../app_components/MediaSlider/MediaSlider';
import {
  WorkoutCardProps,
  WorkoutGroupProps,
  WorkoutItemProps,
} from '../../../app_components/Cards/types';
import {
  ItemString,
  numberInputStyle,
  pickerStyle,
  verifyWorkoutItem,
} from './CreateWorkoutScreen';
import {ActionCancelModal} from '../../Profile';
import {dateFormat} from '../../StatsScreen';
export type Props = StackScreenProps<
  RootStackParamList,
  'CreateCompletedWorkoutScreen'
>;
import Input from '../../../app_components/Input/input';

const PageContainer = styled(Container)`
  background-color: ${props => props.theme.palette.backgroundColor};
  justify-content: space-between;
  width: 100%;
`;

// Convert a JSON stringified list to a space demilimited string

const jListToNumStr = jsonListStr => {
  try {
    const list = JSON.parse(jsonListStr);
    return list.toString().replaceAll(',', ' ');
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
  const {sets, reps, duration, distance, weights, weight_unit, percent_of} =
    workoutItem;

  const weightUnitPickRef = useRef<any>();

  const [newWeights, setNewWeights] = useState(jListToNumStr(weights)); // Json string list of numbers.
  const [newSets, setNewSets] = useState(sets); // Need this for Standard workouts.
  const [newReps, setNewReps] = useState(jListToNumStr(reps));
  const [newDuration, setNewDuration] = useState(jListToNumStr(duration));
  const [newDistance, setNewDistance] = useState(jListToNumStr(distance));
  const [newWeightUnit, setNewWeightUnit] = useState(weight_unit);
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
    <View style={{width: '100%'}}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
        }}>
        <ItemString item={workoutItem} schemeType={schemeType} />
      </View>

      {hasSets ? (
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
                {borderRadius: 4, backgroundColor: theme.palette.lightGray},
              ]}
              label="Sets"
              value={newSets === 0 ? '' : newSets.toString()}
              isError={setsError.length > 0}
              helperText={setsError}
              onChangeText={(t: string) => {
                let val = '';

                val = numFilter(t);

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
              width: editItemWidth,
            }}>
            <Input
              inputStyles={{textAlign: 'center'}}
              containerStyle={[
                numberInputStyle.containerStyle,
                {borderRadius: 4, backgroundColor: theme.palette.lightGray},
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
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
          }}>
          <SmallText textStyles={{textAlign: 'center'}}>Duration</SmallText>
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
                {borderRadius: 4, backgroundColor: theme.palette.lightGray},
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
        </View>
      ) : (
        <></>
      )}
      {hasDistance && props.schemeType !== 0 ? (
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
          }}>
          <SmallText textStyles={{textAlign: 'center'}}>Distance</SmallText>
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
                {borderRadius: 4, backgroundColor: theme.palette.lightGray},
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
        </View>
      ) : (
        <></>
      )}
      {
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
                  {borderRadius: 4, backgroundColor: theme.palette.lightGray},
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
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
          }}>
          <SmallText textStyles={{textAlign: 'center'}}>Weight Unit</SmallText>
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
                        backgroundColor: theme.palette.lightGray,
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
        <RegularText>Edit {workout.title}</RegularText>
        <RegularText>{displayJList(workout.scheme_rounds)}</RegularText>
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
  let initGroup = JSON.parse(JSON.stringify(params)) as WorkoutGroupProps;
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
    if (['sets', 'weight_unit', 'percent_of'].indexOf(key) >= 0) {
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

  const completeWorkout = async () => {
    setShowCompleteWorkout(false);
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
    }
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

  return (
    <PageContainer>
      <View style={{width: '100%', flex: 1}}>
        <View style={{flex: 1}}>
          <RegularText textStyles={{textAlign: 'center'}}>
            Complete: {params.title}
          </RegularText>
        </View>

        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{height: 40, marginTop: 16}}>
            <Input
              onChangeText={setCaption}
              value={caption}
              fontSize={16}
              containerStyle={{
                width: '100%',
                backgroundColor: theme.palette.lightGray,
                borderRadius: 8,
                paddingHorizontal: 8,
              }}
              leading={
                <Icon
                  name="checkmark-circle-outline"
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
            width: '100%',
          }}>
          <SmallText textStyles={{textAlign: 'center', paddingLeft: 16}}>
            For:{' '}
          </SmallText>
          <DatePicker
            date={forDate}
            onDateChange={setForDate}
            mode="date"
            locale="en"
            fadeToColor={theme.palette.lightGray}
            textColor={theme.palette.text}
            style={{height: SCREEN_HEIGHT * 0.06, transform: [{scale: 0.65}]}}
          />
        </View>
        <View style={{flex: 5}}>
          <ScrollView>
            <View style={{flex: 1}}>
              <MediaPicker
                setState={setFiles.bind(this)}
                title="Select Media"
              />
            </View>
            {files && files.length > 0 ? (
              <View style={{flex: 1}}>
                <MediaSlider data={files} />
              </View>
            ) : (
              <></>
            )}

            <View style={{flex: 3}}>
              <RegularText>Edit workouts below</RegularText>

              {editedWorkoutGroup.workouts?.map((workout, i) => {
                return (
                  <TouchableHighlight
                    onPress={() => setSelectedWorkoutIdx(i)}
                    key={`editworkout_${workout.id}`}
                    style={{
                      backgroundColor:
                        selectedWorkoutIdx === i
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
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
            <View>
              {selectedIdxIsvalid() ? (
                selectedWorkout.workout_items?.map((item, i) => {
                  return (
                    <EditWorkoutItem
                      key={`edititem_${selectedWorkoutIdx}_${item.id}`}
                      workoutItem={item}
                      schemeType={selectedWorkout.scheme_type}
                      editItem={editItem}
                      itemIdx={i}
                      workoutIdx={selectedWorkoutIdx}
                    />
                  );
                })
              ) : (
                <></>
              )}
            </View>
          </ScrollView>
        </View>
        <View style={{flex: 1}}>
          <Button
            title="Complete!"
            onPress={() => setShowCompleteWorkout(true)}
            style={{backgroundColor: theme.palette.lightGray}}
          />
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
    </PageContainer>
  );
};

export default CreateCompletedWorkoutScreen;
