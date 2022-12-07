import express from "express";
import { connect } from "mqtt";
const app = express();
var options = {
  host: "5ea7583b9e2a4b688fb17bc3928614d8.s2.eu.hivemq.cloud",
  port: 8883,
  protocol: "mqtts",
  username: "pauleradixz",
  password: "Paulitos12!",
};

const port = process.env.PORT || 3000;

const mqttClient = connect(options);

const lastTemp = {
  temp: 99.9,
  time: new Date(),
};

mqttClient.on("connect", () => {
  console.log("--conectado ao MQTT");
});
mqttClient.on("error", (e) => {
  console.log("ERRO MQQT! -> "+e);
});
mqttClient.subscribe("projetoAlexa/espOut");

mqttClient.on("message", (topic, msg) => {
  console.log("Nova temperatura recebida -> " + msg.toString());
  lastTemp.temp = msg.toString();
  lastTemp.time = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
  console.log("temperatura registrada -> " + lastTemp.temp +" em "+lastTemp.time);
});

mqttClient.publish("projetoAlexa/espIn", "getTemp");

app.get("/getTemp", (req, res) => {
  console.log("Novo pedido de temperatura recebido!");
  mqttClient.publish("projetoAlexa/espIn", "getTemp");
  setTimeout(() => {
    res.status(200).send(JSON.stringify(lastTemp));
    console.log("Enviando temperatura -> " + JSON.stringify(lastTemp));
  }, 2000);
});
app.post("/sendCommand", (req, res) => {
  try{
    let data = req.body.data;
  } catch (e) {
    console.log("Erro ao receber comando! -> " + e);
    res.send(400)
  }
  if (!req.body.data) {
    res.send(400)
    console.log("Erro! o body.data é nulo!");
  }
  console.log("Novo comando recebido! -> " + data);
  mqttClient.publish("projetoAlexa/espIn", data);
  console.log("comando enviado para o MQTT!");
  res.status(200)
});

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
