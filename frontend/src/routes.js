import React from "react";
import authorization from './pages/authorization/authorization';
import Register from './pages/registration/registration';
import Lk from './pages/lk/lk';
import { Redirect, Route, Switch } from 'react-router';


export const UserRoutes = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route exact path='/lk' component={Lk} />
        <Redirect to='/' />
      </Switch>
    )
  }

  return (
    <Switch>
      <Route exact path='/authorization' component={authorization} />
      <Route exact path='/registration' component={Register} />
      <Redirect to='/authorization' />
    </Switch>
  )
}