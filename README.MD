# Gym Bay

# FitForm

## https://www.appicon.co/

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
  detox build --configuration android.emu.release

- iOS build
  detox build --configuration ios.sim.debug
  detox build --configuration ios.sim.release

  Testings IDS

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

### Debug

adb shell input keyevent 82

\*\* Muted Audio in Config File -- Fixes Audio static
/home/$USER/Android/Sdk/tools/lib/monitor-x86_64/configuration/config.ini
hw.audioInput=no
hw.audioOutput=no

Change versions in android/app/build.gradle
cd android/ && ./gradlew clean && ./gradlew bundleRelease
android/app/build/outputs/bundle/[app-release.aab]

adb -s 710KPMZ0409387 reverse tcp:8081 tcp:8081
adb -s 710KPMZ0409387 reverse tcp:8000 tcp:8000

emulator -noaudio -avd Pixel_4_API_30 &
npx react-native run-android --active-arch-only
adb -s emulator-5554 reverse tcp:8081 tcp:8081
adb -s emulator-5554 reverse tcp:8000 tcp:8000
npx react-native start

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

- Add Complete list of names

  - Not exactly sure what I am missing but there are a few that Ive stumbled across that are missing.

- Take screenshots for App Store

  - Create a Full List og Gyms

    - Create 1 Class with full list of workouts

  - Create a full list of Personal Workouts
  - Create 1 Full WorkoutGroup with Each type.

StatsScreen

- When workout changes, it seems to break stuff
- Maybe a simple key that correlates with the current search even if Math.random()

  - This way things are reset properly? Not a huge deal but kinda crusty..

- Apple Connect

  - App Access - Account Creds for Apple

    - apple@fittrackrr.com
    - !Apple1

  - ## Support URL

- Google Play

  - https://play.google.com/console/u/0/developers/6076092592456292244/app/4974726312031903268/publishing
    Media:

    - Your app icon must be a PNG or JPEG, up to 1 MB, 512 px by 512 px, and meet our design specifications and metadata policy
    - Your feature graphic must be a PNG or JPEG, up to 15 MB, and 1,024 px by 500 px
    - Upload 2-8 phone screenshots. Screenshots must be PNG or JPEG, up to 8 MB each, 16:9 or 9:16 aspect ratio, with each side between 320 px and 3,840 px
    - Upload up to eight 7-inch tablet screenshots. Screenshots must be PNG or JPEG, up to 8 MB each, 16:9 or 9:16 aspect ratio, with each side between 320 px and 3,840 px
    - Upload up to eight 10-inch tablet screenshots. Screenshots must be PNG or JPEG, up to 8 MB each, 16:9 or 9:16 aspect ratio, with each side between 1,080 px and 7,680 px
    - Upload 4-8 screenshots. Screenshots must be PNG or JPEG, up to 8 MB each, 16:9 or 9:16 aspect ratio, with each side between 1,080 px and 7,680 px

  - Privacy Policy - add https://fittrackrr.com/privacy
  - Delete Account w/ all data - add https://fittrackrr.com/removeAccount
  - App Access - Account Creds for Google
    - google@fittrackrr.com
    - !Google1

- Remove Contribution Graph on iOS since the squres dont wanna show up...
- Images for App Stores
- Live Stripe
- Live Google Ads
- Update registration email to explain to upgrade to Membership,

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
Ready to try an app that is designed to help you track and visualize your workouts to reach your fitness goals. With FitForm Trackerr, you can easily log your exercises and view your progress over time. Our user-friendly interface allows you to set goals and track your progress towards achieving them. Get started today and see the progress you can make with our app!

I have an app with the description: "Ready to try an app that is designed to help you track and visualize your workouts to reach your fitness goals. With FitForm Trackerr, you can easily log your exercises and view your progress over time. Our user-friendly interface allows you to set goals and track your progress towards achieving them. Get started today and see the progress you can make with our app!"

It can track personal workouts, allows users to create classes and add workouts in order to provide workouts to class members. users can compete workouts created by classes and modify the details to reflect what they did. They can visialize the data via graphs with date ranges to see break downs by exercise or exercise category.
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
