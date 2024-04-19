import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Schedules from "./components/Schedules";
import ScheduleForm from "./components/ScheduleForm";
import LoadingOverlay from "./components/LoadingOverlay";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Haptics, ImpactStyle } from '@capacitor/haptics';

function App() {
  const [temperature, setTemperature] = useState("--");
  const [ACState, setACState] = useState(false);
  const [schedulesArr, setSchedulesArr] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastEspUpdateString, setLastEspUpdateString] = useState("--");
  const ws = useRef(null);

  const setupNotifications = async () => {
    const res = await LocalNotifications.checkPermissions();
    if (res.display != "granted") {
      await LocalNotifications.requestPermissions();
      await LocalNotifications.createChannel({
        id: "default",
        name: "High Priority Channel",
        description: "Canal para notificações importantes",
        importance: 5, // Máxima importância para notificações heads-up
        visibility: 1, // Visibilidade pública
      });
    }
  };

  const toggleACState = () => {
    Haptics.impact({ style: ImpactStyle.Heavy });
    try {
      if (ws.current.readyState === WebSocket.OPEN) {
        ws.current.send("SETAC");
        setACState(!ACState);
      }
    } catch (error) {
      console.log("erro");
    }
  };

  const fetchData = () => {
    setInterval(() => {
      console.log("atualizando");
      try {
        if (ws.current.readyState === WebSocket.OPEN) {
          ws.current.send("GET");
        }
      } catch (error) {
        console.log("erro");
      }
    }, 5000);
  };

  const sendNewSchedule = (timestamp) => {
    Haptics.impact({ style: ImpactStyle.Heavy });

    try {
      if (ws.current.readyState === WebSocket.OPEN) {
        if (timestamp > 17134112910) {
          console.log(
            "Invalid timestamp, looks like its in miliseconds, not seconds"
          );
          return;
        }
        ws.current.send(`SETSCT:${timestamp}`);
        setSchedulesArr([...schedulesArr, timestamp]);
      }
    } catch (error) {
      console.log("erro");
    }
  };

  const removeSchedule = (timestamp) => {
    Haptics.impact({ style: ImpactStyle.Heavy });
    try {
      if (ws.current.readyState === WebSocket.OPEN) {
        if (timestamp > 17134112910) {
          console.log(
            "Invalid timestamp, looks like its in miliseconds, not seconds"
          );
          return;
        }

        ws.current.send(`REMSCH-${timestamp}`);
      }
    } catch (error) {
      console.log("erro");
    }
  }

  const makeLastEspUpdateString = (lastEspUpdate) => {
    let timeDistante = Math.floor(Date.now() / 1000) - lastEspUpdate;
    if (timeDistante < 60) {
      setLastEspUpdateString(`Agora (${timeDistante}s)`);
    } else if (timeDistante < 3600) {
      setLastEspUpdateString(`${Math.floor(timeDistante / 60)} minutos atrás`);
    } else if (timeDistante < 86400) {
      setLastEspUpdateString(`${Math.floor(timeDistante / 3600)} horas atrás`);
    } else {
      setLastEspUpdateString(`${Math.floor(timeDistante / 86400)} dias atrás`);
    }
  };

  useEffect(() => {
    fetchData();
    setupNotifications();

    ws.current = new WebSocket("wss://back-jdb0.onrender.com/");
    ws.current.onopen = () => {
      console.log("WebSocket opened");
      ws.current.send("GET");
      setIsUpdating(false);
    };
    ws.current.onclose = () => {
      setIsUpdating(true);
    };
    ws.current.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        setACState(data.isAirCondicionerOn);
        makeLastEspUpdateString(data.lastEspUpdate);
        setSchedulesArr(data.schedulesArray);
      } catch (error) {}
    };
    return () => {
      ws.current.close();
    };
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
            onClick={toggleACState}
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
            onClick={toggleACState}
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
          onClick={() => {}}
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
        <p>
          Última atualização do ESP:
          <br />
          {lastEspUpdateString}
        </p>
        <ScheduleForm
          schedulesArray={schedulesArr}
          sendNewScheduleFunction={sendNewSchedule}
        />
        <Schedules removeScheduleFunction={removeSchedule} schedulesArray={schedulesArr} />
      </header>
    </div>
  );
}

export default App;
