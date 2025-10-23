#include <LiquidCrystal.h>

// --- Pin Definitions ---
int trig = 12;      // Ultrasonic TRIG
int echo = 13;      // Ultrasonic ECHO
int pir = 8;        // PIR sensor
int buzzer = 10;    // Buzzer
int distance, duration;
int motion;

// --- LCD Setup (RS = 6, E = 7, D4-D7 = 5,4,3,2) ---
LiquidCrystal lcd(6, 7, 5, 4, 3, 2);

void setup() {
  Serial.begin(9600);

  pinMode(trig, OUTPUT);
  pinMode(echo, INPUT);
  pinMode(pir, INPUT);
  pinMode(buzzer, OUTPUT);

  lcd.begin(16, 2);
  lcd.print("Smart Security");
  lcd.setCursor(0, 1);
  lcd.print("System Ready");
  delay(2000);
  lcd.clear();
}

void loop() {
  // --- Ultrasonic sensor ---
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);
  duration = pulseIn(echo, HIGH);
  distance = duration * 0.034 / 2;  // distance in cm

  // --- PIR sensor ---
  motion = digitalRead(pir);

  // --- Serial Monitor ---
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.print(" cm | Motion: ");
  Serial.println(motion ? "Detected" : "No motion");

  // --- LCD Display ---
  lcd.setCursor(0, 0);
  lcd.print("Dist:");
  lcd.print(distance);
  lcd.print("cm   "); // clear previous digits

  lcd.setCursor(0, 1);
  lcd.print("Motion:");
  lcd.print(motion ? "Detected   " : "No motion  ");

  // --- Buzzer Logic ---
  if (motion) {
    if (distance < 50) {
      // Police siren style: alternating high-low rapid tones
      tone(buzzer, 1000);  // high
      delay(150);
      tone(buzzer, 700);   // low
      delay(150);
    } else {
      // Smooth continuous buzzer for long distance
      tone(buzzer, 400);   // constant low tone
    }
  } else {
    noTone(buzzer);  // no motion, buzzer off
  }

  delay(100);  // short delay to allow siren effect
}
