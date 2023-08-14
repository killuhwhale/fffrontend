import React, {FunctionComponent, useEffect, useState} from 'react';
import {TSParagrapghText, TSCaptionText, TSTitleText} from '../Text/Text';

import {Modal, TouchableHighlight, View} from 'react-native';

import {useTheme} from 'styled-components';
import {RegularButton} from '../Buttons/buttons';

import {centeredViewStyle, modalViewStyle} from './modalStyles';
import {SCREEN_WIDTH} from '../shared';

const PenaltyDisplayModal: FunctionComponent<{
  modalVisible: boolean;
  onRequestClose(): void;
  closeText: string;
  bodyText: string;
}> = ({modalVisible, onRequestClose, closeText, bodyText}) => {
  const theme = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onRequestClose}>
      <View style={centeredViewStyle.centeredView}>
        <TouchableHighlight
          onPress={() => onRequestClose()}
          style={[
            centeredViewStyle.centeredView,
            {width: '100%', height: '100%'},
          ]}
          underlayColor={theme.palette.transparent}
          activeOpacity={0.9}>
          <View
            style={{
              ...modalViewStyle.modalView,
              backgroundColor: theme.palette.darkGray,
              height: '40%',
              width: SCREEN_WIDTH * 0.75,
            }}>
            <View
              style={{
                height: '100%',
                flex: 1,
                justifyContent: 'space-between',
              }}>
              <View>
                <TSTitleText textStyles={{textAlign: 'center'}}>
                  Penalty
                </TSTitleText>
              </View>
              <View>
                <TSCaptionText>{bodyText}</TSCaptionText>
              </View>
              <RegularButton
                onPress={() => {
                  onRequestClose();
                }}
                btnStyles={{
                  backgroundColor: theme.palette.tertiary.main,
                }}
                text="Close"
              />
            </View>
          </View>
        </TouchableHighlight>
      </View>
    </Modal>
  );
};

export default PenaltyDisplayModal;
