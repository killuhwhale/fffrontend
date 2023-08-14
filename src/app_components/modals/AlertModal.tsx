import React, {FunctionComponent} from 'react';
import {TSParagrapghText} from '../Text/Text';

import {Modal, View} from 'react-native';
import {useTheme} from 'styled-components';
import {RegularButton} from '../Buttons/buttons';
import {centeredViewStyle, modalViewStyle} from './modalStyles';

const AlertModal: FunctionComponent<{
  modalVisible: boolean;
  onRequestClose(): void;
  closeText?: string;
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
              <TSParagrapghText>{bodyText}</TSParagrapghText>
            </View>
            <RegularButton
              onPress={() => {
                onRequestClose();
              }}
              btnStyles={{
                backgroundColor: theme.palette.tertiary.main,
              }}
              text={closeText ?? 'Close'}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;
