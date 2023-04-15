import React, {FunctionComponent, useState} from 'react';
import styled from 'styled-components/native';
import {Container} from '../app_components/shared';
import {
  SmallText,
  RegularText,
  LargeText,
  TitleText,
} from '../app_components/Text/Text';
import Icon from 'react-native-vector-icons/Ionicons';

// import { withTheme } from 'styled-components'
import {useTheme} from 'styled-components';
import {useCreateUserMutation} from '../redux/api/apiSlice';
import AuthManager from '../utils/auth';
import * as RootNavigation from '../navigators/RootNavigation';
import {View} from 'react-native';
import Input, {AutoCaptilizeEnum} from '../app_components/Input/input';
import {ResetPassword} from '../app_components/email/email';
import {validEmailRegex} from '../utils/algos';
import {post} from '../utils/fetchAPI';
import {BASEURL, TestIDs} from '../utils/constants';
import {RegularButton} from '../app_components/Buttons/buttons';

// import { RootStackParamList } from "../navigators/RootStack";
// import { StackScreenProps } from "@react-navigation/stack";
// export type Props = StackScreenProps<RootStackParamList, "AuthScreen">

const PageContainer = styled(Container)`
  background-color: ${props => props.theme.palette.backgroundColor};
  justify-content: space-between;

  width: 100%;
  height: 100%;
`;

const AuthContainer = styled.View`
  width: 80%;
  padding-top: 45px;
`;

const AuthScreen: FunctionComponent = () => {
  const theme = useTheme();
  // Access value
  // Access/ send actions
  const auth = AuthManager;
  // 0 - Sign in
  // 1 - Sign up
  // 2 - Forgot Password
  // 3 - Reset Password code page thing
  const authModes = [0, 1, 2, 3];
  const [authMode, setAuthMode] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [emailHelperText, setEmailHelperText] = useState('');
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

  const [registerUser, {isLoading: registerUserLoading}] =
    useCreateUserMutation();
  const [newEmail, setNewEmail] = useState('');
  const [newEmailHelperText, setNewEmailHelperText] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [mismatchPasswordText, setMismatchPasswordText] = useState('');

  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');
  const [resetPasswordError, setResetPasswordError] = useState('');
  const [hideResetPassword, setHideResetPassword] = useState(true);

  const login = async () => {
    console.log('Send login: ', email, password);
    if (emailHelperText.length > 0) {
      setEmailHelperText('');
    }
    auth.login(email, password);
  };

  auth.listenLogin((loggedIn, msg) => {
    console.log('AuthScreen.tsx listenLogin: ', loggedIn, msg);

    if (!loggedIn) {
      if (msg == 'No active account found with the given credentials') {
        setEmailHelperText('Confirm your email!');
      } else {
        setEmailHelperText(msg);
      }
    }
  }, 'authscreen');

  const onEmailChange = (text: string) => {
    // Todo add debounce to allow user to enter last few chars and then check...
    if (text.indexOf('@') >= 0 && text.indexOf('.') >= 0) {
      if (!reg.test(text)) {
        setEmailHelperText('Invalid email');
      } else {
        setEmailHelperText('');
      }
    } else if (emailHelperText != '') {
      setEmailHelperText('');
    }
    setEmail(text);
  };

  const onPasswordChange = (text: string) => {
    setPassword(text);
  };

  const onNewEmailChange = (text: string) => {
    if (text.indexOf('@') >= 0 && text.indexOf('.') >= 0) {
      if (!reg.test(text)) {
        setNewEmailHelperText('Invalid email');
      } else {
        setNewEmailHelperText('');
      }
    } else if (newEmailHelperText != '') {
      setNewEmailHelperText('');
    }
    setNewEmail(text);
  };

  const onNewPasswordChange = (text: string) => {
    setNewPassword(text);
  };

  const onNewPasswordConfirmChange = (text: string) => {
    if (text.length >= newPassword.length && newPassword !== text) {
      console.log('Show error on helper text with Password confirm');
      setMismatchPasswordText('Passwords do not match');
    } else {
      setMismatchPasswordText('');
    }
    setNewPasswordConfirm(text);
  };

  const register = async () => {
    if (newEmailHelperText.length > 0) {
      setNewEmailHelperText('');
    }

    if (newEmail.length <= 0 || newPassword !== newPasswordConfirm) {
      console.log('Unable to register user');
      return;
    }

    if (!registerUserLoading) {
      if (!reg.test(newEmail)) {
        console.log('Invalid email');
        setNewEmailHelperText('Invalid Email');
        return;
      }
      console.log('Registering: ', newEmail, newPassword, newPasswordConfirm);
      const data = new FormData();
      data.append('email', newEmail);
      data.append('password', newPassword);
      data.append('username', newEmail);
      const res = await registerUser(data).unwrap();
      console.log('Sign up res: ', res);
      if (res?.username) {
        console.log('Created user, refresh auth.', res);
        setAuthMode(0);
      } else if (
        res.email !== undefined &&
        res.email[0] == 'user with this email address already exists.'
      ) {
        console.log('EMAIL TAKENENENENEN');
        setNewEmailHelperText('Email taken');
      }
    }
  };

  const changePassword = async () => {
    console.log('Changing password: ', resetEmail, resetCode, resetPassword);
    if (resetPasswordError.length > 0) {
      setResetPasswordError('');
    }

    const res = await post(`${BASEURL}user/reset_password/`, {
      email: resetEmail,
      reset_code: resetCode,
      new_password: resetPassword,
    }).then(res => res.json());
    console.log('res', res);
    if (res.data) {
      setAuthMode(0);
      setResetCode('');
      setResetEmail('');
      setResetPassword('');
    } else {
      setResetPasswordError(res.error);
    }
  };

  // RootNavigation.navigate("HomePage", {})
  return (
    <PageContainer>
      <AuthContainer>
        {authModes[authMode] == 0 ? (
          <View style={{height: '100%'}} testID="signInScreen">
            <View style={{justifyContent: 'space-evenly', height: '35%'}}>
              <RegularText textStyles={{textAlign: 'center', marginBottom: 16}}>
                Sign In
              </RegularText>
              <View style={{height: 55, marginBottom: 16}}>
                <Input
                  testID={TestIDs.SignInEmailField.name()}
                  onChangeText={onEmailChange.bind(this)}
                  autoCapitalize={AutoCaptilizeEnum.None}
                  label=""
                  isError={emailHelperText.length > 0}
                  placeholder="Email"
                  containerStyle={{
                    backgroundColor: theme.palette.gray,
                    borderTopStartRadius: 8,
                    borderTopEndRadius: 8,
                    height: '100%',
                  }}
                  fontSize={16}
                  value={email}
                  leading={
                    <Icon name="person" style={{color: theme.palette.text}} />
                  }
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
              <View style={{height: 45, width: '50%', paddingHorizontal: 8}}>
                <RegularButton
                  testID={TestIDs.AuthSignUpBtn.name()}
                  onPress={() => {
                    setAuthMode(1);
                  }}
                  btnStyles={{backgroundColor: theme.palette.secondary.main}}>
                  Sign Up
                </RegularButton>
              </View>
              <View style={{height: 45, width: '50%', paddingHorizontal: 8}}>
                <RegularButton
                  testID={TestIDs.SignInSubmit.name()}
                  onPress={() => {
                    login();
                  }}
                  btnStyles={{backgroundColor: theme.palette.primary.main}}>
                  Sign In
                </RegularButton>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 64,
              }}>
              <View style={{height: 45, width: '80%', paddingHorizontal: 8}}>
                <RegularButton
                  onPress={() => {
                    setAuthMode(2);
                  }}
                  btnStyles={{backgroundColor: theme.palette.lightGray}}>
                  Forgot Password
                </RegularButton>
              </View>
            </View>

            <View style={{flex: 1}} />
          </View>
        ) : authModes[authMode] == 1 ? (
          <View style={{height: '100%'}}>
            <View
              style={{
                height: '35%',
                alignContent: 'space-between',
                justifyContent: 'space-evenly',
              }}>
              <RegularText textStyles={{textAlign: 'center', marginBottom: 16}}>
                Sign Up
              </RegularText>
              <View style={{height: 45, marginBottom: 16}}>
                <Input
                  testID={TestIDs.AuthSignUpEmail.name()}
                  onChangeText={onNewEmailChange.bind(this)}
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
                  leading={
                    <Icon name="person" style={{color: theme.palette.text}} />
                  }
                  helperText={newEmailHelperText}
                />
              </View>

              <View style={{height: 45, marginBottom: 16}}>
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

              <View style={{height: 45, marginBottom: 16}}>
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
                  onChangeText={onNewPasswordConfirmChange.bind(this)}
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
            <View style={{flex: 2, flexDirection: 'row'}}>
              <View style={{width: '50%', height: 45, paddingHorizontal: 8}}>
                <RegularButton
                  onPress={() => {
                    setAuthMode(0);
                  }}
                  btnStyles={{backgroundColor: theme.palette.lightGray}}>
                  Back
                </RegularButton>
              </View>
              <View style={{width: '50%', height: 45, paddingHorizontal: 8}}>
                <RegularButton
                  testID={TestIDs.AuthSignUpRegisterBtn.name()}
                  onPress={() => {
                    register();
                  }}
                  btnStyles={{
                    backgroundColor: theme.palette.primary.main,
                  }}>
                  Register
                </RegularButton>
              </View>
            </View>
            <View style={{flex: 1}} />
          </View>
        ) : authModes[authMode] == 2 ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-evenly',
              marginBottom: 32,
              marginTop: 64,
            }}>
            <ResetPassword />

            <View style={{flexDirection: 'row', marginTop: 64}}>
              <View style={{height: 45, width: '50%', paddingHorizontal: 8}}>
                <RegularButton
                  onPress={() => {
                    setAuthMode(0);
                  }}
                  btnStyles={{
                    backgroundColor: theme.palette.lightGray,
                  }}>
                  Back
                </RegularButton>
              </View>
              <View style={{height: 45, width: '50%', paddingHorizontal: 8}}>
                <RegularButton
                  onPress={() => {
                    setAuthMode(3);
                  }}
                  btnStyles={{
                    backgroundColor: theme.palette.primary.main,
                  }}>
                  Enter Code
                </RegularButton>
              </View>
            </View>
          </View>
        ) : (
          <View>
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
                inputStyles={{paddingLeft: 8}}
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
              <View style={{height: 45, width: '50%', paddingHorizontal: 8}}>
                <RegularButton
                  onPress={() => {
                    setAuthMode(2);
                  }}
                  btnStyles={{
                    backgroundColor: theme.palette.lightGray,
                  }}>
                  Back
                </RegularButton>
              </View>
              <View style={{height: 45, width: '50%', paddingHorizontal: 8}}>
                <RegularButton
                  onPress={() => {
                    changePassword();
                  }}
                  btnStyles={{
                    backgroundColor: theme.palette.primary.main,
                  }}>
                  Reset
                </RegularButton>
              </View>
            </View>
          </View>
        )}
      </AuthContainer>
    </PageContainer>
  );
};

export default AuthScreen;
