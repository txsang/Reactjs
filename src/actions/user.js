import * as types from 'constants/actionTypes';
import { API_URL } from 'constants/config'
import axios from 'axios';

const CancelToken = axios.CancelToken;
let canceledList = [];

export function getInforUser(Id, token) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      resolve(Id + token)
    });
  }
}

export function setCurrentUser(user) {
  return dispatch => {
    dispatch({type: types.SET_CURRENT_USER, user})
  }
}

function getKey() {
  return dispatch => {
    let key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    if (canceledList.filter(item => item.key == key).length > 0) {
      return dispatch(getKey());
    } else {
      return key
    }
  }
}

export function getUser(params, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  return dispatch => {

    let Item =  {
      key: dispatch(getKey()),
      canceled: CancelToken.source()
    }

    canceledList.push(Item);
    let indexItem = canceledList.length - 1;

    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: `${API_URL}/user`,
        params,
        cancelToken: canceledList[indexItem].canceled.token
      }).then(response => {
        resolve(response);
      }).catch(error => {
        if (error.message.indexOf('cancel_API') !== -1) {
          //do nothing
        } else {
          dispatch({type: types.MESSAGE_ERROR, description: 'Đã có lỗi xảy ra'});
        }
      });
    });
  }
}

export function cancelUserAPI() {
  return dispatch => {
    canceledList.map(item => {
      item.canceled.cancel(`cancel_API-${item.key}`);
    })
  }
}