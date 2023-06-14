import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {RegularButton} from '../../app_components/Buttons/buttons';
import Input, {AutoCaptilizeEnum} from '../../app_components/Input/input';
import {RegularText, SmallText} from '../../app_components/Text/Text';
import {useTheme} from 'styled-components';

interface CodeResetPasswordProps {
  resetPasswordError: string;
  setAuthMode(authMode: number): void;
  resetEmailError: string;
  validEmailRegex: RegExp;
  resetEmail: string;
  resetPassword: string;
  resetCode: string;
  hideResetPassword: boolean;
  setHideResetPassword(hide: boolean): void;
  changePassword(): void;
  setResetPassword(text: string): void;
  setResetEmailError(text: string): void;
  setResetEmail(text: string): void;
  setResetCode(text: string): void;
}

const CodeResetPasswordPage: FunctionComponent<CodeResetPasswordProps> = ({
  resetPasswordError,
  resetEmailError,
  validEmailRegex,
  resetEmail,
  resetPassword,
  resetCode,
  setHideResetPassword,
  hideResetPassword,
  setResetPassword,
  changePassword,
  setAuthMode,
  setResetEmailError,
  setResetEmail,
  setResetCode,
}) => {
  const theme = useTheme();
  return (
    <View style={{flex: 10}}>
      <RegularText textStyles={{textAlign: 'center', marginBottom: 16}}>
        Enter Code
      </RegularText>
      <SmallText textStyles={{textAlign: 'center', marginBottom: 16}}>
        to
      </SmallText>
      <RegularText textStyles={{textAlign: 'center', marginBottom: 16}}>
        Reset Password
      </RegularText>
      <RegularText textStyles={{textAlign: 'center', marginBottom: 16}}>
        {resetPasswordError}
      </RegularText>

      <View style={{height: 45, marginBottom: 16}}>
        <Input
          containerStyle={{
            backgroundColor: theme.palette.gray,
            borderTopStartRadius: 8,
            borderTopEndRadius: 8,
          }}
          label=""
          placeholder="Email"
          fontSize={16}
          isError={resetEmailError.length > 0}
          helperText={resetEmailError}
          autoCapitalize={AutoCaptilizeEnum.None}
          onChangeText={(_email: string) => {
            if (!validEmailRegex.test(_email)) {
              setResetEmailError('Invalid email');
            } else if (resetEmailError.length) {
              setResetEmailError('');
            }
            setResetEmail(_email);
          }}
          inputStyles={{paddingLeft: 24}}
          value={resetEmail}
        />
      </View>
      <View style={{height: 45, marginBottom: 16}}>
        <Input
          onChangeText={setResetCode}
          autoCapitalize={AutoCaptilizeEnum.None}
          label=""
          placeholder="Reset code"
          containerStyle={{
            backgroundColor: theme.palette.gray,
            borderTopStartRadius: 8,
            borderTopEndRadius: 8,
          }}
          fontSize={16}
          value={resetCode}
          inputStyles={{paddingLeft: 24}}
        />
      </View>

      <View style={{height: 45, marginBottom: 16}}>
        <Input
          containerStyle={{
            backgroundColor: theme.palette.gray,

            borderTopStartRadius: 8,
            borderTopEndRadius: 8,
          }}
          label=""
          placeholder="Password"
          fontSize={16}
          value={resetPassword}
          onChangeText={setResetPassword}
          secureTextEntry={hideResetPassword}
          autoCapitalize={AutoCaptilizeEnum.None}
          inputStyles={{paddingLeft: 24}}
          trailing={
            <Icon
              name="eye"
              style={{fontSize: 24, color: theme.palette.text}}
              onPress={() => setHideResetPassword(!hideResetPassword)}
            />
          }
        />
      </View>

      <View style={{flexDirection: 'row', marginTop: 16}}>
        <View style={{height: 45, width: '100%', paddingHorizontal: 8}}>
          <RegularButton
            onPress={() => {
              changePassword();
            }}
            btnStyles={{
              backgroundColor: theme.palette.primary.main,
            }}
            text="Reset"
          />
        </View>
      </View>
    </View>
  );
};

export default CodeResetPasswordPage;
