// servo_control.h
#ifndef OLED_H
#define OLED_H

#include "react/react.h"
#include <GyverOLED.h>

extern GyverOLED<SSH1106_128x64> oled;

void setupOled();
void handleOledWhileCreatingSchedule(int scheduleSelectedMinutes, int roundswithoutchange);
void oledDisplayACOn();
void oledDisplayScheduleCreated(int scheduleSelectedMinutes);
void restoreOled();
void oledDisplayRegularScreen(String time);
#endif
