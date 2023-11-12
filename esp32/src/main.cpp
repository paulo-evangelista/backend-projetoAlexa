#include <Arduino.h>
#include <GyverOLED.h>
#include "utils.h"
#include "buzzer.h"

GyverOLED<SSH1106_128x64> oled;

void setup()
{
  Serial.begin(9600);
  oled.init();
  oled.autoPrintln(false);
  pinMode(12, OUTPUT);
  // LED RGB
  pinMode(17, OUTPUT);
  pinMode(18, OUTPUT);
  pinMode(19, OUTPUT);
  digitalWrite(18, HIGH);
  digitalWrite(17, HIGH);
  digitalWrite(19, HIGH);

  displayLine();
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

    else if (command == "BUZZER"){
      buzzer_furElise();
    }

  }
}