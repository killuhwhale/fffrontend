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
  TSCaptionText,
  TSParagrapghText,
} from '../../../../app_components/Text/Text';
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
  TIMESCORE_W,
  TIMELIMIT_W,
} from '../../../../app_components/shared';
import {COLORSPALETTE, ColorPalette} from '../CreateWorkoutScreen';
import {
  WorkoutDualItemProps,
  WorkoutItemProps,
} from '../../../../app_components/Cards/types';
import ItemString from '../../../../app_components/WorkoutItems/ItemString';
import {AnimatedButton} from '../../../../app_components/Buttons/buttons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import PenaltyModal from '../../../../app_components/modals/PenaltyModal';

const hasPenalty = (item: WorkoutDualItemProps) => {
  return item.penalty?.length && item.penalty?.length > 0;
};

const CreateWorkoutDualItemList: FunctionComponent<{
  items: WorkoutDualItemProps[];
  schemeType: number;
  removeItem(n: number): void;
  addPenalty(penalty: string, selectedIdx: number): void;
}> = ({items, schemeType, removeItem, addPenalty}) => {
  const theme = useTheme();
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [curItem, setCurItem] = useState(0);
  const [text, setText] = useState('');
  return (
    <View style={{flex: 4, width: '100%', height: '100%'}}>
      <ScrollView style={{marginTop: 12}}>
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
                  <ItemString item={item} schemeType={schemeType} prefix="" />
                </View>
                <View
                  style={{
                    flex: 6,
                    backgroundColor: theme.palette.darkGray,
                    paddingVertical: 3,
                    borderRadius: 8,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setCurItem(idx);
                      setText(hasPenalty(item) ? item.penalty! : '');
                      setShowPenaltyModal(true);
                    }}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      borderRadius: 8,
                    }}>
                    {hasPenalty(item) ? (
                      <TSCaptionText textStyles={{textAlign: 'center'}}>
                        {item.penalty}
                      </TSCaptionText>
                    ) : (
                      <TSCaptionText>Penalty +</TSCaptionText>
                    )}
                  </TouchableOpacity>
                  {/* </View>
                <View style={{flex: 1}}> */}
                </View>
              </View>
            </AnimatedButton>
          );
        })}
      </ScrollView>
      <PenaltyModal
        bodyText="Add your penalty: i.e. 10 reps every 1mins. "
        closeText="Close"
        modalVisible={showPenaltyModal}
        onRequestClose={() => setShowPenaltyModal(false)}
        curItem={curItem}
        setText={setText}
        text={text}
        onAction={addPenalty}
      />
    </View>
  );
};

export default CreateWorkoutDualItemList;
