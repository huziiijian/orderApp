export default {
  namespace: 'global',

  state: {
    userInfo: {
      email: null,
      pwd: null,
      key: null
    }
  },

  subscriptions: {},

  effects: {
    // dispatch 用户信息
    // setUserInfo:想调用的方法，payload传递的信息，
    *setUserInfo({ payload }, { put }) {
      // 异步行为会先触发Effects然后流向Reducers
      yield put({ type: 'set_userinfo', payload });
    }
  },

  reducers: {
    // 设置用户信息 userInfo的state
    set_userinfo(state, { payload }) {
      return { ...state, userInfo: payload };
    }
  }
};
