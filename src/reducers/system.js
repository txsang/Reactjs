import * as types from 'constants/actionTypes';
import { toast, cssTransition  } from 'react-toastify';

const initialState = {
}

const transition = cssTransition({
  enter: 'fadeIn',
  exit: 'fadeOut',
  duration: 500
});

function showMessage(status, description) {
  switch(status) {
    case 'error':
      return toast.error(description, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        transition: transition
      })
      break;
    case 'warning':
      return toast.warn(description, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        transition: transition
      })
      break;
    case 'success':
      return toast.success(description, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        transition: transition
      })
      break;
    default:
      return toast.info(description, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        transition: transition
      })
      break;
  }
}

export default function system (state = initialState, action = {}) {
  switch (action.type) {
    case types.MESSAGE_ERROR:
      return showMessage('error', action.description)
    case types.MESSAGE_SUCCESS:
      return showMessage('success', action.description)
    case types.MESSAGE_WARING:
      return showMessage('warning', action.description)
    default:
      return state
  }
}
