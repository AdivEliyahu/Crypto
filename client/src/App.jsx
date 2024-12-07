import {Routes, Route} from 'react-router-dom' 
import IsomorphicGraph from './components/FirstTask/IsomorphicGraph/IsomorphicGraph'
import Success from './components/FirstTask/Result/Success';
import Home from './components/Home/Home'
import KeyExchange from './components/SecondTask/KeyExchange/KeyExchange'
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
          <Route path='Isomorfphic Graph' element={<IsomorphicGraph/>}/>
          <Route path='Success' element={<Success/>}/>
          <Route path='Diffie Hellman & AES' element={<KeyExchange/>} />

      </Routes>
    </div>
  );
}

export default App;
