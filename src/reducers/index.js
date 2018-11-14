import { createStore, combineReducers, applyMiddleware } from 'redux'
import { routerReducer } from 'react-router-redux'
import thunk from 'redux-thunk'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import User from 'reducers/user'
import System from 'reducers/system'

let rootReducer = combineReducers({
  reduxAsyncConnect,
  routing: routerReducer,
  User,
  System
})

const store = createStore(rootReducer, applyMiddleware(thunk))
export { store, rootReducer }
