import React, {FunctionComponent, useState} from 'react';
import styled from 'styled-components/native';
import {Container} from '../app_components/shared';
// import { withTheme } from 'styled-components'
import {useTheme} from 'styled-components';
import AuthManager from '../utils/auth';
import {validEmailRegex} from '../utils/algos';
import {post} from '../utils/fetchAPI';
import {BASEURL} from '../utils/constants';
import SignInComp from './Auth/SignIn';
import RegisterComp from './Auth/Register';
import ResetPasswordAuthPage from './Auth/ResetPasswordAuthPage';
import CodeResetPasswordPage from './Auth/CodeResetPassword';
import AuthNavComp from './Auth/AuthNavComp';

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

  const [newEmail, setNewEmail] = useState('');
  const [newEmailHelperText, setNewEmailHelperText] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [mismatchPasswordText, setMismatchPasswordText] = useState('');
  const [registerError, setRegisterError] = useState('');

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
    setNewEmail(text);
  };

  const onPasswordChange = (text: string) => {
    setPassword(text);
    setNewPassword(text);
  };

  const onNewEmailChange = (text: string) => {
    if (registerError) {
      setRegisterError('');
    }

    if (text.indexOf('@') >= 0 && text.indexOf('.') >= 0) {
      if (!reg.test(text)) {
        setNewEmailHelperText('Invalid email');
      } else {
        setNewEmailHelperText('');
      }
    } else if (newEmailHelperText != '') {
      setNewEmailHelperText('');
    }
    setEmail(text);
    setNewEmail(text);
  };

  const onNewPasswordChange = (text: string) => {
    setNewPassword(text);
    setPassword(text);
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
    if (registerError.length > 0) {
      setRegisterError('');
    }

    if (newEmail.length <= 0 || newPassword !== newPasswordConfirm) {
      console.log('Unable to register user');
      return;
    }

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

    try {
      const res = await auth.register(data);
      console.log('Sign up res: ', res);

      if (res.id > 0) {
        setAuthMode(0);
      } else if (
        res.email[0] == 'user with this email address already exists.'
      ) {
        setRegisterError('Email taken!');
      }
    } catch (error) {
      console.log('Error registering:: ', error);
      setRegisterError('Error registering');
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
      <AuthContainer style={{flex: 10}}>
        {authModes[authMode] == 0 ? (
          <SignInComp
            email={email}
            emailHelperText={emailHelperText}
            hidePassword={hidePassword}
            login={login}
            onEmailChange={onEmailChange}
            onPasswordChange={onPasswordChange}
            password={password}
            setHidePassword={setHidePassword}
            setAuthMode={setAuthMode}
          />
        ) : authModes[authMode] == 1 ? (
          <RegisterComp
            hideNewPassword={hideNewPassword}
            mismatchPasswordText={mismatchPasswordText}
            newEmail={newEmail}
            newEmailHelperText={newEmailHelperText}
            newPassword={newPassword}
            newPasswordConfirm={newPasswordConfirm}
            onNewEmailChange={onNewEmailChange}
            onNewPasswordChange={onNewPasswordChange}
            onNewPasswordConfirmChange={onNewPasswordConfirmChange}
            register={register}
            registerError={registerError}
            setAuthMode={setAuthMode}
            setHideNewPassword={setHideNewPassword}
          />
        ) : authModes[authMode] == 2 ? (
          <ResetPasswordAuthPage setAuthMode={setAuthMode} />
        ) : (
          <CodeResetPasswordPage
            changePassword={changePassword}
            hideResetPassword={hideResetPassword}
            resetCode={resetCode}
            resetEmail={resetEmail}
            resetEmailError={resetEmailError}
            resetPassword={resetPassword}
            resetPasswordError={resetPasswordError}
            setAuthMode={setAuthMode}
            setHideResetPassword={setHideResetPassword}
            setResetCode={setResetCode}
            setResetEmail={setResetEmail}
            setResetEmailError={setResetEmailError}
            setResetPassword={setResetPassword}
            validEmailRegex={validEmailRegex}
          />
        )}
      </AuthContainer>
      <AuthNavComp
        authMode={authMode}
        authModes={authModes}
        setAuthMode={setAuthMode}
      />
    </PageContainer>
  );
};

export default AuthScreen;
