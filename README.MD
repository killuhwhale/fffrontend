# Gym Bay

# FitForm

// sudo keytool -genkey -v -keystore fitform-upload-key.keystore -alias fitform-signing-key -keyalg RSA -keysize 2048 -validity 10000

Git
Update staging from main
\*main
git merge origin/staging
git branch -M staging
git push origin HEAD

brew install node
brew install watchman

sudo gem install cocoapods
sudo arch -x86_64 gem install ffi
arch -x86_64 pod install

env /usr/bin/arch -arm64 /bin/bash --login

# Build Android

Change versions in android/app/build.gradle
cd android
./gradlew bundleRelease

adb -s emulator-5554 reverse tcp:8081 tcp:8081
adb -s emulator-5554 reverse tcp:8000 tcp:8000

adb -s 710KPMZ0409387 reverse tcp:8081 tcp:8081
adb -s 710KPMZ0409387 reverse tcp:8000 tcp:8000
npx react-native start

npx react-native run-android --active-arch-only

// When building your android app locally, by default you build all the 4 Application
// Binary Interfaces (ABIs) : armeabi-v7a, arm64-v8a, x86 & x86_64.
cd android/ && ./gradlew clean && cd .. && npx react-native run-android --active-arch-only

// Test Build command
cd android/ && ./gradlew clean && ./gradlew bundleRelease && cd .. && npx react-native run-android --variant=release

# Build iOS

Versions:
To change the version of your iOS app, you will need to modify the CFBundleShortVersionString and CFBundleVersion keys in your app's Info.plist file.

Double click on YOUR_APP_NAME.xcworkspace
Product → Build
Product → Archive

- Make sure to set the device to "Any iOS Device (arm64)".
  After the archive is completed, in the archive window, click on Distribute App.

npx react-native run-ios
npx react-native run-ios --configuration Release

When deleteing build folder or using new simulator, needed to remove DervivedData
rm -r /Users/chrisandaya/Library/Developer/Xcode/DerivedData

npx react-native run-ios --udid CCF49CB5-3952-4D51-8830-27A2BA1FEB1B
iphone x simulator
npx react-native run-ios --udid 237DB837-16ED-4279-889A-9D2E5EB393E6

git push origin HEAD:staging HEAD

# Bugs:

    Add Loading Spiiners to On Create:
    - Gym, Class, Workout, CompleteWorkout
    - Takes a while and app should indicate to user while its waiting....

    iOS:
        Add workout Item
            - Weight_unit is not centered, looks bad.
            - SS, when colors arent showing, icons are no longer coloed
                - They should remain colored.


        Virtual Keyboard
            - Does not push up view, cannot see
                - Find out how to set this in some settings...


    Test some scenarios with multiple users
        - ensure users cannot delete workouts that they shouldnt be able to
        - Ensure theyFixed login, cant create workouts for classes they are not an owner of
        -

    ~~~~  RETEST RELEASE BUILD   ~~~

    Workoutscreen
        - Delete Workout Toggle Swtich is showing on completed workout in release build
            - NR on local build

    Reset Password
        - Fix account and get it active again

'''
Welcome to our fitness app! This app is designed to help you track your workouts and reach your fitness goals. With our user-friendly interface, you can easily log your exercises, set goals, and monitor your progress. Our app also offers a variety of helpful features, such as personalized workout plans and the ability to connect with friends for added motivation. Get started on your fitness journey today with our app!

Welcome to our fitness app! This app is designed to help you track and visualize your workouts to reach your fitness goals. With our app, you can easily log your exercises and view your progress over time. Our user-friendly interface allows you to set goals and track your progress towards achieving them. You can also use our app to create personalized workout plans and connect with friends for added motivation. Get started on your fitness journey today and see the progress you can make with our app!

Welcome to our fitness app! This app is designed to help you track and visualize your workouts to reach your fitness goals. With our app, you can easily log your exercises and view your progress over time. Our user-friendly interface allows you to set goals and track your progress towards achieving them. You can also use our app to find workouts from your friends or your gym, or create personalized workout plans for added variety. Connect with friends for added motivation and support on your fitness journey. Get started today and see the progress you can make with our app!

'''

    Deployment:
    # https://reactnative.dev/docs/signed-apk-android#adding-signing-config-to-your-apps-gradle-config

        ios
            - Complete workoutu Screen
                - Picker for weight unit

        Android
            - Apply for app store
            - Signing package
        iOS:
            - Apply for app store

    Problems:
        - Images are not showing up
        - Coaches modal gymClassScreen neeeds to be fixed
        - Og button on Wrkoutscreen needs larger target area
        - Need More workout items
        - Need workout itenm information
            - Description Images.
            - Infographs?




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
