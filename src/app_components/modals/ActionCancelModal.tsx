import React, {FunctionComponent} from 'react';

import {
  Modal,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import {RegularButton} from '../Buttons/buttons';
import {TSParagrapghText} from '../Text/Text';
import {centeredViewStyle, modalViewStyle} from './modalStyles';
import {useTheme} from 'styled-components';

const ActionCancelModal: FunctionComponent<{
  modalVisible: boolean;
  onRequestClose(): void;
  closeText: string;
  actionText: string;
  modalText: string;
  onAction(): void;
  containerStyle?: StyleProp<ViewStyle>;
}> = props => {
  const theme = useTheme();
  console.log('ACM: ', props.modalVisible);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => props.onRequestClose()}>
      <View
        style={[
          centeredViewStyle.centeredView,
          {backgroundColor: '#000000DD'},
        ]}>
        <TouchableOpacity
          style={[
            centeredViewStyle.centeredView,
            {width: '100%', height: '100%'},
          ]}
          onPress={() => props.onRequestClose()}>
          <View
            style={[
              modalViewStyle.modalView,
              {
                backgroundColor: theme.palette.darkGray,
              },
              props.containerStyle,
            ]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}>
              <TSParagrapghText>{props.modalText}</TSParagrapghText>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RegularButton
                onPress={props.onRequestClose}
                btnStyles={{
                  backgroundColor: '#DB4437',
                  marginRight: 4,
                }}
                text={props.closeText}
              />

              <RegularButton
                onPress={props.onAction}
                btnStyles={{
                  backgroundColor: theme.palette.primary.main,
                  marginLeft: 4,
                }}
                text={props.actionText}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ActionCancelModal;
