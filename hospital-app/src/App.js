import './App.css';
import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router';
import { Container } from 'reactstrap';

import LoginContainer from './containers/LoginContainer';
import AppointmentContainer from './containers/AppointmentContainer';
import {AuthService} from './services';

function App() {

  const [isRender, setIsRender] = useState(true)
  const [isNotLogged, setIsNotLogged] = useState(false)

  useEffect(() => {
    async function checkRole(){
      await getCurrentUser();
    }
    checkRole();
  }, [])

  const getCurrentUser = async () => {
    var token = AuthService.getCookie("Token")
    if (token === undefined){
      if (window.location.href.endsWith("/login") == false){
        window.location.replace("http://localhost:3000/login")
      }
    }
    else{
      var role = await AuthService.getRole()
      alert(role.role)
      if (role.role != "Doctor"){
        setIsRender(false)
      }
    }
  }

  if (isRender){
    return (
      <div>
        <Container>
          <Routes>
            <Route path='/login'  element={LoginContainer()}/>
            <Route path='/' element={AppointmentContainer()}/>
          </Routes>
        </Container>
      </div>
    );
  }
  else{
    return (
      <div>
        <Container>
          <Routes>
            <Route path='/' element={AppointmentContainer()}/>
          </Routes>
        </Container>
      </div>
    );
  }
}

export default App;
