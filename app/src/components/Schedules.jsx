// Exemplo com react-datepicker
import React from "react";

function ScheduleForm({ schedulesArray, removeScheduleFunction }) {

  return (
    <div>
      <h2>Agendamentos:</h2>
      {
        schedulesArray.length === 0 ?
        <div style={{color: "gray"}}>
                Nenhum agendamento encontrado.
        </div>
        :
        null
      }
      {schedulesArray.map((schedule, index) => {
        const date = new Date(schedule*1000);
        return (
        <div key={index} style={{backgroundColor: "#101010", padding: "20px 0", margin: "10px 0", borderRadius: "10px", display: "flex"}}>
            <div style={{paddingLeft: "30px", paddingTop: "4px"}}>

            {date.toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            })}
            </div>
            <div onClick={()=>{removeScheduleFunction(schedule)}} style={{borderRadius: "100%", backgroundColor:"darkRed", padding: "5px 10px",margin:"0 10px 0 30px", fontWeight: "bold"}}>
X
            </div>
        </div>
        )
      })}
    </div>
  );
}

export default ScheduleForm;
