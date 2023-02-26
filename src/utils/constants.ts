const nodeEnv = process.env.NODE_ENV || '';

const BASEURL =
  ['development', 'test'].indexOf(nodeEnv) >= 0
    ? 'http://localhost:8000/'
    : 'https://starfish-app-r4hzq.ondigitalocean.app/'; // iOS simulator & physical device w/ adb reverse
console.log('Using Baseurl: ', BASEURL);
// console.log('Env vars: ', process.env);
// const BASEURL = "http://10.0.2.2:8000/" // android emulator

const SPACES_URL = 'https://fitform.sfo3.digitaloceanspaces.com';

/*
   TestIDs
*/

class TestIDs {
  // Profile
  static OpenSettingsModalBtn = new TestIDs('OpenSettingsModalBtn');
  static CreatePersonalWorkoutGroupBtn = new TestIDs(
    'CreatePersonalWorkoutGroupBtn',
  );

  static GymRowTouchable = new TestIDs('GymRowTouchable');

  // Profile Settings Modal
  static CreateGymScreenBtn = new TestIDs('CreateGymScreenBtn');
  static CreateGymClassScreenBtn = new TestIDs('CreateGymClassScreenBtn');
  static CreateWorkoutGroupScreenBtn = new TestIDs(
    'CreateWorkoutGroupScreenBtn',
  );
  static ResetPasswordScreenBtn = new TestIDs('ResetPasswordScreenBtn');
  static CloseProfileSettingsBtn = new TestIDs('CloseProfileSettingsBtn');

  // Header
  static PlanetHome = new TestIDs('PlanetHome');

  // AuthScreen
  static SignInEmailField = new TestIDs('SignInEmailField');
  static SignInPasswordField = new TestIDs('SignInPasswordField');
  static SignInSubmit = new TestIDs('SignInSubmit');

  // RootStack (Bottom nav)
  static HomeTab = new TestIDs('HomeTab');
  static ProfileTab = new TestIDs('ProfileTab');

  // CreateGymScreen
  static GymTitleField = new TestIDs('GymTitleField');
  static GymDescField = new TestIDs('GymDescField');
  static GymSubmitBtn = new TestIDs('GymSubmitBtn');

  // CreateGymClassScreen
  static GymClassTitleField = new TestIDs('GymClassTitleField');
  static GymClassDescField = new TestIDs('GymClassDescField');
  static GymClassPrivateSwitch = new TestIDs('GymClassPrivateSwitch');
  static GymClassRNPickerTouchableGym = new TestIDs(
    'GymClassRNPickerTouchableGym',
  );
  static GymClassRNPickerModalGym = new TestIDs('GymClassRNPickerModalGym');
  static GymClassRNPickerGym = new TestIDs('GymClassRNPickerGym');
  static GymClassCreateBtn = new TestIDs('GymClassCreateBtn');

  // GymClassScreen
  static CreateWorkoutGroupScreenForClassBtn = new TestIDs(
    'CreateWorkoutGroupScreenForClassBtn',
  );

  // WorkoutGroupScreen
  static WorkoutGroupTitleField = new TestIDs('WorkoutGroupTitleField');
  static WorkoutGroupCaptionField = new TestIDs('WorkoutGroupCaptionField');
  static WorkoutGroupCreateBtn = new TestIDs('WorkoutGroupCreateBtn');

  // Workout Screen
  static CreateRegularWorkoutBtn = new TestIDs('CreateRegularWorkoutBtn');
  static ToggleShowCreateWorkoutBtns = new TestIDs(
    'ToggleShowCreateWorkoutBtns',
  );

  // Create Workout Screen
  static CreateWorkoutTitleField = new TestIDs('CreateWorkoutTitleField');
  static CreateWorkoutDescField = new TestIDs('CreateWorkoutDescField');

  static CreateWorkoutAddItemBtn = new TestIDs('CreateWorkoutAddItemBtn');
  static CreateWorkoutCreateBtn = new TestIDs('CreateWorkoutCreateBtn');

  #name: string;

  constructor(name) {
    this.#name = name;
  }

  name() {
    return this.#name;
  }

  toString() {
    return this.#name;
  }
}

export {BASEURL, SPACES_URL, TestIDs};
