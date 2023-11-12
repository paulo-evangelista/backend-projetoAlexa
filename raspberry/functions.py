import RPi.GPIO as GPIO
import time
import Adafruit_DHT
import requests
import json
import esp32

def activateServo(servoPwmPin):
    print("[activateServo] activating servo")
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
    print("[activateServo] finished")

def sendTemperature(sensorPin):
    _, temp = Adafruit_DHT.read_retry(Adafruit_DHT.DHT11, sensorPin);
    if not temp:
        requests.get("https://back-jdb0.onrender.com/sendTemp/99")
    else:
        requests.get(f"https://back-jdb0.onrender.com/sendTemp/{int(temp)}")

    return temp


def handleAC(localData, remoteData):
    print("[handleAC] remote:", remoteData )
    print("[handleAC] local:", localData )

    if localData["isAirCondicionerOn"] != remoteData["isAirCondicionerOn"]:
        localData['isAirCondicionerOn'] = remoteData['isAirCondicionerOn']
        with open('data.json', 'w') as json_file:
            json.dump(localData, json_file, indent=4)
        activateServo(12)
        return localData

    else:
        print("[handleAC] no changes... skipping")
        return localData

def fetchData():
    response = requests.get("https://back-jdb0.onrender.com/getData")

    remoteData = response.json()
    localData = json.load(open('data.json', 'r'))
    return localData, remoteData

def handleSchedules(remoteData):
    print("[handleSchedules] local timestamp:", int(time.time()))
    for i in remoteData["schedulesArray"]:
        if int(time.time()) > i:
            print(f"[handleSchedules] local time ({int(time.time())}) is greater than found schedule time ({i})")

            requests.get(f"https://back-jdb0.onrender.com/removeSchedule/{i}")
            print(f"[handleSchedules]    -> removed schedule")
            time.sleep(1)

            requests.get("https://back-jdb0.onrender.com/toggleAC")
            print(f"[handleSchedules]    -> toggled AC")
            time.sleep(1)
            
def handleBuzzer(remoteData):
    if remoteData["buzzer"]:
        esp32.sendSerial("BUZZER-furElise")
        requests.get("https://back-jdb0.onrender.com/removeBuzzer")