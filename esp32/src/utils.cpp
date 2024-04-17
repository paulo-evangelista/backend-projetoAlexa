#include "utils.h"

void displayDate(String data)
{
  oled.setScale(1);
  oled.setCursor(35, 3);
  oled.print("                                                     ");
  oled.setCursor(35, 3);
  oled.print(data);
  oled.update();
}

void displayTemperature(String data)
{
  oled.setScale(2);
  oled.setCursor(16, 6);
  oled.print("                                                     ");
  oled.setCursor(16, 6);
  oled.print(data);
  oled.update();
}

void displayTime(String data)
{
  oled.setScale(2);
  oled.setCursor(34, 0);
  oled.print("                                                     ");
  oled.setCursor(34, 0);
  oled.print(data);
  oled.update();
}

void displayLine()
{
  oled.setScale(1);
  oled.setCursor(0, 4);
  oled.print("------aaaaaaaaa-----------------");
  oled.update();
}