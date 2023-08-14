import {useGetUserInfoQuery} from '../../redux/api/apiSlice';
import {
  GAMBannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import React, {FunctionComponent, useEffect, useState} from 'react';
import {UserProps} from '../../app_pages/types';
import {useTheme} from 'styled-components';
import {RegularButton} from '../Buttons/buttons';
import {View} from 'react-native';

const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

const InterstitialAdMembership: FunctionComponent<{
  onClose?(): void;
  text: string;
  testID?: string;
  show?: boolean;
}> = props => {
  const theme = useTheme();
  const {
    data: _userData,
    isLoading: userIsloading,
    isSuccess: userIsSuccess,
    isError: userIsError,
    error: userError,
  } = useGetUserInfoQuery('');

  const userData = _userData as UserProps;

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );
    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        if (props.onClose) props.onClose();
        setLoaded(false);
      },
    );

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribe();
      unsubscribeClosed();
    };
  }, [loaded]);

  const hack = () => {
    interstitial.show();
    return true;
  };

  return (
    <View>{props.show && hack() ? <></> : <></>}</View>
    // <RegularButton
    //   testID={props.testID}
    //   onPress={() => {
    //     if (new Date(userData.sub_end_date) < new Date()) {
    //       interstitial.show();
    //     } else if (props.onClose) {
    //       props.onClose();
    //     }
    //   }}
    //   btnStyles={{backgroundColor: theme.palette.darkGray}}
    //   text={props.text}
    // />
  );
};

export default InterstitialAdMembership;
