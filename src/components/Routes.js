import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Dashboard from './pages/Dashboard';
import Governance from './pages/Governance';
import Reward from './pages/Reward';
import Admin from './pages/Admin';


function AppRoutes() {
  function wrongPath() {
    return <h1>Wrong Url ...</h1>;
  }

  return (
    <Routes>
      <Route exact path='/' element={<Main />} />
      <Route exact path='/Dashboard' element={<Dashboard />}    />
      <Route exact path='/Reward' element={<Reward />}  />
      <Route path='/Governance' element={<Governance />}/>
      <Route path='/Admin' element={<Admin />}/>
      <Route render={wrongPath} />
    </Routes>
  );
}

export default AppRoutes;