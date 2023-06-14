import 'react-native-gesture-handler';
import React, {
  FunctionComponent,
  useEffect,
  useState,
  PropsWithChildren,
} from 'react';
import RootStack from './src/navigators/RootStack';
import {DefaultTheme, ThemeProvider, useTheme} from 'styled-components/native';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {store} from './src/redux/store';
import {Provider} from 'react-redux';
import {navigationRef} from './src/navigators/RootNavigation';
import Header from './src/app_components/Header/header';
import {apiSlice, getToken} from './src/redux/api/apiSlice';

import AuthScreen from './src/app_pages/AuthScreen';
import Uploady from '@rpldy/native-uploady';
import {BASEURL} from './src/utils/constants';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import auth from './src/utils/auth';
import twrnc from 'twrnc';

const primaryColor = twrnc.color('bg-sky-800');
const secondaryColor = twrnc.color('bg-emerald-900');
const tertiaryColor = twrnc.color('bg-violet-500');

const d_accent = twrnc.color('bg-sky-400');
const d_text = twrnc.color('bg-slate-50');
const d_lightGray = twrnc.color('bg-slate-300');
const d_gray = twrnc.color('bg-slate-500');
const d_darkGray = twrnc.color('bg-slate-700');
const d_background = twrnc.color('bg-slate-900');

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
      main: tertiaryColor,
      contrastText: '#fff',
    },
    accent: d_accent,
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

const AuthNew: FunctionComponent<PropsWithChildren> = props => {
  // This will check if we have a valid token by sending a request to server for user info.
  // This either loads the app or login page.

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const a = async () => {
      const token = await getToken();
      if (token && token.length > 0) {
        setLoggedIn(true);
      }
    };

    auth.listenLogout(() => {
      console.log('Listened for logout, setLoggedIn');
      setLoggedIn(false);
    });
    console.log('Use effect is being called!!!');

    auth.listenLogin((loggedIn, msg) => {
      console.log('App.tsx listenLogin: ', loggedIn, msg);
      if (loggedIn) {
        console.log('Listne for login');
        console.log('Should log in');
        store.dispatch(
          apiSlice.util.invalidateTags([
            'Gyms',
            'UserGyms',
            'User',
            'UserAuth',
            'GymClasses',
            'GymClassWorkoutGroups',
            'UserWorkoutGroups',
            'WorkoutGroupWorkouts',
            'Coaches',
            'Members',
            'GymFavs',
            'GymClassFavs',
          ]),
        );

        setLoggedIn(true);
      }
    }, 'logInKey');

    a();
  }, []);

  return (
    <>
      {props && props.children ? (
        <>{loggedIn ? <>{props.children[0]}</> : <>{props.children[1]}</>}</>
      ) : (
        <></>
      )}
    </>
  );
};

//
//
//
//
//
//
const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  console.log("User's preffered color scheme", useColorScheme(), isDarkMode);
  const theme = useTheme();
  return (
    <Provider store={store}>
      <ThemeProvider theme={DarkTheme}>
        <Uploady destination={{url: `${BASEURL}`}}>
          {/* <React.StrictMode> */}
          <GestureHandlerRootView style={{flex: 1}}>
            <SafeAreaView>
              {/* <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} /> */}
              <StatusBar barStyle={'dark-content'} />
              <Header />
            </SafeAreaView>
            <AuthNew>
              <RootStack navref={navigationRef} />
              <AuthScreen />
            </AuthNew>
          </GestureHandlerRootView>
          {/* </React.StrictMode> */}
        </Uploady>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
