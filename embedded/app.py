import RPi.GPIO as GPIO
import time
import json
import requests
import functions


while True:
    try:
        response = requests.get("https://back-jdb0.onrender.com/getData")

        remoteData = response.json()
        localData = json.load(open('data.json', 'r'))

        functions.handleAC(localData, remoteData)

        functions.sendTemperature(sensorPin=25)

        time.sleep(5)

    except Exception as e:
        print(e)
        time.sleep(10)