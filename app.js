import express from "express";
import {writeFile, readFile} from "fs";
// import { connect } from "mqtt";
const app = express();
import cors from "cors";
import WebSocket, { WebSocketServer } from 'ws';

// Inicializa um servidor WebSocket na porta 8080
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('Cliente conectado');

  // Recebe mensagens do cliente
  ws.on('message', function incoming(message) {
    console.log('Recebido: %s', message);
  });

  // Envia uma mensagem para o cliente
  ws.send('Conexão estabelecida com sucesso!');
});

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

app.get("/createBuzzer", (req, res)=>{

  readFile("data.json", (err, data)=>{
    let obj = JSON.parse(data)
    obj.buzzer = true

    writeFile("data.json", JSON.stringify(obj), ()=>{
      console.log("buzzer solicitado.")

        res.send("ok")
    })
} )
})

app.get("/removeBuzzer", (req, res)=>{

  readFile("data.json", (err, data)=>{
    let obj = JSON.parse(data)
    obj.buzzer = false

    writeFile("data.json", JSON.stringify(obj), ()=>{
      console.log("buzzer removido.")

        res.send("ok")
    })
} )
})

app.get("/", (req,res)=>{
  res.send("hello world!")
})

const port = process.env.PORT || 3000;
  
  app.listen(port, () => {
  console.log("Server is running on port 3000");
});
