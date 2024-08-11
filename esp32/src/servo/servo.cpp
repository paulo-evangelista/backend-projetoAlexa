// servo_control.cpp
#include "servo.h"

Servo servo;

void activateServo()
{
    servo.write(100);
    react.onDelay(1200, clickButton);
}

void clickButton()
{
    servo.write(140);
    react.onDelay(110, moveServoToInitialPosition);
}

void moveServoToInitialPosition()
{
    servo.write(80);
    react.onDelay(250, stopServoMovement);
}

void stopServoMovement()
{
    servo.write(90);
}