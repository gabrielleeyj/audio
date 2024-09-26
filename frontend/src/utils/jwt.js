import {isString} from "./type-check";

/**
 * Parse JWT claims
 *
 * https://datatracker.ietf.org/doc/html/rfc7519#section-4
 *
 * @param {string} token
 * @returns {JWTClaims}
 */
export const parseClaims = (token) => {
  if (!isString(token) || token === '') {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    const json = atob(parts[1]);
    const claims = JSON.parse(json);
    return claims;
  } catch (error) {
    return null;
  }
}

/**
 * @typedef {object} JWTClaims
 * @property {number} [exp]
 */


