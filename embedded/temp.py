# Programa : Sensor de temperatura DHT11 com Raspberry Pi
# Autor : MakerHero
 
# Carrega as bibliotecas
import Adafruit_DHT
import RPi.GPIO as GPIO
import time
 
# Define o tipo de sensor
sensor = Adafruit_DHT.DHT11
#sensor = Adafruit_DHT.DHT22
 
GPIO.setmode(GPIO.BOARD)
 
# Define a GPIO conectada ao pino de dados do sensor
pino_sensor = 25
 
# Informacoes iniciais
print ("*** Lendo os valores de temperatura e umidade");
 
while(1):
   # Efetua a leitura do sensor
   umid, temp = Adafruit_DHT.read_retry(sensor, pino_sensor);
   # Caso leitura esteja ok, mostra os valores na tela
   print(umid, temp)
   time.sleep(3)