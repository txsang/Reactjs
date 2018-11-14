import React, { Component } from 'react'
import PropTypes from 'prop-types'

class MainLayout extends Component {
  render () {
    const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {}))
    return (
      <div className={`wrapper-container ${this.props.classOver}`}>
        <main className='main-container'>
          {childrenWithProps}
        </main>
      </div>
    )
  }
}

MainLayout.propTypes = {
  classOver: PropTypes.string
}

export default MainLayout
