
#include "buzzer.h"

void beep(int note, int duration)
{
    tone(12, note, duration);
    delay(duration);
}

void buzzer_furElise()
{
    digitalWrite(17, LOW);
    beep(NOTE_E6, 150);
    beep(NOTE_DS6, 150);
    beep(NOTE_E6, 150);
    digitalWrite(17, HIGH);
    digitalWrite(18, LOW);
    beep(NOTE_DS6, 150);
    beep(NOTE_E6, 150);
    beep(NOTE_B5, 150);
    digitalWrite(18, HIGH);
    digitalWrite(19, LOW);
    beep(NOTE_D6, 150);
    beep(NOTE_C6, 150);
    digitalWrite(19, HIGH);
    digitalWrite(17, LOW);
    beep(NOTE_A5, 500);
    digitalWrite(17, HIGH);
    digitalWrite(18, LOW);
    beep(NOTE_C5, 150);
    beep(NOTE_E5, 150);
    beep(NOTE_A5, 150);
    digitalWrite(18, HIGH);
    digitalWrite(19, LOW);
    beep(NOTE_B5, 500);
    beep(NOTE_E5, 150);
    beep(NOTE_GS5, 150);
    digitalWrite(19, HIGH);
    digitalWrite(17, LOW);
    beep(NOTE_B5, 150);
    beep(NOTE_C6, 500);
    beep(NOTE_B5, 150);
    digitalWrite(17, HIGH);
    digitalWrite(18, LOW);

    beep(NOTE_E6, 150);
    beep(NOTE_DS6, 150);
    beep(NOTE_E6, 150);
    digitalWrite(18, HIGH);
    digitalWrite(19, LOW);
    beep(NOTE_DS6, 150);
    beep(NOTE_E6, 150);
    beep(NOTE_B5, 150);
    digitalWrite(19, HIGH);
    digitalWrite(17, LOW);
    beep(NOTE_D6, 150);
    beep(NOTE_C6, 150);
    beep(NOTE_A5, 500);
    digitalWrite(17, HIGH);
    digitalWrite(18, LOW);
    beep(NOTE_C5, 150);
    beep(NOTE_E5, 150);
    beep(NOTE_A5, 150);
    digitalWrite(18, HIGH);
    digitalWrite(19, LOW);
    beep(NOTE_B5, 500);
    beep(NOTE_E5, 150);
    digitalWrite(17, LOW);
    digitalWrite(18, LOW);
    digitalWrite(19, LOW);
    beep(NOTE_C6, 150);
    beep(NOTE_B5, 150);
    beep(NOTE_A5, 1000);
    digitalWrite(17, HIGH);
    digitalWrite(18, HIGH);
    digitalWrite(19, HIGH);
}