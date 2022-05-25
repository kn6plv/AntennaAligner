
const Log = require("debug")("antenna");
const Servo = require("./Servo");

class Antenna {

    constructor(config) {
        this.config = config;
        this.servo = new Servo(config);
    }

    async setHeading(heading) {
        if (this.config.north) {
            heading += this.config.north;
	    if (heading > 180) {
                heading -= 360;
            }
	    else if (heading < -180) {
                heading += 360;
            }
        }
        await this.servo.setPosition(heading);
    }

    async enable() {
        await this.servo.enable(true);
    }
}

Antenna.init = async () => {
    await Servo.init();
}

Antenna.shutdown = () => {
    Servo.shutdown();
}

module.exports = Antenna;
