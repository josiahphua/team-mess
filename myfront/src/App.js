import React, { useState, useEffect } from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import AllCases from './components/cases/AllCases';
import PendingCases from './components/cases/PendingCases';
import ClosedCases from './components/cases/ClosedCases';
import SingleCaseView from './components/cases/SingleCaseView';
import Navigation from './components/nav/Navigation';
import Registration from './components/auth/Registration';
import Login from './components/auth/Login';
import LandingPage from './components/main_pages/LandingPage';
import Home from './components/main_pages/Home';

import VoucherMother from './components/voucher/VoucherMother';


import axios from "axios";
import Profile from "./components/auth/Profile";
import SubmitCase from './components/cases/SubmitCase';


function App() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {

    //This function is to check if a user has logged in..
    async function setUserStats() {
      try {
        let {data} = await axios.get("/api/auth/user", {
          headers: {
            authorization: `Bearer ${localStorage.token}`
          }
        })

        await setAuth(true)
        await setUser(data.user)
      } catch (e) {
        await setAuth(false)
        await setUser(null)

        localStorage.removeItem("token")
      }
    }

    setUserStats()


  }, [auth])

  function logout(){
    setAuth(false)
    setUser(null)
    localStorage.removeItem("token")
  }

  return (

      <BrowserRouter>

        <Navigation auth={auth} user={user} logout={logout}/>

        <Switch>

          <Route path="/" exact>
            <LandingPage auth={auth}/>
          </Route>

          <Route path="/api/auth/login">
            <Login setAuth={setAuth}/>
          </Route>

          <Route path="/api/auth/register">
            <Registration setAuth={setAuth}/>
          </Route>

          <PrivateRouter auth={auth} path="/user/home" Component={Home} user={user} setUser={setUser} setAuth={setAuth} exact/>
          <PrivateRouter auth={auth} path="/api/auth/profile" Component={Profile} setAuth={setAuth} user={user} setUser={setUser} exact/>
          <PrivateRouter auth={auth} path="/cases" Component={AllCases} exact/>
          <PrivateRouter auth={auth} path="/api/cases/pending/:id" Component={SingleCaseView} user={user} exact/>
          <PrivateRouter auth={auth} path="/case/submit" Component={SubmitCase} setAuth={setAuth} user={user} exact/>
          <PrivateRouter auth={auth} path="/vouchers" Component={VoucherMother} setAuth={setAuth} user={user} exact/>
          <Route path="*">404</Route>

        </Switch>
      </BrowserRouter>
  )
}

function PrivateRouter({auth, Component, path, location, ...rest}) {
  //if auth is true then show Route else redirect to login
  return (
      <>
        {(auth) ?
            <Route path={path} >
              <Component {...rest}/>
            </Route> : <Redirect to={{
              pathname: "/",
              state: {from: location}
            }}/>
        }
      </>
  )
}
export default App

