import 'react-native-gesture-handler';
import React, {
  FunctionComponent,
  useEffect,
  useState,
  PropsWithChildren,
} from 'react';
import RootStack from './src/navigators/RootStack';
import {DefaultTheme, ThemeProvider, useTheme} from 'styled-components/native';
import {EmitterSubscription, SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {store} from './src/redux/store';
import {Provider} from 'react-redux';
import {navigationRef} from './src/navigators/RootNavigation';
import Header from './src/app_components/Header/header';
import {apiSlice, getToken} from './src/redux/api/apiSlice';

import * as RootNavigation from './src/navigators/RootNavigation';

import AuthScreen from './src/app_pages/AuthScreen';
import Uploady from '@rpldy/native-uploady';
import {BASEURL} from './src/utils/constants';

import InAppPurchase, { initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  type ProductPurchase,
  type SubscriptionPurchase,
  type PurchaseError,
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid, } from 'react-native-iap';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import auth from './src/utils/auth';
import twrnc from 'twrnc';

const primaryColor = twrnc.color('bg-blue-600');
// const secondaryColor = twrnc.color('bg-emerald-900');
const secondaryColor = twrnc.color('bg-rose-900');
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


const deliverOrDownloadFancyInAppPurchase = async (receipt: string) => {
  const res = await fetch(`${BASEURL}/hooks/iap_webhook/`, {
    method: "POST",
    body: JSON.stringify({receipt}),
    headers: {
      "Content-Type": "application/json"
    }
  })

  const success = res['success']
  console.log("Res deliverOrDownloadFancyInAppPurchase: ", res, success)
  return success
}

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


  useEffect(() => {
    let purchaseListener: EmitterSubscription ;
    // Initialize react-native-iap
    initConnection().then(() => {
      // Set up a purchaseUpdatedListener
       purchaseListener = purchaseUpdatedListener( async (purchase: SubscriptionPurchase | ProductPurchase) => {
        console.log('purchaseUpdatedListener', purchase);
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          if(await deliverOrDownloadFancyInAppPurchase(receipt)){
            await finishTransaction({purchase, isConsumable: true});
          }
          
          // If not consumable
          // TODO() I need to update the backend to support payments from iOS users.
          {/**
          Currently, payments are made from stripe and we store a customer_id
          We listen for payments via Stripe webhooks and update the subscription accordingly.
          On the website, we use this customer_id to allow users to manage their subscription
          But now we will have users that have a subscribtion from iOS
          {
            autoRenewingAndroid?: boolean;
            originalTransactionDateIOS?: string;
            originalTransactionIdentifierIOS?: string;
          }
          So to prevent abuse or issue we need to validate this 
          We should store what type of subscription stripe or iOS AND
          We should store the originalTransactionIdentifierIOS & originalTransactionDateIOS
            - We will store the originalTransactionIdentifier and Date in separate table and we only need to query it when we validate a recipt
              - This will provide a history as well
          Then we can still check sub_end_date for membership.
          If we already have the recipt info AND the originalTransactionDateIOS plus 30 days is equal to sub_end_date can return from the API
          a TRUE indicating we have successfully delivered the IAP. Then the client will call finishPurchase to mark done on Apple's side. 

        
        
        
        */}
          

          // await finishTransaction({purchase, isConsumable: false});
          
          // yourAPI
          //   .deliverOrDownloadFancyInAppPurchase(
          //     purchase.transactionReceipt,
          //   )
          //   .then(async (deliveryResult) => {
          //     // if (isSuccess(deliveryResult)) {
          //     //   // Tell the store that you have delivered what has been paid for.
          //     //   // Failure to do this will result in the purchase being refunded on Android and
          //     //   // the purchase event will reappear on every relaunch of the app until you succeed
          //     //   // in doing the below. It will also be impossible for the user to purchase consumables
          //     //   // again until you do this.
                 // If consumable (can be purchased again)
                    //  await finishTransaction({purchase, isConsumable: true});
          //     // } else {
          //     //   // Retry / conclude the purchase is fraudulent, etc...
          //     // }
        }
      })

    })

    return () => {
      // Clean up when component unmounts
      if(purchaseListener){
        purchaseListener.remove();
      }
    };
  

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
  const [showBackButton, setShowBackButton] = useState(false);

  return (
    <Provider store={store}>
      <ThemeProvider theme={DarkTheme}>
        <Uploady destination={{url: `${BASEURL}`}}>
          {/* <React.StrictMode> */}
          <GestureHandlerRootView style={{flex: 1}}>
            <SafeAreaView>
              {/* <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} /> */}
              <StatusBar barStyle={'dark-content'} />
              <Header showBackButton={showBackButton} />
            </SafeAreaView>
            <AuthNew>
              <RootStack
                setShowBackButton={setShowBackButton}
                navref={navigationRef}
              />
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
