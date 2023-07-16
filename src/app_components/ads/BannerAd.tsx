import {useGetUserInfoQuery} from '../../redux/api/apiSlice';
import {
  GAMBannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import React, {FunctionComponent} from 'react';
import {UserProps} from '../../app_pages/types';

const BannerAddMembership: FunctionComponent = () => {
  const {
    data: _userData,
    isLoading: userIsloading,
    isSuccess: userIsSuccess,
    isError: userIsError,
    error: userError,
  } = useGetUserInfoQuery('');

  const userData = _userData as UserProps;
  console.log('User data', userData);

  return (
    <>
      {userIsloading ? (
        <></>
      ) : !userIsloading &&
        userData &&
        userData.sub_end_date &&
        new Date(userData.sub_end_date) > new Date() ? (
        <></>
      ) : (
        <GAMBannerAd
          unitId={TestIds.BANNER}
          sizes={[BannerAdSize.FULL_BANNER]}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      )}
    </>
  );
};

export default BannerAddMembership;
