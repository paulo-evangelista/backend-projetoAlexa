#include <Arduino.h>
#include <GyverOLED.h>
#include "utils.h"

GyverOLED<SSH1106_128x64> oled;

void setup()
{
  Serial.begin(9600);
  oled.init();
  oled.autoPrintln(false);
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

  }
}