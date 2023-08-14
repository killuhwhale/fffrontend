import React, {FunctionComponent, useEffect, useState} from 'react';
import {TSCaptionText, TSParagrapghText} from '../Text/Text';
import {useTheme} from 'styled-components';
import {Modal, View} from 'react-native';
import {centeredViewStyle, modalViewStyle} from './modalStyles';
import Input from '../Input/input';
import {mdFontSize} from '../shared';
import Icon from 'react-native-vector-icons/Ionicons';
import {RegularButton} from '../Buttons/buttons';
import twrnc from 'twrnc';

const lightRed = twrnc.color('bg-red-400');
const darkRed = twrnc.color('bg-red-900');

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
            <TSCaptionText>In order to delete, type</TSCaptionText>
          </View>
          <View style={{marginBottom: 8}}>
            <TSParagrapghText textStyles={{color: theme.palette.tertiary.main}}>
              {props.confirmName}
            </TSParagrapghText>
          </View>
          <View style={{marginBottom: 8}}>
            <TSCaptionText>and press Delete</TSCaptionText>
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
                  backgroundColor: theme.palette.tertiary.main,
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
                backgroundColor: theme.palette.gray,
              }}
              text={props.closeText}
            />

            <RegularButton
              onPress={() =>
                isValid() ? props.onAction() : console.log('Invalid name')
              }
              underlayColor={isValid() ? '' : lightRed}
              btnStyles={{
                marginLeft: 4,
                backgroundColor: isValid() ? darkRed : lightRed,
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
