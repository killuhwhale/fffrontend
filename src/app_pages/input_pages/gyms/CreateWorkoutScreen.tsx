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
import {
  SmallText,
  TSCaptionText,
  TSListTitleText,
  TSParagrapghText,
} from '../../../app_components/Text/Text';
import {
  Container,
  SCREEN_HEIGHT,
  WORKOUT_TYPES,
  STANDARD_W,
  ROUNDS_W,
  CREATIVE_W,
  REPS_W,
  numFilter,
  numFilterWithSpaces,
  parseNumList,
  jList,
  mdFontSize,
  limitTextLength,
  WorkoutDualItemCreativePenaltyLimit,
  WorkoutTitleLimit,
  WorkoutDescLimit,
  SchemeTextLimit,
  CreateSchemeInstructionLimit,
} from '../../../app_components/shared';
import {useAppDispatch} from '../../../redux/hooks';
import {
  useCreateWorkoutMutation,
  useCreateWorkoutItemsMutation,
  useCreateWorkoutDualItemsMutation,
} from '../../../redux/api/apiSlice';

import {RootStackParamList} from '../../../navigators/RootStack';
import {StackScreenProps} from '@react-navigation/stack';
import {
  WorkoutDualItemProps,
  WorkoutItemProps,
} from '../../../app_components/Cards/types';
import {
  AnimatedButton,
  RegularButton,
} from '../../../app_components/Buttons/buttons';

import Input from '../../../app_components/Input/input';

import ItemString from '../../../app_components/WorkoutItems/ItemString';
import {TestIDs} from '../../../utils/constants';
import AddItem from './AddWorkoutItemPanel';
import AlertModal from '../../../app_components/modals/AlertModal';
import CreateWorkoutItemList from './workoutScreen/CreateWorkoutItemList';
import CreateWorkoutDualItemList from './workoutScreen/CreateWorkoutDualItemList';
import SchemeField from './workoutScreen/Schemes';
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

export const ColorPalette: FunctionComponent<{
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

type WorkoutItems = WorkoutItemProps[] | WorkoutDualItemProps[];

const CreateWorkoutScreen: FunctionComponent<Props> = ({
  navigation,
  route: {
    params: {workoutGroupID, workoutGroupTitle, schemeType},
  },
}) => {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [schemeRounds, setSchemeRounds] = useState('');
  const [instruction, setInstruction] = useState('');

  const _items: WorkoutItems = [];
  const [items, setItems] = useState(_items);

  const [showAddSSID, setShowAddSSID] = useState(false);
  const [curColor, setCurColor] = useState(-1);
  const [createWorkout, {isLoading: workoutIsLoading}] =
    useCreateWorkoutMutation();
  const [createWorkoutItem, {isLoading: workoutItemIsLoading}] =
    useCreateWorkoutItemsMutation();

  const [createWorkoutDualItem, {isLoading: workoutDualItemIsLoading}] =
    useCreateWorkoutDualItemsMutation();

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
    workoutData.append('instruction', instruction);
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
      let createdItems;
      if (schemeType <= 2) {
        // For reg, reps, and rounds type workouts, the description is the prescription.
        createdItems = await createWorkoutItem(data).unwrap();
      } else {
        // For Time based workouts, or do you best workouts, we store prescription and record separately
        createdItems = await createWorkoutDualItem(data).unwrap();
      }
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

  const addPenalty = (penalty: string, selectedIdx: number) => {
    if (items.length > 0) {
      const updatedItems = items.map((item: WorkoutDualItemProps, idx) => {
        if (idx === selectedIdx) {
          item.penalty = penalty;
        }
        return item;
      });

      setItems(updatedItems);
    }
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
      <View style={{flex: 1, justifyContent: 'center', width: '100%'}}>
        <TSParagrapghText textStyles={{textAlign: 'center'}}>
          Create Workout
        </TSParagrapghText>
        <TSCaptionText textStyles={{textAlign: 'center'}}>
          {workoutGroupTitle}
        </TSCaptionText>
      </View>

      {createWorkoutError.length ? (
        <TSCaptionText>{createWorkoutError}</TSCaptionText>
      ) : (
        <></>
      )}

      <View
        style={{
          flex:
            [REPS_W, ROUNDS_W, CREATIVE_W].indexOf(WORKOUT_TYPES[schemeType]) >=
            0
              ? 3
              : 2,
          justifyContent: 'center',
          width: '100%',
        }}>
        <View style={{height: 35, marginBottom: 8}}>
          <Input
            onChangeText={t => {
              setTitle(limitTextLength(t, WorkoutTitleLimit));
              setCreateWorkoutError('');
              setIsCreating(false);
            }}
            value={title}
            label=""
            testID={TestIDs.CreateWorkoutTitleField.name()}
            placeholder="Title"
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
            onChangeText={t => setDesc(limitTextLength(t, WorkoutDescLimit))}
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

        <SchemeField
          schemeType={schemeType}
          schemeRounds={schemeRounds}
          setSchemeRounds={t =>
            setSchemeRounds(limitTextLength(t, SchemeTextLimit))
          }
          setInstruction={t =>
            setInstruction(limitTextLength(t, CreateSchemeInstructionLimit))
          }
          schemeRoundsError={schemeRoundsError}
          setSchemeRoundsError={setSchemeRoundsError}
          instruction={instruction}
        />
      </View>

      <View
        style={{
          flex: 4,
          width: '100%',
          justifyContent: 'center',
        }}>
        <AddItem onAddItem={addWorkoutItem} schemeType={schemeType} />
      </View>

      <View
        style={{
          flex: 6,
          justifyContent: 'flex-start',
          alignContent: 'flex-start',
          alignItems: 'flex-start',
          height: '100%',
          width: '100%',
        }}>
        <View style={{height: '100%', width: '100%', marginTop: 8}}>
          {schemeType <= 2 ? (
            <CreateWorkoutItemList
              items={items}
              schemeType={schemeType}
              curColor={curColor}
              showAddSSID={showAddSSID}
              setShowAddSSID={setShowAddSSID}
              setCurColor={setCurColor}
              removeItemSSID={removeItemSSID}
              addItemToSSID={addItemToSSID}
              updateItemConstant={updateItemConstant}
              removeItem={removeItem}
            />
          ) : (
            <CreateWorkoutDualItemList
              items={items as WorkoutDualItemProps[]}
              schemeType={schemeType}
              removeItem={removeItem}
              addPenalty={addPenalty}
            />
          )}
        </View>
      </View>
      <View style={{flex: 1, width: '100%', justifyContent: 'center'}}>
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
