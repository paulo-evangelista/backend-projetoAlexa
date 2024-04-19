import WebSocket, { WebSocketServer } from "ws";
import { readFile, writeFile } from "fs";

// Inicializa um servidor WebSocket na porta 8080
console.log("running on port: ", process.env.PORT || 8080);
const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

wss.on("connection", function connection(ws) {
  // Recebe mensagens do cliente
  ws.on("message", function incoming(message) {
    const cases = message.toString().slice(0, 6);
    switch (cases) {
      // Quando o aplicativo pede os dados
      case "GET":
        readFile("data.json", (err, data) => {
          handleGet(JSON.parse(data), ws);
        });
        break;

      case "ESPGET":
        readFile("data.json", (err, data) => {
          handleEspGet(JSON.parse(data), ws);
        });
        break;

      // Quando o ESP manda a temperatura atual
      // Formato: SETTMP-xx (temperatura atual)
      case "SETTMP":
        console.log("received temp: " + parseInt(message.slice(7)));
        updateTemperature(parseInt(message.slice(7)));
        ws.send(`setted temperature: ${parseInt(message.slice(7))}`);
        break;

      // Quando o ESP mudou o estado do ar condicionado
      // Formato: SETAC (sem parametros)
      case "SETAC":
        console.log("Ar condicionado alterado");
        updateAC();
        ws.send("alterado");
        break;

      // Quando o ESP seta um horario para mudar o estado do ar condicionado
      // Formato: SETSCH-xxxxxxxx (quantidade de segundos até a mudança)
      case "SETSCS":
        createScheduleBySeconds(parseInt(message.slice(7)));
        ws.send(
          "schedule created for: " +
            (Math.floor(Date.now() / 1000) + parseInt(message.slice(7)))
        );
        break;

      case "SETSCT":
        createScheduleByTimestamp(parseInt(message.slice(7)));
        ws.send("schedule created for: " + parseInt(message.slice(7)));
        break;

      case "REMSCH":
        removeSchedule(parseInt(message.slice(7)));
        ws.send("trying to remove " + parseInt(message.slice(7)));
        break;

      case "SETBUZ":
        toggleBuzzer();
        break;

      default:
        console.log("Invalida command:" + message);
    }
  });

  // Envia uma mensagem para o cliente
  ws.send("success");
});

const updateJsonFile = (obj) => {
  writeFile("data.json", JSON.stringify(obj), (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const updateAC = () => {
  readFile("data.json", (err, data) => {
    const obj = JSON.parse(data);
    obj.isAirCondicionerOn = !obj.isAirCondicionerOn;
    updateJsonFile(obj);
  });
};

const createScheduleBySeconds = (seconds) => {
  readFile("data.json", (err, data) => {
    const obj = JSON.parse(data);
    obj.schedulesArray.push(Math.floor(Date.now() / 1000) + seconds);
    updateJsonFile(obj);
  });
};

const createScheduleByTimestamp = (timestamp) => {
  // assure we have a timestamp of seconds, not miliseconds
  if (timestamp > 17134083450) {
    console.error(
      "Invalid timestamp, looks like its in miliseconds, not seconds"
    );
    return;
  }
  if (timestamp < Math.floor(Date.now() / 1000)) {
    console.error("Invalid timestamp, it's in the past");
    return;
  }

  readFile("data.json", (err, data) => {
    const obj = JSON.parse(data);
    obj.schedulesArray.push(timestamp);
    updateJsonFile(obj);
  });
};

const updateTemperature = (temperature) => {
  readFile("data.json", (err, data) => {
    const obj = JSON.parse(data);
    obj.currentTemp = temperature;
    updateJsonFile(obj);
  });
};

const handleGet = (data, ws) => {
  for (let i = 0; i < data.schedulesArray.length; i++) {
    if (data.schedulesArray[i] < Math.floor(Date.now() / 1000)) {
      data.isAirCondicionerOn = !data.isAirCondicionerOn;
      data.schedulesArray.splice(i, 1);
      updateJsonFile(data);
      console.log("removed schedule: ", data.schedulesArray[i]);
      console.log(data, "\n\n");
    }
  }

  data.time = new Date().toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "numeric",
    minute: "numeric",
  });

  ws.send(JSON.stringify(data));
};

const handleEspGet = (data, ws) => {
  for (let i = 0; i < data.schedulesArray.length; i++) {
    if (data.schedulesArray[i] < Math.floor(Date.now() / 1000)) {
      data.isAirCondicionerOn = !data.isAirCondicionerOn;
      data.schedulesArray.splice(i, 1);
      console.log("removed schedule: ", data.schedulesArray[i]);
      console.log(data, "\n\n");
    }
  }

  data.lastEspUpdate = Math.floor(Date.now() / 1000);
  updateJsonFile(data);

  data.time = new Date().toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "numeric",
    minute: "numeric",
  });

  ws.send(JSON.stringify(data));
};

const removeSchedule = (timestamp) => {
  readFile("data.json", (err, data) => {
    const obj = JSON.parse(data);
    const index = obj.schedulesArray.indexOf(timestamp);
    if (index > -1) {
      obj.schedulesArray.splice(index, 1);
      updateJsonFile(obj);
    }
  });
};

const toggleBuzzer = () => {
  readFile("data.json", (err, data) => {
    const obj = JSON.parse(data);
    obj.buzzer = !obj.buzzer;
    updateJsonFile(obj);
  });
};
