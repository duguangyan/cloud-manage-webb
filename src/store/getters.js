const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  device: state => state.app.device,
  deviceId: state => state.user.deviceId,
  token: state => state.user.access_token,
  refreshToken: state => state.user.refreshToken,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userId: state => state.user.userId,
  phone: state => state.user.phone,
  shopId: state => state.user.shopId,
  routes: state => state.permission.routes
}
export default getters
