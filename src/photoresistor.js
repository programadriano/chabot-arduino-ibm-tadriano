var five = require("johnny-five"),
  board,
  photoresistor;

board = new five.Board();

board.on("ready", function() {
  photoresistor = new five.Sensor({
    pin: "A0",
    freq: 250
  });

  photoresistor.on("data", function() {
    console.log(this.value);
  });
});
