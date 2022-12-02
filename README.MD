# Gym Bay

# FitForm

brew install node
brew install watchman

sudo gem install cocoapods
sudo arch -x86_64 gem install ffi
arch -x86_64 pod install

When deleteing build folder or using new simulator, needed to remove DervivedData
rm -r /Users/chrisandaya/Library/Developer/Xcode/DerivedData  
cd android/ && ./gradlew clean && cd .. && npx react-native run-android --active-arch-only

env /usr/bin/arch -arm64 /bin/bash --login

npx react-native run-ios

npx react-native start  
adb -s 710KPMZ0409387 reverse tcp:8081 tcp:8081
adb -s 710KPMZ0409387 reverse tcp:8000 tcp:8000
npx react-native run-android --active-arch-only

// When building your android app locally, by default you build all the 4 Application
// Binary Interfaces (ABIs) : armeabi-v7a, arm64-v8a, x86 & x86_64.

npx react-native run-ios --udid CCF49CB5-3952-4D51-8830-27A2BA1FEB1B

import { GymCardProps } from "../app_components/Cards/types"
import { get, post } from "../utils/fetchAPI"

const LIST_GYMS = "http://localhost:8000/gyms/";

TODOs

    Deployment:

        # https://reactnative.dev/docs/signed-apk-android#adding-signing-config-to-your-apps-gradle-config

        Android
            - Apply for app store
            - Signing package
        iOS:
            - Apply for app store





    -  Create Script to create WorkoutNames (Started in instaFitAPI)
        - Python to generate script
            - can be run against dev environment to hit endpoint which will also upload the media to DO Spaces





    The big problem (SOLVED):
        - WorkoutGroups and CompletedWorkoutGroups are tightly coupled in the DB
        - So when deleting a WorkoutGroup/ Workout, the Completed Versions are removed too.

    Solution:
    1. Users cannot finish a WorkoutGroup without Workouts.
    1. Users cannot edit Workouts after Finishing
    2. Users cannot complete workouts until they're marked as Finished.
    3. Users cannot remove workouts once Finished but can Archive them.
        - Add field to WorkoutGroup: archived: True/ False
        - This allows them to be hidden from search/ class workoutgroup list.

        DB check:
            - Creating Completed workout, reject if WorkoutGroup.finished = False
            - Dont allow Workoutgroup to be Finished if no related Workouts exist
            - Dont Allow Delete of WorkoutGroup, Workout, WorkoutItems if the WorkoutGroup is not finished

        Adding Field
         - Add field: archived to WorkoutGroup
         - Update WorkoutGroupProps
            - might not need, this is really for the backed so we can filter WorkoutGroups.
        - Update Queries for WorkoutGroups,
            - Curently, any backend Views that query GET

                - WorkoutGroups.objects.get -> maybe add archived=False
                - WorkoutGroups.objects.filter(...., archived=False)

        Frontend: APISlice Change Delete WorkoutGroup to ArchiveWorkoutGroup
        In the future, we can create views to show Archived workouts?
        - Or we can treat them as deleted...
            - The user no longer see them
            - We still have workout data
            - Other users still have their Completed Workout
                - We can always filter out the original workout based on ARchived. If Archived, we can return blank data instead.
                    - Therefore, the UI logic will behave the same, except all the data will be empty
                        - Strings => ""
                        - numbers => 0
                        - lists => []
                    - Keep same shape of original data.
                    - Will need to create a funtion to create a copy of the data and then "clear/reset" the values








    Testing
        gymClass
         - private
          - make sure correct users see data
          - correct users add coaces, members

        api
            - basics
            - permissions create, delete, add members/ coches
        frontend


        Creating Workout

V2 Features:
Auth: - Edit User info - Change pass - Remove account
