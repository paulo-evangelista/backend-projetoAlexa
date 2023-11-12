import time
import functions
import esp32

while True:
    try:
        print(" ")

        localData, remoteData = functions.fetchData()

        # check if the AC state in the server is the same as the local state.
        # if not, change the local state and activate the servo
        localData = functions.handleAC(localData, remoteData)

        # check if there are any schedules to fullfill.
        # if there are, change the server AC state and remove schedule.
        # the Servo will only be activated on the next loop, when handleAC() is called.
        # the schedules are never saved locally.
        functions.handleSchedules(remoteData)
        # REMEMBER THAT THE VARIABLE remoteData CAN BECOME OUTDATED AFTER THIS FUNCTION

        # check if there is a request to activate the buzzer
        functions.handleBuzzer(remoteData)

        # send the temperature to the server
        temperature = functions.sendTemperature(sensorPin=25)

        esp32.sendTemperature(temperature)
        esp32.sendDate()
        esp32.sendTime()


    except Exception as e:
        print(e)
        time.sleep(60)