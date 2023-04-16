import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  SmallText,
  RegularText,
  LargeText,
  TitleText,
  MediumText,
} from '../Text/Text';

import {useTheme} from 'styled-components';
import {Modal, View} from 'react-native';
import {centeredViewStyle, modalViewStyle} from './modalStyles';
import Input from '../Input/input';
import {mdFontSize} from '../shared';
import Icon from 'react-native-vector-icons/Ionicons';
import {RegularButton} from '../Buttons/buttons';

const DeleteActionCancelModal: FunctionComponent<{
  modalVisible: boolean;
  onRequestClose(): void;
  closeText: string;
  actionText: string;
  onAction(): void;
  confirmName: string;
}> = props => {
  const theme = useTheme();

  const [confirmText, setCofirmText] = useState('');

  const isValid = () => {
    return confirmText === props.confirmName;
  };

  useEffect(() => {
    setCofirmText('');
  }, [props]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={props.onRequestClose}>
      <View style={centeredViewStyle.centeredView}>
        <View
          style={{
            ...modalViewStyle.modalView,
            backgroundColor: theme.palette.darkGray,
          }}>
          <View style={{marginBottom: 8}}>
            <SmallText>In order to delete, type</SmallText>
          </View>
          <View style={{marginBottom: 8}}>
            <RegularText textStyles={{color: theme.palette.primary.main}}>
              {props.confirmName}
            </RegularText>
          </View>
          <View style={{marginBottom: 8}}>
            <SmallText>and press Delete</SmallText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}>
            <View style={{height: 50}}>
              <Input
                onChangeText={t => setCofirmText(t)}
                value={confirmText}
                containerStyle={{
                  width: '100%',
                  backgroundColor: theme.palette.lightGray,
                  borderRadius: 8,
                  paddingHorizontal: 8,
                }}
                fontSize={mdFontSize}
                leading={
                  <Icon
                    name="checkmark-circle-outline"
                    style={{fontSize: mdFontSize}}
                    color={theme.palette.text}
                  />
                }
                label=""
                placeholder={props.confirmName}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <RegularButton
              onPress={props.onRequestClose}
              btnStyles={{
                marginRight: 4,
                backgroundColor: theme.palette.lightGray,
              }}
              text={props.closeText}
            />

            <RegularButton
              onPress={() =>
                isValid() ? props.onAction() : console.log('Invalid name')
              }
              btnStyles={{
                marginLeft: 4,
                backgroundColor: isValid() ? 'red' : theme.palette.lightGray,
              }}
              text={props.actionText}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteActionCancelModal;
