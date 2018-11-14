import React from 'react'
import { RenderRoutes } from 'src/routes'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { ToastContainer } from 'react-toastify'

class App extends React.Component {
  render () {
    return (
      <div>
        <RenderRoutes routes={this.props.route.routes} />
        <ToastContainer />
      </div>
    )
  }
}

export default connect()(withRouter(App))
