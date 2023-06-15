#include "ESP8266WiFi.h"        // Utilizada para conectar dispositivos Arduino a redes Wi-Fi.
#include <ESP8266HTTPClient.h>  // Utilizada para realizar solicitações HTTP em dispositivos ESP8266 e se comunicar com servidores remotos.
#include <WiFiClient.h>         // Utilizada para criar conexões de rede usando o protocolo TCP/IP.
#include <ArduinoJson.h>        // Utilizada para trabalhar com dados JSON em dispositivos Arduino e oferece recursos de serialização e desserialização.
#include "EmonLib.h"            // Utilizada para simplificar a medição de corrente elétrica, fornecendo funções para ler e calcular dados de corrente elétrica a partir de sensores.

EnergyMonitor sensorCurrent;
unsigned long startTime = 0;  // Armazena o tempo atual em milissegundos

// Parametros de conexão
const char* ssid = "WIFI";
const char* password = "********";
const char* server = "aenergy-api.azurewebsites.net";
int port = 443;
// Variavel de controle
int communication = 0,
    measurements;
// Definindo a tensão e as variaveis de corrente e potência elétrica
const float voltage = 125.00;
float current, power;

void setup() {
  pinMode(16, OUTPUT);  // LED-1
  digitalWrite(16, LOW);
  pinMode(5, OUTPUT);  // LED-2
  digitalWrite(5, LOW);
  sensorCurrent.current(A0, 57);     // Definindo pino de leitura e calibração do sensor de corrente.
  connectingToWifi(ssid, password);  // Conxeão ao WiFi
}

void loop() {
  startTime = millis();
  measurements = 0;
  current = 0;
  power = 0;
  while (millis() - startTime < 60000) {
    analyzingEnergy();
    measurements++;
  }
  current = current / measurements;
  power = current * voltage;
  sendingData();
}

void connectingToWifi(const char* ssid, const char* password) {
  WiFi.begin(ssid, password);  // Função de conexão
  communication = 1;
  ledCommunication();  // Aguardando conexão
}

void ledCommunication() {
  switch (communication) {
    case 1:                                    // Comunicação por LED-1 para saber se o WiFi está conectado.
      while (WiFi.status() != WL_CONNECTED) {  // Enquanto estiver piscando, não há conexão com o WiFi.
        delay(500);
        digitalWrite(16, HIGH);
        delay(500);
        digitalWrite(16, LOW);
      }
      digitalWrite(16, HIGH);
      break;
    case 2:                   // Comunicação por LED-2 para saber se a requisição POST foi realizada com sucesso.
      digitalWrite(5, HIGH);  // Caso sucesso, o LED-2 pisca 1x (RÁPIDO).
      delay(50);
      digitalWrite(5, LOW);
      delay(50);
      break;
    case 3:                   // Comunicação por LED-2 quando a requisição POST der erro.
      digitalWrite(5, HIGH);  // O LED-2 pisca 1x (LENTO).
      delay(1000);
      digitalWrite(5, LOW);
      delay(1000);
  }
}

void analyzingEnergy() {
  float currentRead = 0;
  currentRead = sensorCurrent.calcIrms(1480);
  current += currentRead;
  delay(5);
}

void sendingData() {
  if (WiFi.status() != WL_CONNECTED) {
    connectingToWifi(ssid, password);
    return;
  }
  // Cria um objeto JSON
  DynamicJsonDocument doc(1024);
  doc["current"] = current;
  doc["power"] = power;
  doc["idProduct"] = 1;
  // Serializa o objeto JSON em uma string
  String json;
  serializeJson(doc, json);
  // Conecta ao servidor
  // Estabelecer a conexão TCP com o servidor da API
  WiFiClient client;
  if (!client.connect(server, port)) {
    return;
  }
  // Enviar a requisição HTTP POST com o JSON no corpo
  String address = "http://aenergy-api.azurewebsites.net/consumption";
  HTTPClient http;
  http.begin(client, address);
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST(json);
  if (httpCode == 201) {
    communication = 2;
    ledCommunication();
  } else {
    communication = 3;
    ledCommunication();
  }
  http.end();
  delay(10);  // Esperar 10 milisegundos antes de enviar a próxima requisição
}
