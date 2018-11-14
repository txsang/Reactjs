import App from 'src/app'
import { HomePage } from 'components/pages'

const routes = [
  {
    component: App,
    routes: [
      { path: '/', exact: true, component: HomePage },
      { path: '/home', exact: true, component: HomePage }
    ]
  }
]

export default routes
