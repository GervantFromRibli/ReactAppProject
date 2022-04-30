import './App.css';
import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router';
import { Container } from 'reactstrap';

import {AuthService} from './services';
import {WarningContainer, CustomerContainer, LoginContainer, DepartmentContainer, EmployeeContainer, AppointmentContainer} from './containers';

function App() {

  const [isRender, setIsRender] = useState(false)

  useEffect(() => {
    async function checkRole(){
      await getCurrentUser();
    }
    checkRole();
  }, [])

  const getCurrentUser = async () => {
    var token = AuthService.getCookie("Token")
    if (token == undefined){
      setIsRender(false)
    }
    else{
      setIsRender(true)
    }
  }

  if (isRender){
    return (
      <div>
        <Container>
          <Routes>
            <Route path='/login'  element={<LoginContainer />}/>
            <Route path='/customer' element={<CustomerContainer/>}/>
            <Route path='/department' element={<DepartmentContainer/>}/>
            <Route path='/employee' element={<EmployeeContainer/>}/>
            <Route path='/' element={<AppointmentContainer/>}/>
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
            <Route path='/' element={<WarningContainer />}/>
            <Route path='/login'  element={<LoginContainer />}/>
          </Routes>
        </Container>
      </div>
    );
  }
}

export default App;
