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

# NPM Package

killuhwhal3-rn-secure-storage@2.0.8

# Testing setup https://wix.github.io/Detox/docs/introduction/project-setup

- Android build
  cd android/ && ./gradlew clean && cd .. && detox build --configuration android.emu.debug
  detox test --configuration android.emu.debug
  detox build --configuration android.emu.releasew

- iOS build
  detox build --configuration ios.sim.debug
  detox build --configuration ios.sim.release

  Testings IDS

# Build Android

## Image

. For example, "mipmap-mdpi", "mipmap-hdpi", "mipmap-xhdpi", "mipmap-xxhdpi", and "mipmap-xxxhdpi".

mdpi (Medium density) - 48 x 48 pixels
hdpi (High density) - 72 x 72 pixels
xhdpi (Extra-high density) - 96 x 96 pixels
xxhdpi (Extra-extra-high density) - 144 x 144 pixels
xxxhdpi (Extra-extra-extra-high density) - 192 x 192 pixels
Save your app icon image in each of the "mipmap" folders that you just created. The image should be named "ic_launcher.png".

In the "AndroidManifest.xml" file of your project, locate the "application" tag.

Inside the "application" tag, add the following line of code to specify the app icon:

perl
Copy code
android:icon="@mipmap/ic_launcher"

## Build android

Change versions in android/app/build.gradle
cd android/ && ./gradlew clean && ./gradlew bundleRelease
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

- ## Create a drop down on CreateWorkoutScreen so that Title, Desc and Rep Schemes are able to be hidden to fgive more room for workouts.

- Create Workouts should trigger StatsPage to refetch works.. Invalidate tags.

- Lock to portrait only - Need to Change on iOS still.
  On iOS, in the General tab and Deployment Info section of Xcode enable the Device Orientation you want to support (ensure you have selected iPhone from the Devices menu when making the changes). For Android, open the AndroidManifest.xml file and within the activity element add 'android:screenOrientation="portrait"' to lock to portrait or 'android:screenOrientation="landscape"' to lock to landscape.

- Create good sample workout
  - Good for demos and screenshots
- Create a Few gyms and populate with workouts daily.

- Create workout engine.

# Bugs:

(Fixed)

- Sending null files
  - Request success, backend success, front end response failure...

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
