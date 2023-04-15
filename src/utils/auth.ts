// Manage state of current user

import {BASEURL} from './constants';
import {post} from './fetchAPI';
import {
  storeToken,
  getToken,
  clearToken,
  apiSlice,
} from '../redux/api/apiSlice';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
// The interface for the functions to be given, take no arguments and returns nothing
interface OnLogoutProps {
  (): void;
}
interface OnLoginProps {
  (success: boolean, msg: string): void;
}

class AuthManager {
  onLogout: OnLogoutProps[];
  onLogin: Map<string, OnLoginProps>;

  constructor() {
    this.onLogout = [];
    this.onLogin = new Map(); // Avoids multiple functions from same place.
  }

  listenLogout(fn: OnLogoutProps) {
    this.onLogout.push(fn);
  }

  listenLogin(fn: OnLoginProps, key: string) {
    this.onLogin.set(key, fn);
  }

  async login(email, password) {
    // Perform login, update tokens access and fresh tokens
    const res = await post(`${BASEURL}token/`, {email: email, password});
    const result = await res.json();
    console.log('Login res: ', result);
    // WHen user is_active=False
    // {"detail": "No active account found with the given credentials"}

    let loggedIn = false;
    let msg = '';
    if (result.refresh && result.access) {
      if (
        (await storeToken(result.access)) &&
        (await storeToken(result.refresh, false))
      ) {
        loggedIn = true;
      } else {
        msg = 'Failed to store token.';
      }
    } else if (
      result.detail == 'No active account found with the given credentials'
    ) {
      msg = 'No active account found with the given credentials';
    } else {
      msg = 'Failed to login';
    }

    [...this.onLogin.keys()].forEach(key => {
      console.log('calling this on login@');
      const fn = this.onLogin.get(key);
      if (fn) {
        fn(loggedIn, msg);
      }
    });
    // Only call this on successful login.
  }

  async logout() {
    console.log('Loggin out');
    if (await clearToken()) {
      this.onLogout.forEach(fn => fn());
    }
  }

  async refreshToken(): Promise<boolean> {
    // Get refresh token and refresh the access token
    const res = await fetch(`${BASEURL}token/refresh/`);
    console.log('Refresh res', res);
    return true;
  }
}

const auth = new AuthManager();
export default auth;
