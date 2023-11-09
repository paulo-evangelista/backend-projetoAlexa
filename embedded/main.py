import RPi.GPIO as GPIO
import time
import json
import requests
import functions


while True:
    try:

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

        # send the temperature to the server
        functions.sendTemperature(sensorPin=25)


        time.sleep(5)

    except Exception as e:
        print(e)
        time.sleep(10)