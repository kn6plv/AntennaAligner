const Log = require("debug")("servo");
const i2cBus = require("i2c-bus");
const Pca9685Driver = require("pca9685").Pca9685Driver;
const AsyncLock = require('async-lock');

const ServoLock = new AsyncLock();

let pwm = null;

async function use(fn) {
    await ServoLock.acquire("servos", async () => {
        await fn();
    });
}

class Servo {

    constructor(config) {
        this.enabled = false;
        this.position = null;
        this.channel = config.channel;
        this.low = config.low || -140;
        this.high = config.high || 140;
        this.scale = config.invert ? -5.555 : 5.555;
    }

    async enable(en) {
        if (en !== false) {
            en = true;
        }
        Log("enable", en);
        if (this.enabled != en) {
            this.enabled = en;
            if (this.enabled) {
                await use(() => pwm.channelOn(this.channel));
            }
            else {
                await use(() => pwm.channelOff(this.channel));
            }
        }
        if (typeof this.position === "number") {
            this.setPosition(this.position);
        }
    }

    async setPosition(pos) {
        Log("setPosition", pos, this.enabled ? "enabled" : "disabled");
        if (pos < this.low) {
            pos = this.low;
        }
        if (pos > this.high) {
            pos = this.high;
        }
        this.position = pos;
        if (this.enabled) {
            await use(() => pwm.setPulseLength(this.channel, 1500 + this.scale * this.position));
        }
    }

}

Servo.init = async () => {
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
