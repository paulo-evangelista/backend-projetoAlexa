import RPi.GPIO as GPIO
import time
import Adafruit_DHT
import requests
import json

def activateServo(servoPwmPin):
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(servoPwmPin, GPIO.OUT)
    servo = GPIO.PWM(servoPwmPin, 50)
    servo.start(0)

    time.sleep(1)
    servo.ChangeDutyCycle(8)  # Value just above 7.5 to rotate in the other direction
    time.sleep(0.5)
    servo.ChangeDutyCycle(6.5)  # Value just above 7.5 to rotate in the other direction
    time.sleep(0.4)

    servo.stop()
    GPIO.cleanup()

def sendTemperature(sensorPin):
    _, temp = Adafruit_DHT.read_retry(Adafruit_DHT.DHT11, sensorPin);
    if not temp:
        requests.get("https://back-jdb0.onrender.com/sendTemp/99")
    else:
        requests.get(f"https://back-jdb0.onrender.com/sendTemp/{int(temp)}")


def handleAC(localData, remoteData):
    print("remote:", remoteData )
    print("local:", localData )

    if localData["isAirCondicionerOn"] != remoteData["isAirCondicionerOn"]:
        localData['isAirCondicionerOn'] = remoteData['isAirCondicionerOn']
        with open('data.json', 'w') as json_file:
            json.dump(localData, json_file, indent=4)
        activateServo(12)
        print("servo activated")

    else:
        print("no changes... skipping")

