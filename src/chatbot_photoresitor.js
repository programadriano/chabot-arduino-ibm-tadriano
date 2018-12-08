var restify = require("restify");
var builder = require("botbuilder");
var five = require("johnny-five"),
  board,
  photoresistor;

var monitoring;

var board = new five.Board();
board.on("ready", function() {
  var led = new five.Led.RGB({
    pins: {
      red: 6,
      green: 5,
      blue: 3
    }
  });

  photoresistor = new five.Sensor({
    pin: "A0",
    freq: 250
  });

  photoresistor.on("data", function() {
    if (parseInt(this.value) >= 400) {
      led.color(0, 255, 0);
      led.on();
    } else if (parseInt(this.value) < 400) {
      led.color(0, 0, 255);
      led.on();
    }

    monitoring = this.value;
  });
});

var server = restify.createServer();

var connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});

server.post("/api/messages", connector.listen());

var bot = new builder.UniversalBot(connector, function(session) {
  if (session.message.text == "status") {
    session.send("Status iluminação: %s", monitoring);
  }
});

server.listen(process.env.port || process.env.PORT || 3978, function() {
  console.log("%s listening to %s", server.name, server.url);
});
