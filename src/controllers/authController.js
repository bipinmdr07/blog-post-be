import HttpStatus from 'http-status-codes';

import * as githubService from '../services/githubService';
import * as authService from '../services/authService';

import config from '../config';

/**
 * Login the user into the system.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function login(req, res, next) {
  const loginPayload = req.body;

  try {
    res.status(HttpStatus.OK).json({ loginPayload });
  } catch (err) {
    next(err);
  }
}

/**
 * Handles the redirection from the github after oAuth login.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function oauthAuthentication(req, res, next) {
  const { code } = req.query;

  try {
    const token = await githubService.getAccessToken(code);
    const userData = await githubService.getUserInfo(token);

    const { accessToken } = await authService.loginForOauthUser(userData);

    res.redirect(`${config.fe.baseUrl}/auth/login?access_token=${accessToken}`);
  } catch (err) {
    next(err);
  }
}
