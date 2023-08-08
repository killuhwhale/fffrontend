import React, {FunctionComponent, useEffect, useState} from 'react';
import {MediumText, RegularText, SmallText} from '../Text/Text';

import {Modal, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from 'styled-components';
import {RegularButton} from '../Buttons/buttons';
import Input from '../Input/input';
import {SCREEN_WIDTH, mdFontSize} from '../shared';
import {centeredViewStyle, modalViewStyle} from './modalStyles';

const PenaltyModal: FunctionComponent<{
  modalVisible: boolean;
  onRequestClose(): void;
  closeText: string;
  bodyText: string;
  text: string;
  curItem: number;
  onAction(penalty: string, selectedIdx: number): void;
  setText(text: string);
}> = ({
  modalVisible,
  onRequestClose,
  closeText,
  bodyText,
  curItem,
  onAction,
  setText,
  text,
}) => {
  const theme = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onRequestClose}>
      <View style={centeredViewStyle.centeredView}>
        <View
          style={{
            ...modalViewStyle.modalView,
            backgroundColor: theme.palette.darkGray,
            height: '90%',
          }}>
          <View style={{height: '100%', justifyContent: 'space-between'}}>
            <View style={{marginTop: 20, flex: 2}}>
              <MediumText>{bodyText}</MediumText>
            </View>

            <View style={{marginBottom: 50, flex: 9}}>
              <Input
                placeholder="Penalty"
                onChangeText={setText}
                value={text}
                label="Penalty"
                containerStyle={{
                  width: '100%',
                  backgroundColor: theme.palette.backgroundColor,
                  borderRadius: 8,
                  paddingHorizontal: 8,
                }}
                fontSize={mdFontSize}
                leading={
                  <Icon
                    name="flame"
                    color={theme.palette.text}
                    style={{fontSize: mdFontSize}}
                  />
                }
              />
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <RegularButton
                onPress={() => {
                  setText('');
                  onRequestClose();
                }}
                btnStyles={{
                  height: 40,
                  width: SCREEN_WIDTH * 0.25,
                  backgroundColor: theme.palette.tertiary.main,
                }}
                text={closeText}
              />
              <RegularButton
                onPress={() => {
                  onAction(text, curItem);
                  setText('');
                  onRequestClose();
                }}
                btnStyles={{
                  height: 40,
                  width: SCREEN_WIDTH * 0.25,
                  backgroundColor: theme.palette.tertiary.main,
                }}
                text="Submit"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PenaltyModal;
