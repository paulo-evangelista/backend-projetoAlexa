// Exemplo com react-datepicker
import React, { useState } from 'react';

function ScheduleForm({schedulesArray}) {

    return (
        <div>
            <h2>Agendamentos</h2>
            <ul>
                {schedulesArray.map((schedule, index) => (
                    <li key={index}>
                        {schedule}
                    </li>
                ))}
            </ul>         
        </div>
    );
}

export default ScheduleForm;
