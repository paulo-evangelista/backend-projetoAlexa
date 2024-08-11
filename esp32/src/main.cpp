#include <Arduino.h>
#include <WiFiMulti.h>
#include <WebSocketsClient.h>
#include <GyverOLED.h>
#include <ArduinoJson.h>
#include "servo/servo.h"
#include "react/react.h"
#include "oled/oled.h"

#define WIFI_SSID "SHARE-RESIDENTE"
#define WIFI_PASS "Share@residente23"
#define WS_URL "back-jdb0.onrender.com"

WiFiMulti wifi;
WebSocketsClient ws;
ArduinoJson::JsonDocument json;

bool isWsConnected = false;
int roundsWithWsDisconnected = 0;
bool localAirConditionerState = false;

bool creatingScheduleNow = false;
int lastScheduleSelectedMinutes = 0;
int scheduleSelectedMinutes = 0;
int roundswithoutchange = 1;

void wsEvent(WStype_t type, uint8_t *payload, size_t length)
{
    switch (type)
    {
    case WStype_DISCONNECTED:
    {
        isWsConnected = false;
        roundsWithWsDisconnected++;

        if (roundsWithWsDisconnected > 500) ESP.restart();

        Serial.printf("[wsEvent] Disconnected!\n");
        oled.clear();
        oled.setCursor(30, 3);
        oled.setScale(1);
        oled.print("disconnected!");
        oled.setCursor(30, 5);
        oled.print(roundsWithWsDisconnected);
        oled.print("/500 to reset");
        oled.rect(10, 10, 14, 45);
        oled.rect(10, 50, 14, 55);
        oled.update();
        break;
    }

    case WStype_CONNECTED:
    {

        isWsConnected = true;
        roundsWithWsDisconnected = 0;
        Serial.printf("[wsEvent] Connected to %s\n", WS_URL);
        // rota para ressincronizar o estado do ar condicionado
        ws.sendTXT("GETSYN");
        oled.clear();
        oled.setCursor(0, 0);
        oled.print("Connected!");
        oled.update();
        break;
    }

    case WStype_TEXT:
    {
        ArduinoJson::deserializeJson(json, payload);

        if (json.containsKey("isSyncMessage") && json.containsKey("isAirCondicionerOn"))
        {
            localAirConditionerState = json["isAirCondicionerOn"];
            break;
        }

        if (json.containsKey("isAirCondicionerOn"))
        {
            if (!creatingScheduleNow) oledDisplayRegularScreen(json["time"]);

            if (json["isAirCondicionerOn"] != localAirConditionerState)
            {
                activateServo();
                localAirConditionerState = json["isAirCondicionerOn"];
            }

        }
        break;
    }
    }
}


void finishScheduleCreation( int scheduleSelectedMinutes){
    if (scheduleSelectedMinutes < 0) {
        oled.clear();
        oled.setCursor(0, 0);
        oled.setScale(1);
        oled.print("Connected!");
        oled.update();
    } else if (scheduleSelectedMinutes == 0) {
        ws.sendTXT("SETAC");
        oledDisplayACOn();
    } else {
        String msg = "SETSCS-" + String(scheduleSelectedMinutes*60);
        Serial.println(msg);
        ws.sendTXT(msg);
        oledDisplayScheduleCreated(scheduleSelectedMinutes);
    }
}
void handleCreateSchedule()
{
    if (digitalRead(33) == HIGH && digitalRead(32) == HIGH && !creatingScheduleNow)
    {
        return;
    }
    if (creatingScheduleNow)
    {
        // Serial.printf("rounds without change: %d\n", roundswithoutchange);
        handleOledWhileCreatingSchedule(scheduleSelectedMinutes, roundswithoutchange);
    }
    if (digitalRead(33) == LOW)
    {
        scheduleSelectedMinutes += 5;
    }
    if (digitalRead(32) == LOW)
    {
        if (scheduleSelectedMinutes > -5){
        scheduleSelectedMinutes -= 5;
        }
    }
    if (lastScheduleSelectedMinutes != scheduleSelectedMinutes)
    {
        creatingScheduleNow = true;
        Serial.printf("ScheduleSelectedMinutes: %d\n", scheduleSelectedMinutes);
        roundswithoutchange = 1;
    }
    else if (lastScheduleSelectedMinutes == scheduleSelectedMinutes && creatingScheduleNow)
    {
        roundswithoutchange++;
    }
    lastScheduleSelectedMinutes = scheduleSelectedMinutes;

    if (roundswithoutchange > 150)
    {
        creatingScheduleNow = false;
        roundswithoutchange = 1;
        Serial.printf("ScheduleSelectedMinutes: %d\n", scheduleSelectedMinutes);
        finishScheduleCreation(scheduleSelectedMinutes);
    }
}


void startReactFunctions()
{
    react.onRepeat(100, []()
                   { ws.loop(); });

    react.onRepeat(1000, []()
                   {
                if (isWsConnected)
                {
                ws.sendTXT("ESPGET");
                } });

    react.onRepeat(130, []()
                     {
                 handleCreateSchedule();
                 });
}

void setup()
{
    Serial.begin(115200);
    Serial.setDebugOutput(true);

    pinMode(33, INPUT_PULLUP);
    pinMode(32, INPUT_PULLUP);

    setupOled();

    servo.attach(13);

    delay(1000);

    wifi.addAP(WIFI_SSID, WIFI_PASS);

    for (int i = 0; i < 60 && wifi.run() != WL_CONNECTED; i++)
    {
        delay(700);
        oled.clear();
        oled.setScale(1);
        oled.setCursor(30, 4);
        oled.printf("%d seconds...", i*3);
        oled.setCursor(7, 7);
        oled.printf("reseting after 3min", i*3);
        oled.setCursor(40, 1);
        oled.printf("booting...", i);
        oled.update();
    }

    if (wifi.run() != WL_CONNECTED) ESP.restart();

    ws.beginSSL(WS_URL, 443, "/");
    ws.onEvent(wsEvent);

    startReactFunctions();
}

void loop()
{
    react.tick();
}
