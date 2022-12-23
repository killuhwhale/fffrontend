const BASEURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/'
    : 'https://starfish-app-r4hzq.ondigitalocean.app/'; // iOS simulator & physical device w/ adb reverse
console.error('Using Baseurl: ', BASEURL);
// console.error('Env vars: ', process.env);
// const BASEURL = "http://10.0.2.2:8000/" // android emulator

const SPACES_URL = 'https://fitform.sfo3.digitaloceanspaces.com';
export {BASEURL, SPACES_URL};
