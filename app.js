const nodemon = require("nodemon")
const express = require("express")
const mqtt = require("mqtt")
const app = express();
var options = {
  host: "5ea7583b9e2a4b688fb17bc3928614d8.s2.eu.hivemq.cloud",
  port: 8883,
  protocol: "mqtts",
  username: "pauleradixz",
  password: "Paulitos12!",
};

const port = process.env.PORT || 3000;

 const mqttClient = mqtt.connect(options);

const lastTemp = {
  temp: 99.9,
  date: new Date(),
  time: new Date()
}

mqttClient.on('connect', () => {
    console.log("Connected to MQTT broker")
})
mqttClient.on('error', (e) => {
    console.log(e)
})
mqttClient.subscribe("projetoAlexa/espOut")

mqttClient.on("message", (topic, msg) => {
  console.log("Nova temperatura recebida -> " + msg.toString())
  lastTemp.temp = msg.toString();
  lastTemp.time = (new Date()).toLocaleTimeString("pt-BR", {timeZone: "America/Sao_Paulo"})
  lastTemp.date = (new Date()).toLocaleDateString("pt-BR", {timeZone: "America/Sao_Paulo"})
})

mqttClient.publish("projetoAlexa/espIn","getTemp")

app.get("/getTemp", (req, res) => {
  console.log("oie");
  mqttClient.publish("projetoAlexa/espIn","getTemp")
  setTimeout(() => {
    res.status(200).send(JSON.stringify(lastTemp))
  }, 2000)

})
app.post("/power", (req, res) => {
  let data = req.body.data
  console.log(data);
  mqttClient.publish("projetoAlexa/espIn", data);
})

app.listen(port, () => {
  console.log("Server is running on port 3000")
})