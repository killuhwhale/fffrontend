import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import {RegularButton} from '../../app_components/Buttons/buttons';
import {TestIDs} from '../../utils/constants';
import {TSParagrapghText} from '../../app_components/Text/Text';
import Input, {AutoCaptilizeEnum} from '../../app_components/Input/input';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from 'styled-components';

import ResetPasswordViaEmail from '../../app_components/passwords/resetPasswordViaEmail';

interface ResetPasswordAuthPageProps {
  setAuthMode(authMode: number): void;
}
// Forgot Password
const ResetPasswordAuthPage: FunctionComponent<ResetPasswordAuthPageProps> = ({
  setAuthMode,
}) => {
  const theme = useTheme();
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flex: 10,
      }}>
      <View style={{flex: 3, justifyContent: 'center'}}>
        <ResetPasswordViaEmail />
      </View>
      <View style={{flex: 7}}></View>
    </View>
  );
};

export default ResetPasswordAuthPage;
