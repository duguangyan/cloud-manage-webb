import Cookies from 'js-cookie'

const TokenKey = 'access_token'
const Uuid = 'browser_uuid'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUuid() {
  return Cookies.get(Uuid)
}

export function setUuid(uuid) {
  return Cookies.set(Uuid, uuid)
}

export function removeUuid() {
  return Cookies.remove(Uuid)
}
