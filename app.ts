import WebSocket, { WebSocketServer } from "ws";

interface IData {
  isAirCondicionerOn: boolean;
  currentTemp: number;
  schedulesArray: number[];
  buzzer: boolean;
  lastEspUpdate: number;
  time: string;
}

let data: IData = {
  isAirCondicionerOn: false,
  currentTemp: 32,
  schedulesArray: [],
  buzzer: true,
  lastEspUpdate: 1713316992,
  time: "",
};

const PORT = parseInt(process.env.PORT || "8080");

console.log("running on port: ", PORT);
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(msg) {
    const cases = msg.toString().slice(0, 6);
    const message = msg.toString();

    switch (cases) {
      case "GET":
        handleGet(ws);
        break;

      case "ESPGET":
        try {
          handleEspGet(ws);
        } catch (error) {
          console.error("Error on ESPGET: ", error);
          console.error("data read on json file: ", data);
        }
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

      // retorna o estado atual do ar condicionado para sincronização
      case "GETSYN":
        ws.send(
          // O campo isSyncMessage é para o ESP saber que é uma mensagem de sincronização, e não um comando ( serve caso o ESP tenha se desconectado e perdido a sincronização do estado do ar condicionado)
          JSON.stringify({ isAirCondicionerOn: data.isAirCondicionerOn, isSyncMessage: true})
        );
        break;

      default:
        console.log("Invalida command:" + message);
    }
  });

  // Envia uma mensagem para o cliente
  ws.send("success");
});

const updateAC = () => {
  data.isAirCondicionerOn = !data.isAirCondicionerOn;
};

const createScheduleBySeconds = (seconds: number) => {
  data.schedulesArray.push(Math.floor(Date.now() / 1000) + seconds);
};

const createScheduleByTimestamp = (timestamp: number) => {
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

  data.schedulesArray.push(timestamp);
};

const updateTemperature = (temperature) => {
  data.currentTemp = temperature;
};

const handleGet = (ws: WebSocket) => {
  for (let i = 0; i < data.schedulesArray.length; i++) {
    if (data.schedulesArray[i] < Math.floor(Date.now() / 1000)) {
      data.isAirCondicionerOn = !data.isAirCondicionerOn;
      data.schedulesArray.splice(i, 1);
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

const handleEspGet = (ws: WebSocket) => {
  for (let i = 0; i < data.schedulesArray.length; i++) {
    if (data.schedulesArray[i] < Math.floor(Date.now() / 1000)) {
      data.isAirCondicionerOn = !data.isAirCondicionerOn;
      data.schedulesArray.splice(i, 1);
      console.log("removed schedule: ", data.schedulesArray[i]);
      console.log(data, "\n\n");
    }
  }

  data.lastEspUpdate = Math.floor(Date.now() / 1000);
  data.time = new Date().toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "numeric",
    minute: "numeric",
  });

  ws.send(JSON.stringify(data));
};

const removeSchedule = (timestamp) => {
  const index = data.schedulesArray.indexOf(timestamp);
  if (index > -1) {
    data.schedulesArray.splice(index, 1);
  }
};

const toggleBuzzer = () => {
  data.buzzer = !data.buzzer;
};
