import React, {FunctionComponent, useEffect, useState} from 'react';
import {RegularText, SmallText} from '../Text/Text';

import {Modal, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from 'styled-components';
import {RegularButton} from '../Buttons/buttons';
import Input from '../Input/input';
import {mdFontSize} from '../shared';
import {centeredViewStyle, modalViewStyle} from './modalStyles';

const AlertModal: FunctionComponent<{
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
        <View
          style={{
            ...modalViewStyle.modalView,
            backgroundColor: theme.palette.darkGray,
            height: '90%',
          }}>
          <View
            style={{height: '100%', flex: 1, justifyContent: 'space-between'}}>
            <View style={{marginTop: 50}}>
              <RegularText>{bodyText}</RegularText>
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
      </View>
    </Modal>
  );
};

export default AlertModal;
