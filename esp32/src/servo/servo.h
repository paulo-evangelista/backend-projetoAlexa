// servo_control.h
#ifndef SERVO_H
#define SERVO_H

#include <ESP32Servo.h>
#include "react/react.h"

extern Servo servo;
extern reactesp::ReactESP react;
void stopServoMovement();
void moveServoToInitialPosition();
void activateServo();
void clickButton();
#endif
