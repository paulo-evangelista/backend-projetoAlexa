import serial
import time
from datetime import datetime

def sendSerial(command):
    port = '/dev/ttyUSB0'
    baudrate = 9600
    ser = serial.Serial(port, baudrate)
    if ser.isOpen():
        try:
            ser.write(command.encode('utf-8'))
            time.sleep(1)  # Dando tempo para a transmissão de dados.
        finally:
            ser.close()
            time.sleep(1)
    else:
        print("[sendToESP32] não foi possível abrir a porta serial.")

def sendTemperature(temperature):
    sendSerial(f"DSTEMP-{int(temperature)} graus")

def sendDate():
    sendSerial("DSDATE-"+datetime.now().strftime("%d/%m/%Y"))

def sendTime():
    sendSerial("DSTIME-"+datetime.now().strftime("%H:%M"))