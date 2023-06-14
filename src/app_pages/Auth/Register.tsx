import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {RegularButton} from '../../app_components/Buttons/buttons';
import Input, {AutoCaptilizeEnum} from '../../app_components/Input/input';
import {RegularText, SmallText} from '../../app_components/Text/Text';
import {TestIDs} from '../../utils/constants';
import {useTheme} from 'styled-components';

interface RegisterCompProps {
  registerError: string;
  newEmail: string;
  newEmailHelperText: string;
  newPassword: string;
  hideNewPassword: boolean;
  newPasswordConfirm: string;
  mismatchPasswordText: string;
  onNewEmailChange(text: string): void;
  onNewPasswordChange(text: string): void;
  onNewPasswordConfirmChange(text: string): void;
  setHideNewPassword(hide: boolean): void;
  setAuthMode(authMode: number): void;
  register(): void;
}

const RegisterComp: FunctionComponent<RegisterCompProps> = ({
  registerError,
  newEmail,
  newEmailHelperText,
  newPassword,
  hideNewPassword,
  newPasswordConfirm,
  mismatchPasswordText,
  onNewEmailChange,
  onNewPasswordChange,
  setHideNewPassword,
  onNewPasswordConfirmChange,
  setAuthMode,
  register,
}) => {
  const theme = useTheme();
  return (
    <View style={{flex: 10}}>
      <View
        style={{
          height: '35%',
          alignContent: 'space-between',
          justifyContent: 'space-evenly',
          flex: 4,
        }}>
        <RegularText textStyles={{textAlign: 'center', marginBottom: 16}}>
          Sign Up
        </RegularText>
        <SmallText textStyles={{textAlign: 'center', marginVertical: 8}}>
          {registerError}
        </SmallText>
        <View style={{height: 45, marginBottom: 24}}>
          <Input
            testID={TestIDs.AuthSignUpEmail.name()}
            keyboardType="email-address"
            onChangeText={onNewEmailChange}
            autoCapitalize={AutoCaptilizeEnum.None}
            label=""
            isError={newEmailHelperText.length > 0}
            placeholder="Email"
            containerStyle={{
              backgroundColor: theme.palette.gray,
              borderTopStartRadius: 8,
              borderTopEndRadius: 8,
            }}
            fontSize={16}
            value={newEmail}
            leading={<Icon name="person" style={{color: theme.palette.text}} />}
            helperText={newEmailHelperText}
          />
        </View>

        <View style={{height: 45, marginBottom: 24}}>
          <Input
            testID={TestIDs.AuthSignUpPassword.name()}
            containerStyle={{
              backgroundColor: theme.palette.gray,
              paddingLeft: 16,
              borderTopStartRadius: 8,
              borderTopEndRadius: 8,
            }}
            label=""
            placeholder="Password"
            fontSize={16}
            value={newPassword}
            onChangeText={onNewPasswordChange.bind(this)}
            secureTextEntry={hideNewPassword}
            trailing={
              <Icon
                name="eye"
                style={{fontSize: 24, color: theme.palette.text}}
                onPress={() => setHideNewPassword(!hideNewPassword)}
              />
            }
          />
        </View>

        <View style={{height: 45}}>
          <Input
            testID={TestIDs.AuthSignUpPasswordConfirm.name()}
            containerStyle={{
              backgroundColor: theme.palette.gray,
              paddingLeft: 16,
              borderTopStartRadius: 8,
              borderTopEndRadius: 8,
            }}
            placeholder="Password Confirm"
            fontSize={16}
            label=""
            value={newPasswordConfirm}
            onChangeText={onNewPasswordConfirmChange}
            secureTextEntry={hideNewPassword}
            helperText={mismatchPasswordText}
            isError={mismatchPasswordText.length > 0}
            trailing={
              <Icon
                name="eye"
                style={{fontSize: 24, color: theme.palette.text}}
                onPress={() => setHideNewPassword(!hideNewPassword)}
              />
            }
          />
        </View>
      </View>

      <View style={{flex: 5, flexDirection: 'row', marginTop: 32}}>
        <View
          style={{
            width: '100%',
            height: 45,
            paddingHorizontal: 8,
            justifyContent: 'center',
          }}>
          <RegularButton
            testID={TestIDs.AuthSignUpRegisterBtn.name()}
            onPress={() => {
              register();
            }}
            btnStyles={{
              backgroundColor: theme.palette.primary.main,
            }}
            text="Register"
          />
        </View>
      </View>
      <View style={{flex: 1}} />
    </View>
  );
};

export default RegisterComp;
