import 'react-native-gesture-handler';
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import HomePage from './src/app_pages/home';
import RootStack from './src/navigators/RootStack';
import {DefaultTheme, ThemeProvider, useTheme} from 'styled-components/native';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {LargeText, RegularText} from './src/app_components/Text/Text';
import {store} from './src/redux/store';
import {Provider} from 'react-redux';
import {navigationRef} from './src/navigators/RootNavigation';
import Header from './src/app_components/Header/header';
import {
  apiSlice,
  getToken,
  useGetUserInfoQuery,
} from './src/redux/api/apiSlice';
import AuthManager from './src/utils/auth';
import AuthScreen from './src/app_pages/AuthScreen';
import Uploady from '@rpldy/native-uploady';
import {BASEURL} from './src/utils/constants';
import {useAppDispatch} from './src/redux/hooks';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const primaryColor = '#007cff';
const secondaryColor = '#006d77';
const red = '#e63946';

const d_text = '#f1faee';
const d_lightGray = '#474747';
const d_gray = '#2c365a';
const d_darkGray = '#2d2d2d';
const d_background = '#000814';

const l_text = '#283618';
const l_lightGray = '#a8dadc';
const l_gray = '#457b9d';
const l_darkGray = '#1d3557';
const l_background = '#f1faee';

const DarkTheme: DefaultTheme = {
  borderRadius: '8px',
  palette: {
    primary: {
      main: primaryColor,
      contrastText: '#fff',
    },
    secondary: {
      main: secondaryColor,
      contrastText: '#fff',
    },
    tertiary: {
      main: '#007cff',
      contrastText: '#fff',
    },
    accent: '#00f5d4',
    transparent: '#34353578',

    text: d_text,
    backgroundColor: d_background,
    lightGray: d_lightGray,
    gray: d_gray,
    darkGray: d_darkGray,
  },
};

const LightTheme: DefaultTheme = {
  borderRadius: '8px',
  palette: {
    primary: {
      main: primaryColor,
      contrastText: '#fff',
    },
    secondary: {
      main: secondaryColor,
      contrastText: '#fff',
    },
    tertiary: {
      main: '#007cff',
      contrastText: '#fff',
    },
    accent: '#fbcd77',
    transparent: '#34353578',
    text: l_text,
    backgroundColor: l_background,
    lightGray: l_lightGray,
    gray: l_gray,
    darkGray: l_darkGray,
  },
};

// Todo
// Create an auth class to manage the current state of auth.
// Global object, separate file.
// WHen log in => setUser and callback for auth events, for now at least logout.

// In this component we register a function to the AuthManagement,
// This fn will change the state of the variable to not show the app anymore.
// This fn is called by the manager when the user logs out, manager will also clear the data from async storage.

// TODO
// Figure out auth flow, ex,
// When a user opens app, we make a reuest.

// we get the user, logged in
// else we are not logged in

// TODO
// we get an error for expired access tokem => we get new one w/ refresh token and reattempt request
// we get an error for expired refresh token => we are not logged in.

// Google auth would be nice here too...

const ERR_CODE_BAD_AUTH_HEADER = 'bad_authorization_header';
const ERR_CODE_BAD_TOKEN = 'token_not_valid';
const ERR_CODE_INVALID_TOKEN = 'token_not_valid';
const ERR_MESSAGE_INVALID_EXPIRED = 'Token is invalid or expired';

const TOKEN_TYPE_ACCESS = 'access';
const TOKEN_TYPE_REFRESH = 'refresh';

const Auth: FunctionComponent<{children: Array<ReactNode>}> = props => {
  const auth = AuthManager;

  // This will check if we have a valid token by sending a request to server for user info.
  // This either loads the app or login page.
  const {data, isLoading, isSuccess, isError, error} = useGetUserInfoQuery('');
  const [loggedIn, setLoggedIn] = useState(false);

  if (
    (data?.email?.length > 0 || data?.username?.length > 0) &&
    !loggedIn &&
    !isError &&
    !isLoading &&
    isSuccess
  ) {
    setLoggedIn(true);
  }

  auth.listenLogout(() => {
    console.log('Listened for logout');

    setLoggedIn(false);
  });

  auth.listenLogin(() => {
    console.log('Listne for login');
    console.log('Should log in');
    console.log(isError);
    setLoggedIn(true);
  });

  console.log(
    'Auth: ',
    'logged iN:',
    loggedIn,
    'isLoading:',
    isLoading,
    'Data:',
    data,
    'isError:',
    isError,
  );
  console.log('Err: ', error);
  return (
    <>
      {isLoading ? (
        <RegularText>Loading...</RegularText>
      ) : isSuccess || (loggedIn && isError) ? (
        <>{loggedIn ? <>{props.children[0]}</> : <>{props.children[1]}</>}</>
      ) : isError ? (
        <>{props.children[1]}</>
      ) : (
        <></>
      )}
    </>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  console.log("User's preffered color scheme", useColorScheme(), isDarkMode);
  const theme = useTheme();
  return (
    <Provider store={store}>
      <ThemeProvider theme={DarkTheme}>
        <Uploady destination={{url: `${BASEURL}`}}>
          <React.StrictMode>
            <GestureHandlerRootView style={{flex: 1}}>
              <SafeAreaView>
                {/* <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} /> */}
                <StatusBar barStyle={'dark-content'} />
                <Header />
              </SafeAreaView>
              <Auth>
                <RootStack navref={navigationRef} />
                <AuthScreen />
              </Auth>
            </GestureHandlerRootView>
          </React.StrictMode>
        </Uploady>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
