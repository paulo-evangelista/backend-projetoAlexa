import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Schedules from "./components/Schedules";
import ScheduleForm from "./components/ScheduleForm";
import LoadingOverlay from "./components/LoadingOverlay";
import {LocalNotifications} from "@capacitor/local-notifications"

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

  const toggleBuzzer = async () => {
    setIsUpdating(true);
    await axios.get("https://back-jdb0.onrender.com/createBuzzer")
    setIsUpdating(false);
  }

  useEffect(async () => {
    const res = await LocalNotifications.checkPermissions()
    if(res.display != 'granted'){
      await LocalNotifications.requestPermissions()
      await LocalNotifications.createChannel({
        id: "default",
        name: "High Priority Channel",
        description: "Canal para notificações importantes",
        importance: 5, // Máxima importância para notificações heads-up
        visibility: 1, // Visibilidade pública
    });
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      {isUpdating ? <LoadingOverlay /> : null}
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
        onClick={toggleBuzzer}
          style={{
            display: "flex",
            borderRadius: "12px",
            marginTop: "30px",
            marginBottom: "10px",
            border: "0",
            fontWeight: "",
            fontSize: "20px",
            padding: "5px 12px",
            backgroundColor: "#228be0",
            color: "white",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-bell"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          Tocar campainha
        </button>
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
        <ScheduleForm
          setIsUpdating={setIsUpdating}
          fetchDataFunction={fetchData}
        />
        <Schedules
          setIsUpdating={setIsUpdating}
          schedulesArray={schedulesArr}
          fetchDataFunction={fetchData}
        />
      </header>
    </div>
  );
}

export default App;
