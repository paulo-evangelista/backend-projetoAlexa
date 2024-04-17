#include <Arduino.h>
#include <GyverOLED.h>
#include <ArduinoWebsockets.h>
#include <WiFi.h>

#include "utils.h"
#include "buzzer.h"

const char *ssid = "SHARE-RESIDENTE";                        // Substitua com o SSID da sua rede WiFi
const char *password = "Share@residente23";                  // Substitua com a senha da sua rede WiFi
const char *websocket_server = "ws://seu-servidor.com:8080"; // Substitua com o endereço do seu servidor WebSocket

using namespace websockets;

GyverOLED<SSH1106_128x64> oled;
WebsocketsClient client;

void setupBasics()
{
  Serial.begin(9600);
  pinMode(12, OUTPUT);
  // LED RGB
  pinMode(17, OUTPUT);
  pinMode(18, OUTPUT);
  pinMode(19, OUTPUT);
  digitalWrite(18, HIGH);
  digitalWrite(17, HIGH);
  digitalWrite(19, HIGH);
}

void setup()
{
  setupBasics();
  oled.init();
  oled.autoPrintln(false);

  displayLine();
  client.connect("ws://your-server-ip:port/uri");
}

void loop()

{
  delay(1000);

  if (Serial.available())
  {
    String data = Serial.readStringUntil('\n');
    int dashIndex = data.indexOf('-');
    String command = data.substring(0, dashIndex);
    String value = data.substring(dashIndex + 1);

    if (command == "DSTEMP")
    {
      displayTemperature(value);
    }

    else if (command == "DSDATE")
    {
      displayDate(value);
    }

    else if (command == "DSTIME")
    {
      displayTime(value);
    }

    else if (command == "BUZZER")
    {
      buzzer_furElise();
    }
  }
}