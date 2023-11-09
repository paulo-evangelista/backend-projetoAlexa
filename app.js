import express from "express";
import {writeFile, readFile} from "fs";
// import { connect } from "mqtt";
const app = express();
import cors from "cors";

app.use(cors());

app.get("/keepalive", (req, res)=>{
  res.send("ok")
})


app.get("/toggleAC", (req, res)=>{
  readFile("data.json", (err, data)=>{
    let obj = JSON.parse(data)
    obj.isAirCondicionerOn = !obj.isAirCondicionerOn
    writeFile("data.json", JSON.stringify(obj), (err)=>{
      if(err){
        console.log(err)
      } else {
        console.log("Ar condicionado alterado para: "+obj.isAirCondicionerOn)
        res.send(obj)
      }
    })
  })
})

app.get("/getData", (req, res)=>{
  readFile("data.json", (err, data)=>{
    let obj = JSON.parse(data)
    console.log("update requested...")
    res.send(obj)
  })
})

app.get("/sendTemp/:temp", (req, res)=>{
  console.log("received temp: "+parseInt(req.params.temp))

  readFile("data.json", (err, data)=>{
    let obj = JSON.parse(data)
    obj.currentTemp = parseInt(req.params.temp)

    writeFile("data.json", JSON.stringify(obj), ()=>{
        res.send("ok")
    })
} )
})

app.get("/createSchedule/:timestamp", (req, res)=>{

  readFile("data.json", (err, data)=>{
    let obj = JSON.parse(data)
    obj.schedulesArray.push(parseInt(req.params.timestamp))

    writeFile("data.json", JSON.stringify(obj), ()=>{
      console.log("adicionado novo schedule. Array: "+obj.schedulesArray)

        res.send("ok")
    })
} )
})

app.get("/removeSchedule/:timestamp", (req, res)=>{
  console.log("request to remove schedule: "+req.params.timestamp)

  readFile("data.json", (err, data)=>{
    let obj = JSON.parse(data)
    for (let i in obj.schedulesArray){
      if (obj.schedulesArray[i] == parseInt(req.params.timestamp)){
        console.log("schedule exists. removing...")
        obj.schedulesArray.splice(i, 1)
      }
    }

    writeFile("data.json", JSON.stringify(obj), ()=>{
      console.log("Array: "+obj.schedulesArray)

        res.send("ok")
    })
} )
})





// ---------------------------------------------------------------------------------------------------
// VERSÃO ANTIGA -------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------



// var options = {
  //   host: "5ea7583b9e2a4b688fb17bc3928614d8.s2.eu.hivemq.cloud",
  //   port: 8883,
  //   protocol: "mqtts",
  //   username: "pauleradixz",
//   password: "Paulitos12!",
// };

const port = process.env.PORT || 3000;

// const mqttClient = connect(options);

// const lastTemp = {
  //   temp: 99.9,
  //   time: new Date(),
  // };
  

// mqttClient.on("connect", () => {
  //   console.log("--conectado ao MQTT");
// });
// mqttClient.on("error", (e) => {
//   console.log("ERRO MQQT! -> "+e);
// });
// mqttClient.subscribe("projetoAlexa/espOut");

// mqttClient.on("message", (topic, msg) => {
  //   console.log("Nova temperatura recebida -> " + msg.toString());
  //   lastTemp.temp = msg.toString();
  //   lastTemp.time = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
  //   console.log("temperatura registrada -> " + lastTemp.temp +" em "+lastTemp.time);
  // });
  
// mqttClient.publish("projetoAlexa/espIn", "getTemp");

// app.get("/getTemp", (req, res) => {
//   console.log("Novo pedido de temperatura recebido!");
//   mqttClient.publish("projetoAlexa/espIn", "getTemp");
//   setTimeout(() => {
//     res.status(200).send(JSON.stringify(lastTemp));
//     console.log("Enviando temperatura -> " + JSON.stringify(lastTemp));
//   }, 2000);
// });
// app.post("/sendCommand", (req, res) => {
  //   try{
    //     let data = req.body.data;
    //   } catch (e) {
      //     console.log("Erro ao receber comando! -> " + e);
//     res.send(400)
//   }
//   if (!req.body.data) {
  //     res.send(400)
  //     console.log("Erro! o body.data é nulo!");
  //   }
  //   console.log("Novo comando recebido! -> " + data);
  //   mqttClient.publish("projetoAlexa/espIn", data);
  //   console.log("comando enviado para o MQTT!");
  //   res.status(200)
  // });

  // ---------------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------
  
  app.listen(port, () => {
  console.log("Server is running on port 3000");
});
