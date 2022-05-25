
const Log = require("debug")("antenna");
const Servo = require("./Servo");

class Antenna {

    constructor(config) {
        this.servo = new Servo(config);
    }

    setPosition(pos) {
        this.servo.setPosition(pos);
    }

    enable() {
        this.servo.enable(true);
    }
}

Antenna.init = async () => {
    await Servo.init();
}

Antenna.shutdown = () => {
    Servo.shutdown();
}

module.exports = Antenna;
