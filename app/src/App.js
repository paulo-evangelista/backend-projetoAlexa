import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
function App() {

  const [temperature, setTemperature] = useState(null);
  const [ACState, setACState] = useState(null);

  useEffect(() => {
    fetch('https://back-jdb0.onrender.com/getData', {mode: "no-cors"})
      .then((res) => {
        return res.json();
      }).then((res) => {
        alert(res)
        // setACState(res.data.isAirCondicionerOn);
        // setTemperature(res.data.currentTemp);
      })
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
