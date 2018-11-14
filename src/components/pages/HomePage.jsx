import React, { Component } from 'react'
import MainLayout from 'components/layouts'
import propTypes from 'prop-types'
import { withCookies, Cookies } from 'react-cookie'
import { connect } from 'react-redux'
import * as actions from 'actions/user'
import { Link } from 'react-router-dom'

class HomePage extends Component {
  constructor (props, context) {
    super(props, context)
    const { cookies } = props
    this.state = {
      user: cookies.get('userInfo') || 'Ben'
    }
  }

  componentWillMount () {
    const { cookies } = this.props
    cookies.set('userInfo', 'Xuân Sang', { path: '/' })
  }

  componentDidMount () {
    this.getUserInfo()
  }

  getUserInfo () {
    this.props.dispatch(actions.getInforUser(1, this.state.user)).then(respone => {
      console.log(respone)
      this.props.dispatch(actions.setCurrentUser(respone))
    })
  }

  cancelAPI () {
    this.props.dispatch(actions.cancelUserAPI())
  }

  callAPI () {
    this.props.dispatch(actions.getUser()).then(respone => {
      console.log(respone)
    }).catch(err => {
      console.log(err)
    })
  }

  componentWillUnmount () {
    this.props.dispatch(actions.cancelUserAPI())
  }

  render () {
    return (
      <MainLayout>
        <div>
          {this.state.user}
          <button onClick={this.callAPI.bind(this)}>Call API</button>
          <button onClick={this.cancelAPI.bind(this)}>Canceled API</button>
          <Link to='/home'>go to another page</Link>
        </div>
      </MainLayout>
    )
  }
}

const bindStateToProps = state => {
  return {
    userInfo: state.User.userInfo || ''
  }
}

const bindDispatchToProps = dispatch => ({
  dispatch
})

HomePage.propTypes = {
  cookies: propTypes.instanceOf(Cookies).isRequired
}

export default connect(bindStateToProps, bindDispatchToProps)(withCookies(HomePage))
