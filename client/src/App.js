
import {Routes, Route} from 'react-router-dom' 
import Home from './components/Home/Home'
import IsoGraph from './components/IsoGraph/IsoGraph'
import { Component } from 'react';

//test
function App() {
  return (
    <div className="App">
      <Routes>
          <Route path='' element={<Home/>}/>
          <Route path='IsoGraph' element={<IsoGraph/>}/>
      </Routes>
    </div>
  );
}

export default App;
