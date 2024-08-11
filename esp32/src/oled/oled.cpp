#include "react/react.h"
#include <GyverOLED.h>

GyverOLED<SSH1106_128x64> oled;

void setupOled() {
    oled.init();
    oled.autoPrintln(false);
    oled.setScale(1);
    oled.clear();
    oled.setCursor(0, 0);
    oled.print("Booting...");
    oled.update();
}


void restoreOled() {
    oled.clear();
    oled.setCursor(0, 0);
    oled.setScale(1);
    oled.print("Connected!");
    oled.update();
}
void handleOledWhileCreatingSchedule(int scheduleSelectedMinutes, int roundswithoutchange){
    oled.clear();
    oled.setScale(1);
    oled.setCursor(0, 0);
    oled.print("  Creating Schedule:");
    oled.setCursor(0, 2);
    oled.setScale(3);
    if (scheduleSelectedMinutes < 0) {
        oled.print("Cancel");
    } else if (scheduleSelectedMinutes == 0) {
        oled.print("Now!");
    } else {
        if (scheduleSelectedMinutes > 55) {
            oled.print(scheduleSelectedMinutes/60);
            oled.print("h");
        }
    oled.print(scheduleSelectedMinutes%60); 
    oled.print("min");
    }
    oled.setScale(1);

    oled.setCursor(0, 7);
    oled.print("[                   ]");
    oled.setCursor(0, 7);
    oled.roundRect(5, 57, (roundswithoutchange*0.72)+10, 61);
    oled.setCursor(120, 7);
    oled.print("]");
    
    oled.setCursor(20, 6);
    if (roundswithoutchange > 140) {
        oled.print("Saving in 1...");
    } else if (roundswithoutchange > 130) {
        oled.print("Saving in 2...");
    } else if (roundswithoutchange > 120) {
        oled.print("Saving in 3...");
    } else if (roundswithoutchange > 110) {
        oled.print("Saving in 4...");
    } else if (roundswithoutchange > 100) {
        oled.print("Saving in 5...");
    }

    oled.update();
}

void oledDisplayACOn() {
    oled.clear();
    oled.setCursor(10, 5);
    oled.setScale(1);
    oled.print("Toggled ac state!");
    oled.update();
    react.onDelay(3000, restoreOled);
}

void oledDisplayScheduleCreated(int scheduleSelectedMinutes){
    oled.clear();
    oled.setCursor(0, 0);
    oled.setScale(1);
    oled.print("Schedule created:");
    oled.setCursor(0, 2);
    if (scheduleSelectedMinutes > 55) {
        oled.print(scheduleSelectedMinutes/60);
        oled.print("h");
    }
    oled.print(scheduleSelectedMinutes%60); 
    oled.print("min");
    oled.update();
    react.onDelay(3000, restoreOled);
}

void oledDisplayRegularScreen(String time){
    oled.clear();
    oled.setCursor(20, 3);
    oled.setScale(3);
    oled.print(time);
    oled.rect(0, 0, 1, 64);
    oled.rect(0, 0, 128, 2);
    oled.rect(0, 61, 128, 64);
    oled.rect(125, 0, 128, 64);
    oled.update();
}