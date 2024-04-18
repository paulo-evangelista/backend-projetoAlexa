// Exemplo com react-datepicker
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { LocalNotifications } from "@capacitor/local-notifications";

function ScheduleForm({ schedulesArray, sendNewScheduleFunction }) {
  const [startDate, setStartDate] = useState(new Date());

  const handleDateChange = (date) => {
    setStartDate(date);
  };

  const scheduleNotification = async (timestamp) => {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "❄️ Ar-condicionado ❄️",
          body: "⛇ O agendamento do chegou! confira o estado no app! 🏂",
          id: timestamp,
          iconColor: "#9015b6",
          schedule: { at: new Date(timestamp * 1000) },
          actionTypeId: "",
          channelId: "default",
        },
      ],
    });
  };

  const handleSubmit = () => {
    const timestamp = Math.floor(startDate.getTime() / 1000);
    console.log(timestamp)
    scheduleNotification(timestamp)
    sendNewScheduleFunction(timestamp)
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
