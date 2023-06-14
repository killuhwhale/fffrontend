import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import {RegularButton} from '../../app_components/Buttons/buttons';
import {TestIDs} from '../../utils/constants';
import {RegularText} from '../../app_components/Text/Text';
import Input, {AutoCaptilizeEnum} from '../../app_components/Input/input';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from 'styled-components';

interface SignInProps {
  email: string;
  emailHelperText: string;
  onEmailChange(text: string): void;
  onPasswordChange(text: string): void;
  password: string;
  hidePassword: boolean;
  setHidePassword(hide: boolean): void;
  login(): void;
  setAuthMode(authMode: number): void;
}

const SignInComp: FunctionComponent<SignInProps> = ({
  onEmailChange,
  emailHelperText,
  onPasswordChange,
  hidePassword,
  setHidePassword,
  password,
  login,
  setAuthMode,
  email,
}) => {
  const theme = useTheme();
  return (
    <View style={{flex: 1, width: '100%'}} testID="signInScreen">
      <View style={{justifyContent: 'space-evenly', height: '35%'}}>
        <RegularText textStyles={{textAlign: 'center', marginBottom: 16}}>
          Sign In
        </RegularText>
        <View style={{height: 55, marginBottom: 16}}>
          <Input
            testID={TestIDs.SignInEmailField.name()}
            onChangeText={onEmailChange}
            autoCapitalize={AutoCaptilizeEnum.None}
            label=""
            isError={emailHelperText.length > 0}
            placeholder="Email"
            keyboardType="email-address"
            containerStyle={{
              backgroundColor: theme.palette.gray,
              borderTopStartRadius: 8,
              borderTopEndRadius: 8,
              height: '100%',
            }}
            fontSize={16}
            value={email}
            leading={<Icon name="person" style={{color: theme.palette.text}} />}
            helperText={emailHelperText}
          />
        </View>
        <View style={{height: 55, marginBottom: 16}}>
          <Input
            testID={TestIDs.SignInPasswordField.name()}
            onChangeText={onPasswordChange.bind(this)}
            label=""
            placeholder="Password"
            containerStyle={{
              backgroundColor: theme.palette.gray,
              borderTopStartRadius: 8,
              borderTopEndRadius: 8,
            }}
            fontSize={16}
            value={password}
            secureTextEntry={hidePassword}
            leading={
              <Icon
                name="person"
                style={{color: theme.palette.text}}
                onPress={() => setHidePassword(!hidePassword)}
              />
            }
          />
        </View>
      </View>

      <View style={{flexDirection: 'row'}}>
        <View style={{height: 45, width: '100%', paddingHorizontal: 8}}>
          <RegularButton
            testID={TestIDs.SignInSubmit.name()}
            onPress={() => {
              login();
            }}
            btnStyles={{backgroundColor: theme.palette.primary.main}}
            text="Sign In"
          />
        </View>
      </View>

      <View style={{flex: 1}} />
    </View>
  );
};

export default SignInComp;
