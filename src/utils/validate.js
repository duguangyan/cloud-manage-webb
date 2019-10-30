/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validTelphone(str) {
  return /^1[3456789]\d{9}$/.test(str)
}

/**
* @param {string} str
* @returns {Boolean}
*/
export function validWord(str) {
  return /^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(str)
}

/**
* @param {string} str
* @returns {Boolean}
*/
export function validInt(str) {
  return /^[0-9]+$/.test(str)
}
