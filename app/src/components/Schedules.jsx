// Exemplo com react-datepicker
import React, { useState } from "react";
import axios from "axios";

function ScheduleForm({ schedulesArray, fetchDataFunction, setIsUpdating }) {

    const handleRemoveSchedule = (timestamp) => {
        setIsUpdating(true);
        axios
        .get(`https://back-jdb0.onrender.com/removeSchedule/${timestamp}`)
        .then(() => {
          fetchDataFunction();
        })
        .catch(()=>setIsUpdating(false))
    }

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
            <div onClick={()=>{handleRemoveSchedule(schedule)}} style={{borderRadius: "100%", backgroundColor:"darkRed", padding: "5px 10px",margin:"0 10px 0 30px", fontWeight: "bold"}}>
X
            </div>
        </div>
        )
      })}
    </div>
  );
}

export default ScheduleForm;
