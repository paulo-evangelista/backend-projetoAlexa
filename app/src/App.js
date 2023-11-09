import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Schedules from "./components/Schedules";
import ScheduleForm from "./components/ScheduleForm";
import LoadingOverlay from "./components/LoadingOverlay";

function App() {
  const [temperature, setTemperature] = useState("--");
  const [ACState, setACState] = useState(false);
  const [schedulesArr, setSchedulesArr] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchData = async () => {
    setIsUpdating(true);
    const res = await axios.get("https://back-jdb0.onrender.com/getData");
    // const res = await axios.get("http://localhost:3000/getData");
    console.log(res.data);
    setACState(res.data.isAirCondicionerOn);
    setTemperature(res.data.currentTemp);
    if (res.data.schedulesArray) {
      setSchedulesArr(res.data.schedulesArray);
    }
    setIsUpdating(false);
  };

  const toggleAC = () => {
    setIsUpdating(true);
    axios.get("https://back-jdb0.onrender.com/toggleAC").then((res) => {
      fetchData();
    });
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <div className="App">
      {isUpdating ? <LoadingOverlay/> : null}
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Temperatura:{" "}
          <span style={{ fontWeight: "bold", fontSize: "25px" }}>
            {temperature}°C
          </span>{" "}
          <br />
        </p>
        <p>
          Ar condicionado:{" "}
          <span style={{ fontWeight: "bold", fontSize: "25px" }}>
            {ACState ? "Ligado" : "Desligado"}
          </span>
        </p>
        {ACState ? (
          <button
            onClick={toggleAC}
            style={{
              borderRadius: "12px",
              border: "0",
              fontWeight: "bold",
              fontSize: "20px",
              padding: "10px 25px",
              backgroundColor: "red",
              color: "white",
            }}
          >
            desligar
          </button>
        ) : (
          <button
            onClick={toggleAC}
            style={{
              borderRadius: "12px",
              border: "0",
              fontWeight: "bold",
              fontSize: "30px",
              padding: "15px 40px",
              backgroundColor: "green",
              color: "white",
            }}
          >
            ligar
          </button>
        )}
        <button
          onClick={fetchData}
          style={{
            borderRadius: "12px",
            marginTop: "30px",
            marginBottom: "30px",
            border: "0",
            fontWeight: "",
            fontSize: "20px",
            padding: "10px 25px",
            backgroundColor: "gray",
            color: "white",
          }}
        >
          Atualizar dados
        </button>
        <ScheduleForm setIsUpdating={setIsUpdating} fetchDataFunction={fetchData} />
        <Schedules setIsUpdating={setIsUpdating} schedulesArray={schedulesArr} fetchDataFunction={fetchData} />
      </header>
    </div>
  );
}

export default App;
