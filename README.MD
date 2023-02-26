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

# Testing setup https://wix.github.io/Detox/docs/introduction/project-setup

- Android build
  detox build --configuration android.emu.debug
  detox test --configuration android.emu.debug
  detox build --configuration android.emu.release

- iOS build
  detox build --configuration ios.sim.debug
  detox build --configuration ios.sim.release

  Testings IDS

# Build Android

Change versions in android/app/build.gradle
cd android
./gradlew bundleRelease
android/app/build/outputs/bundle/[app-release.aab]

adb -s 710KPMZ0409387 reverse tcp:8081 tcp:8081
adb -s 710KPMZ0409387 reverse tcp:8000 tcp:8000

adb -s emulator-5554 reverse tcp:8081 tcp:8081
adb -s emulator-5554 reverse tcp:8000 tcp:8000
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

# TODO

- Write e2e tests

  - Finish writing some tests.

    - Need to use testID in many places now..

  - UI should not send the request in following circumstances:
    - Create WorkoutGroup button doesn't appear in another users Workout Group
    - Delete buttons do not appear when viewing other user's Gymclass, WorkoutGroup

- Create good sample workout
  - Good for demos and screenshots
- Create a Few gyms and populate with workouts daily.

  - Create workout engine.

# Bugs:

Push to prod again, but fixes waiting...
Run End to end tests covering

- Creating Gyms, Classes, WorkoutGroups
- Complete Workout groups
- Stats query works

- doesnt redirect after create....

```RETEST RELEASE BUILD   ~~~

```

'''
Welcome to our fitness app! This app is designed to help you track your workouts and reach your fitness goals. With our user-friendly interface, you can easily log your exercises, set goals, and monitor your progress. Our app also offers a variety of helpful features, such as personalized workout plans and the ability to connect with friends for added motivation. Get started on your fitness journey today with our app!

Welcome to our fitness app! This app is designed to help you track and visualize your workouts to reach your fitness goals. With our app, you can easily log your exercises and view your progress over time. Our user-friendly interface allows you to set goals and track your progress towards achieving them. You can also use our app to create personalized workout plans and connect with friends for added motivation. Get started on your fitness journey today and see the progress you can make with our app!

Welcome to our fitness app! This app is designed to help you track and visualize your workouts to reach your fitness goals. With our app, you can easily log your exercises and view your progress over time. Our user-friendly interface allows you to set goals and track your progress towards achieving them. You can also use our app to find workouts from your friends or your gym, or create personalized workout plans for added variety. Connect with friends for added motivation and support on your fitness journey. Get started today and see the progress you can make with our app!

'''

V2 Features:
Remove account

    This can be a V2, in the event it happens, user can reopen the app.
    - New login method
        - When user opens app when server is not running, error getting data.
            - Data doesnt refetch
        - user is logged in if keys are present.
            - Possibly send request?
            - Seems like we should just focus on retries....

I'm trying to use Detox for e2e tests and have failed to setup Detox with my project.
I keep getting a build failure regarding react-native-encrypted-storage when running the gradle assembleAndroidTest command.

I execute:
detox build --configuration android.emu.debug
which executes:
./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug

Versions:
"react-native": "0.69.7",
"react-native-encrypted-storage": "^4.0.3",

The following command fails:
./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug

With the following message:

> Task :react-native-encrypted-storage:processDebugAndroidTestManifest FAILED
> /home/killuh/ws_p38/fitform/FitForm/node_modules/react-native-encrypted-storage/android/build/intermediates/tmp/manifest/androidTest/debug/tempFile1ProcessTestManifest11953716120453094683.xml:27:9-33:20 Error:

        android:exported needs to be explicitly specified for element <activity#androidx.test.core.app.InstrumentationActivityInvoker$BootstrapActivity>. Apps targeting Android 12 and higher are required to specify an explicit value for `android:exported` when the corresponding component has an intent filter defined. See https://developer.android.com/guide/topics/manifest/activity-element#exported for details.

/home/killuh/ws_p38/fitform/FitForm/node_modules/react-native-encrypted-storage/android/build/intermediates/tmp/manifest/androidTest/debug/tempFile1ProcessTestManifest11953716120453094683.xml:34:9-40:20 Error:
android:exported needs to be explicitly specified for element <activity#androidx.test.core.app.InstrumentationActivityInvoker$EmptyActivity>. Apps targeting Android 12 and higher are required to specify an explicit value for `android:exported` when the corresponding component has an intent filter defined. See https://developer.android.com/guide/topics/manifest/activity-element#exported for details.
/home/killuh/ws_p38/fitform/FitForm/node_modules/react-native-encrypted-storage/android/build/intermediates/tmp/manifest/androidTest/debug/tempFile1ProcessTestManifest11953716120453094683.xml:41:9-47:20 Error:
        android:exported needs to be explicitly specified for element <activity#androidx.test.core.app.InstrumentationActivityInvoker$EmptyFloatingActivity>. Apps targeting Android 12 and higher are required to specify an explicit value for `android:exported` when the corresponding component has an intent filter defined. See https://developer.android.com/guide/topics/manifest/activity-element#exported for details.

See http://g.co/androidstudio/manifest-merger for more information about the manifest merger.

FAILURE: Build failed with an exception.
The following commands work to build the app on emulator or physical device:
npx react-native run-android
cd android/ && ./gradlew clean && ./gradlew bundleRelease && cd .. && npx react-native run-android --variant=release

However, ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug continues to fail.

Any help would be greatly appreciated, thanks!
