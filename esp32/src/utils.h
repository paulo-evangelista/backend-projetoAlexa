// utils.h

#ifndef UTILS_H
#define UTILS_H

#include <Arduino.h>
#include <GyverOLED.h>

extern GyverOLED<SSH1106_128x64> oled;

void displayDate(String data);

void displayTemperature(String data);

void displayTime(String data);

void displayLine();


#endif // UTILS_H