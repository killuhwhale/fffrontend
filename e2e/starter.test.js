const {TestIDs} = require('../src/utils/constants');

const sleep = (n = null) =>
  new Promise((res, rej) => {
    setTimeout(() => {
      console.log('Default detox timeout...');
      res();
    }, n || 120000);
  });
describe('App', () => {
  beforeAll(async () => {
    await device.launchApp();
    try {
      await element(by.id(TestIDs.AuthSignUpBtn.name())).tap();
      await element(by.id(TestIDs.AuthSignUpEmail.name())).typeText('t@t.com');
      await element(by.id(TestIDs.AuthSignUpPassword.name())).typeText('123');
      await element(by.id(TestIDs.AuthSignUpPasswordConfirm.name())).typeText(
        '123',
      );
      await element(by.id(TestIDs.AuthSignUpRegisterBtn.name())).tap();

      const signIn = await element(by.id('signInScreen')).getAttributes();
      // await element(by.id(TestIDs.SignInEmailField.name())).typeText('t@t.com');
      // await element(by.id(TestIDs.SignInPasswordField.name())).typeText('123');
      await element(by.id(TestIDs.SignInSubmit.name())).tap();

      console.log('Sign in', signIn);
      console.log('Signing in!');
    } catch (err) {
      console.log('Error', err);
    }
  });

  beforeEach(async () => {
    // await device.reloadReactNative();
  });

  it('shoud navigate to create gym screen and create a gym.', async () => {
    await element(by.id(TestIDs.ProfileTab.name())).tap();
    await element(by.id(TestIDs.OpenSettingsModalBtn.name())).tap();
    await element(by.id(TestIDs.CreateGymScreenBtn.name())).tap();

    const title = 'AutoGymTest1';
    await element(by.id(TestIDs.GymTitleField.name())).typeText(title);
    await element(by.id(TestIDs.GymDescField.name())).typeText(
      `${title}_Desc\n`,
    );
    await element(by.id(TestIDs.GymSubmitBtn.name())).tap();
    await expect(
      element(by.id(`${TestIDs.GymRowTouchable.name()}_${title}`)),
    ).toExist();

    await element(by.id(TestIDs.PlanetHome.name())).tap();
  });

  it('shoud navigate to create gym class screen and create a gym class with previous gym.', async () => {
    await element(by.id(TestIDs.ProfileTab.name())).tap();
    await element(by.id(TestIDs.OpenSettingsModalBtn.name())).tap();
    await element(by.id(TestIDs.CreateGymClassScreenBtn.name())).tap();

    const gymTitle = 'AutoGymTest1';
    const title = 'AutoGymClassTest1';
    await element(by.id(TestIDs.GymClassTitleField.name())).typeText(title);
    await element(by.id(TestIDs.GymClassDescField.name())).typeText(
      `${title}_Desc\n`,
    );

    //  Toggle Private class
    await element(by.id(TestIDs.GymClassPrivateSwitch.name())).tap();

    // Select Gym
    await element(by.id(TestIDs.GymClassRNPickerTouchableGym.name())).tap();
    await element(by.text(gymTitle)).tap();

    // Create
    await element(by.id(TestIDs.GymClassCreateBtn.name())).tap();

    // Verify on GymClass Page
    await element(by.id(`${TestIDs.GymRowTouchable.name()}_${gymTitle}`)).tap();
    await sleep(3000);
    await expect(element(by.text(title))).toExist();

    // Go Home
    await element(by.id(TestIDs.PlanetHome.name())).tap();
  });

  it('shoud navigate to gym and gym class and create a workoutGroup.', async () => {
    const gymTitle = 'AutoGymTest1';
    const classTitle = 'AutoGymClassTest1';

    // tap gym on home
    await element(by.text(gymTitle)).tap();

    // tap class on gym
    await element(by.text(classTitle)).tap();

    // tap add workoutGroup on gymClass
    const title = 'AutoWorkoutGroup';
    const caption = 'AutoWorkoutGroupCaption';
    await element(
      by.id(TestIDs.CreateWorkoutGroupScreenForClassBtn.name()),
    ).tap();
    await element(by.id(TestIDs.WorkoutGroupTitleField.name())).typeText(title);
    await element(by.id(TestIDs.WorkoutGroupCaptionField.name())).typeText(
      `${caption}\n`,
    );
    await element(by.id(TestIDs.WorkoutGroupCreateBtn.name())).tap();

    await expect(element(by.text(title))).toExist();
    // Go Home
    await element(by.id(TestIDs.PlanetHome.name())).tap();
  });

  async function selectWorkoutName(name) {
    await element(by.id(TestIDs.AddItemChooseWorkoutNameField.name())).tap(); // opens modal
    await element(by.id(TestIDs.AddItemFilterModalInputField.name())).tap(); // taps input
    await element(by.id(TestIDs.AddItemFilterModalInputField.name())).typeText(
      `${name}\n`,
    ); // Types into input
    await element(by.id(name)).tap(); // taps row item with test id as its workoutName name
  }

  it('shoud navigate to gym and gym class and workoutGroup to create a regular workout.', async () => {
    const gymTitle = 'AutoGymTest1';
    const classTitle = 'AutoGymClassTest1';
    const workoutGroupTitle = 'AutoWorkoutGroup';

    // tap gym on home
    await element(by.text(gymTitle)).tap();
    // tap class on gym
    await element(by.text(classTitle)).tap();

    // tap workoutGroup on class
    await element(by.text(workoutGroupTitle)).tap();

    // Tap create add workout
    await element(by.id(TestIDs.ToggleShowCreateWorkoutBtns.name())).tap();

    // Tap create regular workout workout
    await element(by.id(TestIDs.CreateRegularWorkoutBtn.name())).tap();
    const title = 'AWGRW'; // AutoWorkoutGroupRegularWorkout

    // Workout Title
    await element(by.id(TestIDs.CreateWorkoutTitleField.name())).typeText(
      title,
    );
    await element(by.id(TestIDs.CreateWorkoutDescField.name())).typeText(
      'AWGRWWD', //  WorkoutDesc
    );
    // TODO() Create 3 items, change units and Create the workout
    await selectWorkoutName('Paused Deadlift');

    await element(by.id(TestIDs.AddItemPauseDurField.name())).typeText('3');
    await element(by.id(TestIDs.AddItemSetsField.name())).typeText('2');
    await element(by.id(TestIDs.AddItemRepsField.name())).typeText('5');
    await element(by.id(TestIDs.AddItemWeightField.name())).typeText('10 20');

    await element(by.id(TestIDs.CreateWorkoutAddItemBtn.name())).tap();

    // Create a Squat for duration w/ rest
    await selectWorkoutName('Air Squat');

    await element(
      by.id(TestIDs.VerticalPickerGestureHandlerQtyType.name()),
    ).swipe('left', 'slow', 0.1, 0.2, NaN);

    await element(by.id(TestIDs.AddItemSetsField.name())).typeText('3');
    await element(by.id(TestIDs.AddItemDurationField.name())).typeText('30');
    await element(by.id(TestIDs.AddItemWeightField.name())).typeText('30');
    await element(
      by.id(TestIDs.VerticalPickerGestureHandlerWtUnit.name()),
    ).swipe('left', 'slow', 0.1, 0.1, NaN);

    await element(by.id(TestIDs.AddItemRestField.name())).typeText('1');
    await element(
      by.id(TestIDs.VerticalPickerGestureHandlerRestUnit.name()),
    ).swipe('left', 'slow', 0.3, 0.3, NaN);

    await element(by.id(TestIDs.CreateWorkoutAddItemBtn.name())).tap();

    // Create Deadlift

    await selectWorkoutName('Deadlift');
    await element(
      by.id(TestIDs.VerticalPickerGestureHandlerQtyType.name()),
    ).swipe('left', 'slow', 0.3, NaN, NaN);

    await element(by.id(TestIDs.AddItemSetsField.name())).typeText('2');
    await element(by.id(TestIDs.AddItemDistanceField.name())).typeText('30');

    await element(
      by.id(TestIDs.VerticalPickerGestureHandlerRestUnit.name()),
    ).swipe('right', 'slow', 0.3, 0.3, NaN);
    await element(by.id(TestIDs.AddItemRestField.name())).typeText('15\n');

    await element(by.id(TestIDs.CreateWorkoutAddItemBtn.name())).tap();

    // await sleep();
    await element(by.id(TestIDs.CreateWorkoutCreateBtn.name())).tap();

    await sleep(1000);
    const swipey = await element(by.id(TestIDs.WorkoutScreenScrollView.name()));
    await swipey.swipe('up', 'fast', 0.5);

    const expected_num_items = 3;
    // WorkoutCardItemList_AWGRW_3
    const attrs = await expect(
      element(
        by.label(
          `${TestIDs.WorkoutCardItemList.name()}_${title}_${expected_num_items}`,
        ),
      ),
    ).toExist();

    // Go Home
    await element(by.id(TestIDs.PlanetHome.name())).tap();
  });

  // TODO()
});
