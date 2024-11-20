import {Routes, Route} from 'react-router-dom' 
import Home from './components/Home/Home'
import Success from './components/Result/Success';
import './App.css'

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
  }
`;

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <Routes>
          <Route path='' element={<Home/>}/>
          <Route path='Success' element={<Success/>}/>
      </Routes>
    </div>
  );
}

export default App;
