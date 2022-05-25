const Log = require("debug")("servo");
const i2cBus = require("i2c-bus");
const Pca9685Driver = require("pca9685").Pca9685Driver;

let pwm = null;

function pos2ms(pos) {
    return 1500 + pos * 11.11;
}

class Servo {

    constructor(config) {
        this.enabled = false;
        this.channel = config.channel;
        this.position = config.position;
        this.limits = {
            low: config.low || -90,
            high: config.high || 90
        }
    }

    enable(isEnabled) {
        Log("enable", isEnabled);
        if (this.enabled != isEnabled) {
            this.enabled = isEnabled;
            if (this.enabled) {
                pwm.channelOn(this.channel)
            }
            else {
                pwm.channelOff(this.channel);
            }
        }
        if (typeof this.position === "number") {
            this.setPosition(this.position);
        }
    }

    setPosition(pos) {
        Log("setPosition", pos);
        if (pos < this.limits.low) {
            pos = this.limits.low;
        }
        if (pos > this.limits.high) {
            pos = this.limits.high;
        }
        this.position = pos;
        if (this.enabled) {
            pwm.setPulseLength(this.channel, pos2ms(this.position));
        }
    }

}

Servo.init = () => {
    return new Promise((success, failed) => {
        pwm = new Pca9685Driver({
            i2c: i2cBus.openSync(1),
            address: 0x40,
            frequency: 50
        }, err => {
            if (err) {
                console.error("Error initializing PCA9685");
                failed(err);
            }
            else {
                success();
            }
        });
    });
}

Servo.shutdown = () => {
    Log("shutdown");
    pwm.allChannelsOff();
}

module.exports = Servo;
