// Exemplo com react-datepicker
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

function ScheduleForm({ fetchDataFunction, setIsUpdating }) {
  const [startDate, setStartDate] = useState(new Date());

  const handleDateChange = (date) => {
    setStartDate(date);
  };

  const handleSubmit = () => {
    const timestamp = Math.floor(startDate.getTime() / 1000);
    // Agora, envie o timestamp para o servidor
    console.log(timestamp);
    axios
      .get(`https://back-jdb0.onrender.com/createSchedule/${timestamp}`)
      // .get(`http://localhost:3000/createSchedule/${timestamp}`)
      .then(() => {
        fetchDataFunction();
      })
      .catch(()=>setIsUpdating(false))

  };

  return (
    <div
      style={{
        border: "2px solid gray",
        borderRadius: "12px",
        padding: "10px",
      }}
    >
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        showTimeSelect
        dateFormat="Pp"
        locale="pt-br"
        showIcon
      />
      <br />
      <button
        style={{
          borderRadius: "12px",
          marginTop: "10px",
          border: "0",
          fontWeight: "",
          fontSize: "15px",
          padding: "10px 25px",
          backgroundColor: "gray",
          color: "white",
        }}
        onClick={handleSubmit}
      >
        Agendar
      </button>
    </div>
  );
}

export default ScheduleForm;
