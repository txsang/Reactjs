import React from 'react';
import PropTypes from 'prop-types'
import { RenderRoutes } from 'src/routes';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReduxAsyncConnect } from 'redux-connect';
import { Provider } from 'react-redux';

const Root = ({ store, routes }) => (
  <Provider store={store}>
    <Router>
      <ReduxAsyncConnect routes={routes} />
    </Router>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
  routes: PropTypes.array.isRequired
}

export default Root;
