import {Routes, Route} from 'react-router-dom' 
import IsomorphicGraph from './components/FirstTask/IsomorphicGraph/IsomorphicGraph'
import Success from './components/FirstTask/Result/Success';
import Home from './components/Home/Home'
import KeyExchange from './components/SecondTask/KeyExchange/KeyExchange'
import Voting from './components/Final/Voting/Voting';
import InvalidUser from './components/Final/InvalidUser/InvalidUser';
import SuccessVote from './components/Final/SuccessVote/SuccessVote';
import Result from './components/Final/Result/Result'
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
          <Route path='Voting' element={<Voting/>} />
          <Route path='InvalidUser' element={<InvalidUser/>} />
          <Route path='SuccessVote' element={<SuccessVote/>} />
          <Route path='Result' element={<Result/>} />
      </Routes>
    </div>
  );
}

export default App;
