import * as types from 'constants/actionTypes';

const initialState = {}

export default function user (state = initialState, action = {}) {
  switch (action.type) {
    case types.SET_CURRENT_USER:
      return Object.assign({}, state, {
        userInfo: action.user
      })
    default:
      return state
  }
}
