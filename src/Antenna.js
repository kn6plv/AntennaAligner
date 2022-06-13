
const Log = require("debug")("antenna");
const Servo = require("./Servo");

class Antenna {

    constructor(config) {
        this.config = config;
        this.servo = new Servo(config.servo);
    }

    async setHeading(heading) {
        Log("setHeading", heading);
        if (this.config.zero) {
            heading -= this.config.zero;
        }
        while (heading > 180) {
            heading -= 360;
        }
        while (heading < -180) {
            heading += 360;
        }
        await this.servo.setPosition(heading);
    }

    async enable(en) {
        await this.servo.enable(en);
    }
}

Antenna.init = async () => {
    await Servo.init();
}

Antenna.shutdown = () => {
    Servo.shutdown();
}

module.exports = Antenna;
