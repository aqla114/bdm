#define LED  13
const int pinButton = 4; 
int recieveByte = 0;
String bufferStr = "";
String okStr = "OK";

void setup() {
  pinMode(pinButton, INPUT);
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

// シリアルポートに定期的に書き込んではデータを受け取る
// パーストークンは \n
// OK を受け取ったら 13 LED点灯、それ以外を受け取ったら削除
// 1秒おきループ

void loop() {
  if(digitalRead(pinButton)) {
    Serial.println("Button pushed!");
  }

  bufferStr = "";
  while (Serial.available() > 0) {
    recieveByte = Serial.read();
    if (recieveByte == (int)'\n') break;
    bufferStr.concat((char)recieveByte);
  }

  // 受け取ったデータがあるなら送りかえしてスイッチ操作
  if (bufferStr.length() > 0) {
    Serial.print("I received: "); 
    Serial.println(bufferStr);
    if (okStr.compareTo(bufferStr) == 0) {
      digitalWrite(LED, HIGH);
      delay(1000);
      digitalWrite(LED, LOW);
    } else {
      digitalWrite(LED, LOW);
    }
  }

  delay(10);
}
