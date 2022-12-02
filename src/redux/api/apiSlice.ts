// Import the RTK Query methods from the React-specific entry point
import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import {WorkoutCardProps} from '../../app_components/Cards/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASEURL} from '../../utils/constants';
import {
  authDelete,
  authGet,
  authPost,
  refreshAccessToken,
} from '../../utils/fetchAPI';

const JWT_ACCESS_TOKEN_KEY = '__jwttoken_access';
const JWT_REFRESH_TOKEN_KEY = '__jwttoken_refresh';

// Dump Asyn Storage
AsyncStorage.getAllKeys((err, keys) => {
  if (keys) {
    AsyncStorage.multiGet(keys, (error, stores) => {
      stores?.map((result, i, store) => {
        console.log('AsyncStorage: ', {[store[i][0]]: store[i][1]});
        return true;
      });
    });
  }
});

export const clearToken = async () => {
  try {
    await AsyncStorage.setItem(JWT_ACCESS_TOKEN_KEY, '');
    await AsyncStorage.setItem(JWT_REFRESH_TOKEN_KEY, '');
    return true;
  } catch (e) {
    // saving error
    console.log('Error clearing from storage: ', e);
    return false;
  }
};
export const storeToken = async (value, access = true) => {
  try {
    if (access) {
      await AsyncStorage.setItem(JWT_ACCESS_TOKEN_KEY, value);
    } else {
      await AsyncStorage.setItem(JWT_REFRESH_TOKEN_KEY, value);
    }
    return true;
  } catch (e) {
    // saving error
    console.log('Errorsaving to storage: ', e);
    return false;
  }
};

export const getToken = async (access = true) => {
  try {
    if (access) {
      return await AsyncStorage.getItem(JWT_ACCESS_TOKEN_KEY);
    } else {
      return await AsyncStorage.getItem(JWT_REFRESH_TOKEN_KEY);
    }
  } catch (e) {
    // error reading value
    console.log('Error getting from storage: ', e);
    return '';
  }
};

// Tag types are good for a global coolection of data....
const cacheTagGym = 'gyms';
const cacheTagGymClass = 'gymClasses';
const cacheTagWorkouts = 'workouts';

const asyncBaseQuery =
  (
    {baseUrl}: {baseUrl: string} = {baseUrl: ''},
  ): BaseQueryFn<
    {
      url: string;
      method?: string;
      data?: object;
      params?: {contentType: string};
    },
    any,
    {
      status: number;
      data: string;
    }
  > =>
  async ({url, method, data, params}) => {
    try {
      if (!method) {
        method = 'get';
      }
      const contentType = params?.contentType || 'application/json';
      const authToken = await getToken();

      let options: {method: string; headers: any; body: any} = {
        method: method,
        headers: {
          contentType: contentType,
          Authorization: `Bearer ${authToken}`,
        },
        body: '',
      };
      console.log('ApiSlice');
      console.log('ApiSlice');
      console.log('Data: ', data);
      console.log('url/ method: ', baseUrl, url, method);

      /**
       *  Problem is that APISlice will trigger 5 actions on a page load.
       * Each of which will try to get a new token when it is bad.
       * We need a better way to handle this.
       *
       *
       */
      // Remove Authorization header when creating a new account
      if (url === 'users/' && method === 'POST') {
        delete options.headers.Authorization;
      }

      if (data && params?.contentType !== 'multipart/form-data') {
        console.log('Stringifying body for JSON data');
        options.body = JSON.stringify(data);
      } else {
        options.body = data;
      }
      console.log('BODY: ', options.body);
      // We make the first auth request using access token
      const result = await fetch(baseUrl + url, options);
      console.log('BaseQuery fetch response: ', result);
      const jResult = await result.json();

      // if token is expired:
      if (result.status === 401 || jResult.code === 'token_not_valid') {
        // Hit API w/ Refresh Token and update token.
        const refreshToken = await getToken(false);

        console.log('refreshToken: ', refreshToken);

        const res = await refreshAccessToken(`${BASEURL}token/refresh/`);
        if (res.status === 400) {
          console.log('refreshAccessToken resp BAD!', res);
          // TODO()
          // IF Refresh token is expired, deauth.
          // Return to sign in page.

          return {error: {status: 400, data: 'Refresh token is bad'}};
        } else {
          console.log('refreshAccessToken resp good:', res, url, method);
          const accessTokenResult = await res.json();
          await storeToken(accessTokenResult.access);

          if (method === 'get' || method == 'GET') {
            return {data: await (await authGet(baseUrl + url)).json()};
          } else if (method == 'post' || method == 'POST') {
            return {
              data: await (
                await authPost(baseUrl + url, options.body, contentType)
              ).json(),
            };
          } else if (method == 'delete' || method == 'DELETE') {
            // We need a body for Delete requests since we want permissions to work as well.
            return {
              data: await (
                await authDelete(baseUrl + url, options.body, contentType)
              ).json(),
            };
          }
        }
      } else {
        return {data: jResult};
      }
      return {error: {status: 404, data: 'Errorneous behavior!'}};
    } catch (err: any) {
      console.log('APISlice returning error!', err);
      return {
        error: {
          status: 0,
          data: err.toString(),
        },
      };
    }
  };

// Define our single API slice object

export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: asyncBaseQuery({baseUrl: BASEURL}),
  tagTypes: [
    'Gyms',
    'UserGyms',
    'User',
    'GymClasses',
    'GymClassWorkoutGroups',
    'UserWorkoutGroups',
    'WorkoutGroupWorkouts',
    'Coaches',
    'Members',
    'GymFavs',
    'GymClassFavs',
  ],
  endpoints: builder => ({
    // Users, Coaches and Members
    createUser: builder.mutation({
      query: (data = {}) => ({
        url: 'users/',
        method: 'POST',
        data,
        params: {contentType: 'multipart/form-data'},
      }),
    }),
    updateUsername: builder.mutation({
      query: (data = {}) => ({
        url: 'users/update_username/',
        method: 'POST',
        data,
        params: {contentType: 'multipart/form-data'},
      }),
    }),
    getUsers: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => {
        return {url: 'users/'};
      },
    }),
    createCoach: builder.mutation({
      query: (data = {}) => ({
        url: 'coaches/',
        method: 'POST',
        data,
        params: {contentType: 'multipart/form-data'},
      }),
      invalidatesTags: (result, err, arg) => [
        {type: 'Coaches', id: arg.gym_class},
      ],
    }),
    getCoachesForGymClass: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: id => {
        return {url: `coaches/${id}/coaches/`};
      },
      providesTags: (result, err, arg) => [{type: 'Coaches', id: arg}],
    }),
    deleteCoach: builder.mutation({
      query: (data = {}) => ({
        url: 'coaches/remove/',
        method: 'DELETE',
        data,
        params: {contentType: 'multipart/form-data'},
      }),
      invalidatesTags: (result, error, arg) => [
        {type: 'Coaches', id: result.gym_class},
      ],
    }),

    createMember: builder.mutation({
      query: (data = {}) => ({
        url: 'classMembers/',
        method: 'POST',
        data,
        params: {contentType: 'multipart/form-data'},
      }),
      invalidatesTags: (result, err, arg) => [
        {type: 'Members', id: arg.gym_class},
      ],
    }),
    getMembersForGymClass: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: id => {
        return {url: `classMembers/${id}/members/`};
      },
      providesTags: (result, err, arg) => [{type: 'Members', id: arg}],
    }),
    deleteMember: builder.mutation({
      query: (data = {}) => ({
        url: 'classMembers/remove/',
        method: 'DELETE',
        data,
        params: {contentType: 'multipart/form-data'},
      }),
      invalidatesTags: (result, error, arg) => [
        {type: 'Members', id: result.gym_class},
      ],
    }),

    // Gyms
    getGyms: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => {
        return {url: 'gyms/'};
      },
      providesTags: ['Gyms'],
    }),
    getUserGyms: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => {
        return {url: 'gyms/user_gyms/'};
      },
      providesTags: ['UserGyms'],
    }),
    createGym: builder.mutation({
      query: (data = {}) => ({
        url: 'gyms/',
        method: 'POST',
        data: data,
        params: {contentType: 'multipart/form-data'},
      }),
      invalidatesTags: ['Gyms', 'UserGyms'],
    }),

    favoriteGym: builder.mutation({
      query: data => ({
        url: 'gyms/favorite/',
        method: 'POST',
        data: data,
        params: {contentType: 'multipart/form-data'},
      }),
      invalidatesTags: ['GymFavs'],
    }),
    unfavoriteGym: builder.mutation({
      query: data => ({
        url: 'gyms/unfavorite/',
        method: 'DELETE',
        data,
        params: {contentType: 'multipart/form-data'},
      }),
      invalidatesTags: ['GymFavs'],
    }),
    deleteGym: builder.mutation({
      query: id => ({
        url: `gyms/${id}/`,
        method: 'DELETE',
        data: {nonemptystupidandroid: 1},
        params: {contentType: 'application/json'},
      }),
      invalidatesTags: ['Gyms', 'GymFavs', 'UserGyms'],
    }),
    getGymDataView: builder.query({
      query: id => {
        return {url: `gyms/${id}/gymsclasses/`};
      },
      //
      providesTags: (result, error, arg) => {
        console.log('P0vide gym view: GymClasses', result);
        return [{type: 'GymClasses', id: result?.id}];
      },
    }),

    // GymClass
    createGymClass: builder.mutation({
      query: (data = {}) => ({
        url: 'gymClasses/',
        method: 'POST',
        data: data,
        params: {contentType: 'multipart/form-data'},
      }),
      invalidatesTags: (result, error, arg) => {
        console.log('Create class invalidate: ', arg, result);
        return [{type: 'GymClasses', id: arg.gym}];
      },
    }),

    getGymClassDataView: builder.query({
      query: id => {
        return {url: `gymClasses/${id}/workouts/`};
      },
      providesTags: (result, error, arg) => {
        return [{type: 'GymClassWorkoutGroups', id: result.id}];
      },
    }),

    favoriteGymClass: builder.mutation({
      query: data => ({
        url: 'gymClasses/favorite/',
        method: 'POST',
        data,
        params: {contentType: 'multipart/form-data'},
      }),
      invalidatesTags: ['GymClassFavs'],
    }),
    unfavoriteGymClass: builder.mutation({
      query: data => ({
        url: 'gymClasses/unfavorite/',
        method: 'DELETE',
        data,
        params: {contentType: 'multipart/form-data'},
      }),
      invalidatesTags: ['GymClassFavs'],
    }),
    deleteGymClass: builder.mutation({
      query: data => ({
        url: `gymClasses/${data.gymClassID}/`,
        method: 'DELETE',
        data: {nonemptystupidandroid: 1},
        params: {contentType: 'application/json'},
      }),
      invalidatesTags: (result, err, arg) => [
        {type: 'GymClasses', id: arg.gymID},
        'GymClassFavs',
      ], // Currently, favorites are fetched all at once and search in various places.
    }),

    // Workouts
    getWorkoutNames: builder.query({
      query: () => {
        return {url: 'workoutNames/'};
      },
    }),

    // Workout screen, returns workouts for WorkoutGroup
    // Create workoutItems also needs to invalidate this query
    getWorkoutsForGymClassWorkoutGroup: builder.query({
      query: id => {
        return {url: `workoutGroups/${id}/class_workouts/`};
      },
      providesTags: (result, error, arg) => {
        console.log('Providing tags', result, {
          type: 'WorkoutGroupWorkouts',
          id: arg,
        });
        return [{type: 'WorkoutGroupWorkouts', id: arg}, 'UserWorkoutGroups'];
      },
    }),

    // WorkoutScreen
    getWorkoutsForUsersWorkoutGroup: builder.query({
      query: id => {
        return {url: `workoutGroups/${id}/user_workouts/`};
      },
    }),
    createWorkoutGroup: builder.mutation({
      query: (data = {}) => ({
        url: 'workoutGroups/',
        method: 'POST',
        data: data,
        params: {contentType: 'multipart/form-data'},
      }),
      invalidatesTags: (result, err, arg) => {
        const data = new Map<string, string>(arg._parts);

        console.log('Invaldtes Tag: ', data);
        return data.get('owned_by_class')
          ? [{type: 'GymClassWorkoutGroups', id: data.get('owner_id')}]
          : ['UserWorkoutGroups'];
      },
    }),
    finishWorkoutGroup: builder.mutation({
      query: (data = {}) => ({
        url: 'workoutGroups/finish/',
        method: 'POST',
        data: data,
        params: {contentType: 'multipart/form-data'},
      }),
      invalidatesTags: (result, error, arg) => {
        // inavlidates query for useGetWorkoutsForGymClassWorkoutGroupQuery
        const data = new Map<string, string>(arg._parts);
        console.log('Invalidating WorkoutGroupWorkouts', {
          type: 'WorkoutGroupWorkouts',
          id: data.get('group'),
        });
        return [{type: 'WorkoutGroupWorkouts', id: data.get('group')}];
      },
    }),
    deleteWorkoutGroup: builder.mutation({
      query: data => {
        const mapData = new Map<string, string>(data._parts);
        console.log(
          'Delete workoutGroup mutation! URL: ',
          `workoutGroups/${mapData.get('id')}/`,
        );
        return {
          url: `workoutGroups/${mapData.get('id')}/`,
          method: 'DELETE',
          data,
          params: {contentType: 'multipart/form-data'},
        };
      },
      invalidatesTags: (result, err, arg) => {
        const data = new Map<string, string>(arg._parts);
        console.log('Invaldtes Tag deleteWorkoutGroup: ', data);
        return data.get('owned_by_class')
          ? [{type: 'GymClassWorkoutGroups', id: data.get('owner_id')}]
          : ['UserWorkoutGroups'];
      },
    }),

    createWorkout: builder.mutation({
      query: (data = {}) => ({
        url: 'workouts/',
        method: 'POST',
        data: data,
        params: {contentType: 'multipart/form-data'},
      }),
      invalidatesTags: (result, error, arg) => {
        if (error) {
          return [];
        }
        const data = new Map<string, string>(arg._aprts);
        return [{type: 'WorkoutGroupWorkouts', id: data.get('group')}];
      },
    }),
    deleteWorkout: builder.mutation({
      query: arg => {
        const data = new Map<string, string>(arg._parts);
        console.log('Deleting workout query dsa', data);
        return {
          url: `workouts/${data.get('id')}/`,
          method: 'DELETE',
          data: {nonemptystupidandroid: 1},
          params: {contentType: 'multipart/form-data'},
        };
      },
      invalidatesTags: (result, error, arg) => {
        if (error) {
          return [];
        }
        const data = new Map<string, string>(arg._parts);
        console.log('Invalidating workouts...,', data);
        return [{type: 'WorkoutGroupWorkouts', id: data.get('group')}];
      },
    }),

    createWorkoutItems: builder.mutation({
      query: (data = {}) => ({
        url: 'workoutItems/items/',
        method: 'POST',
        data: data,
        params: {contentType: 'multipart/form-data'},
      }),
      invalidatesTags: (resut, error, arg) => {
        const data = new Map<string, string>(arg._parts);
        console.log('APISLICECreate workoutItems data: ', data);
        return [{type: 'WorkoutGroupWorkouts', id: data.get('workout_group')}];
      },
    }),

    // Completed Workouts
    createCompletedWorkout: builder.mutation({
      query: (data = {}) => ({
        url: 'completedWorkoutGroups/',
        method: 'POST',
        data: data,
        params: {contentType: 'multipart/form-data'},
      }),
      // IF user completes Class workout, Invalidate both UserWorkoutGroups and  classWorkoutGroups/classID
      // If user complete non class workout, just invaldiate UserWorkoutGroups

      // Should also invalidate WorkoutScreen so that it shows the new completedworkout so user can toggle back and forth.

      // From GymClass -> completed workout screen we get:
      /**
       * title
       * caption
       * for_date
       * workouts: []
       * workout_group: id
       */
      invalidatesTags: (result, error, arg) => {
        if (error) {
          return [];
        }

        const data = new Map<string, string>(arg._parts);
        console.log('Invalidating compelted: ', data, {
          type: 'WorkoutGroupWorkouts',
          id: data.get('workout_group'),
        });

        // Cases:
        // 1. A user completes a WorkoutGroup from a gym Class
        // 2. A user completes a WorkoutGroup from another User.
        //      - TODO() We do not have a search feature, to find other users workouts yet.
        return [
          {type: 'WorkoutGroupWorkouts', id: data.get('workout_group')}, // Reset WorkoutScreen
          'UserWorkoutGroups', // Reset Profile workout list
          {type: 'GymClassWorkoutGroups', id: data.get('owner_id')},
        ];
      },
    }),
    getCompletedWorkout: builder.query({
      query: id => ({
        url: `completedWorkoutGroups/${id}/completed_workout_group/`,
      }),
    }),
    getCompletedWorkoutByWorkoutID: builder.query({
      query: id => ({
        url: `completedWorkoutGroups/${id}/completed_workout_group_by_og_workout_group/`,
      }),
      providesTags: (result, error, arg) => {
        console.log('Providing tagzz', result, {
          type: 'WorkoutGroupWorkouts',
          id: arg,
        });
        return [{type: 'WorkoutGroupWorkouts', id: arg}];
      },
    }),
    deleteCompletedWorkoutGroup: builder.mutation({
      query: data => {
        const mappedData = new Map<string, string>(data._parts);
        return {
          url: `completedWorkoutGroups/${mappedData.get('id')}/`,
          method: 'DELETE',
          data: {nonemptystupidandroid: 1},
          params: {contentType: 'application/json'},
        };
      },
      invalidatesTags: (result, error, arg) => {
        if (error) {
          return [];
        }

        const data = new Map<string, string>(arg._parts);
        console.log('Invalidating compelted: ', data, {
          type: 'WorkoutGroupWorkouts',
          id: data.get('workout_group'),
        });

        // Cases:
        // 1. A user completes a WorkoutGroup from a gym Class
        // 2. A user completes a WorkoutGroup from another User.
        //      - TODO() We do not have a search feature, to find other users workouts yet.
        return [
          {type: 'WorkoutGroupWorkouts', id: data.get('workout_group')}, // Reset WorkoutScreen
          'UserWorkoutGroups', // Reset Profile workout list
          {type: 'GymClassWorkoutGroups', id: data.get('owner_id')},
        ];
      },
    }),

    deleteCompletedWorkout: builder.mutation({
      query: id => ({
        url: `completedWorkouts/${id}/`,
        method: 'DELETE',
        data: {nonemptystupidandroid: 1},
        params: {contentType: 'application/json'},
      }),
    }),

    // User and Profile
    getProfileView: builder.query({
      query: () => {
        return {url: 'profile/profile/'};
      },
    }),
    // Expanded Profile data view
    getProfileWorkoutGroups: builder.query({
      query: () => {
        return {url: 'profile/workout_groups/'};
      },
      providesTags: ['UserWorkoutGroups'],
    }),
    getProfileGymFavs: builder.query({
      query: () => {
        return {url: 'profile/gym_favs/'};
      },
      providesTags: ['GymFavs'],
    }),
    getProfileGymClassFavs: builder.query({
      query: () => {
        return {url: 'profile/gym_class_favs/'};
      },
      providesTags: ['GymClassFavs'],
    }),

    getUserInfo: builder.query({
      query: id => {
        return {url: 'users/user_info/'};
      },
      providesTags: ['User'],
    }),

    // Stats
    getCompletedWorkoutGroupsForUserByDateRange: builder.query({
      query: (data = {}) => {
        return {
          url: `stats/${data.id}/user_workouts/?start_date=${data.startDate}&end_date=${data.endDate}`,
        };
      },
    }),
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useCreateUserMutation,
  useUpdateUsernameMutation,
  useCreateCoachMutation,
  useGetCoachesForGymClassQuery,
  useDeleteCoachMutation,

  useCreateMemberMutation,
  useDeleteMemberMutation,
  useGetMembersForGymClassQuery,

  useGetUsersQuery,
  useGetGymsQuery,
  useGetGymDataViewQuery,

  useGetGymClassDataViewQuery,

  useGetUserInfoQuery,
  useGetUserGymsQuery,
  useGetProfileViewQuery,
  useGetProfileWorkoutGroupsQuery,
  useGetProfileGymFavsQuery,
  useGetProfileGymClassFavsQuery,

  useGetWorkoutNamesQuery,

  useGetWorkoutsForGymClassWorkoutGroupQuery,
  useGetWorkoutsForUsersWorkoutGroupQuery,

  useGetCompletedWorkoutQuery,
  useGetCompletedWorkoutByWorkoutIDQuery,
  useDeleteCompletedWorkoutGroupMutation,
  useDeleteCompletedWorkoutMutation,

  useCreateGymMutation,
  useDeleteGymMutation,
  useFavoriteGymMutation,
  useUnfavoriteGymMutation,

  useCreateGymClassMutation,
  useFavoriteGymClassMutation,
  useUnfavoriteGymClassMutation,
  useDeleteGymClassMutation,

  useFinishWorkoutGroupMutation,

  useDeleteWorkoutMutation,
  useCreateWorkoutGroupMutation,
  useDeleteWorkoutGroupMutation,
  useCreateWorkoutMutation,
  useCreateWorkoutItemsMutation,
  useCreateCompletedWorkoutMutation,
  useGetCompletedWorkoutGroupsForUserByDateRangeQuery,
} = apiSlice;
