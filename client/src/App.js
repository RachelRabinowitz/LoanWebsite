import React, { useState, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom';
import './App.css';
import GeneralNav from './components/GeneralNav/GeneralNav';
import RouteError from './components/RouteError/RouteError';
import Home from './components/Home/Home'
import GemachPage from './components/GemachPage/GemachPage'
import Footer from './components/Footer/Footer'
import Manager from './components/Manager/Manager'
import TopManager from './components/TopManager/TopManager'

import { getItem } from './service/DataBase'


function App() {

  const [userLogged, setUserLogged] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isTopManager, setIsTopManager] = useState(false);
  const [repayChange, setRepayChange] = useState(false);
  const [changeDetails, setChangeDetails] = useState(false);

  const userIsLogged = () => {
    setUserLogged(true);
  }

  const userIsNotLogged = () => {
    setUserLogged(false);
  }

  const userManager = () => {
    setIsManager(true);
  }

  const userIsNotManager = () => {
    setIsManager(false);
  }

  const changeRepay = () => {
    setRepayChange(!{...repayChange})
  }

  const changeGenDet = () => {
    setChangeDetails(!{...changeDetails})
  }

  useEffect(async () => {
    if (userLogged) {
      let currentUser = JSON.parse(sessionStorage.getItem("user"));
      if (currentUser !== null) {
        setUserLogged(true);
        let user = await getItem('users', currentUser.id);
        if (user !== null && user !== undefined && user.type === "manager") {
          setIsManager(true);
        }
        else {
          setIsManager(false);
        }
        let details = await getItem('generalDetails', 1)
        if (user.id === details.manager.id) {
          setIsTopManager(true);
        }
      }
    }
    else {
      setIsManager(false);
      setIsTopManager(false);
    }
  }, [userLogged])


  return (
    <div className="App">
      <GeneralNav setUserStatus={userIsLogged} setUserStatusOut={userIsNotLogged} userStatus={userLogged} userIsManager={isManager} repayChange={repayChange} isTopManager={isTopManager} />
      <Switch>
        <Route exact path='/'  >
          <Home userStatus={userLogged} setToManager={userManager} changeGenDet={changeGenDet} changeDetails={changeDetails} />
        </Route>
        <Route path={'/gemachim/:id'} render={(props) => <GemachPage {...props} userStatus={userLogged} changeRepay={changeRepay} />} />
        {
          (isManager)
          &&
          <Route path='/manager'  >
            <Manager userStatus={userLogged} isManager={isManager} userIsNotManager={userIsNotManager} changeGenDet={changeGenDet} />
          </Route>
        }
        {
          (isTopManager)
          &&
          <Route path='/topManager'  >
            <TopManager userStatus={userLogged} />
          </Route>
        }
        <Route component={RouteError} />
      </Switch>
      <Footer setUserStatus={userIsNotLogged} userStatus={userLogged} />
    </div>
  );
}

export default App;


