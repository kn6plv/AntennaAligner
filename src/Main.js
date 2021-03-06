#!/usr/bin/env nodejs

const Log = require("debug")("main");
const Config = require("./Config");
const Antenna = require("./Antenna");

(async () => {

    const argv = process.argv.slice(2);
    switch (argv[0]) {
        case "--setAll":
        {
            await Antenna.init();
            for (let name in Config.setting) {
                const ant = new Antenna(Config.config[name]);
                const setting = Config.setting[name];
                await ant.setHeading(setting.heading);
                await ant.enable();
            }
            break;
        }
        case "--set":
        {
            await Antenna.init();
            const config = Config.config[argv[1]];
            if (!config) {
                console.error(`No such antenna: ${argv[1]}`);
                process.exit(1);
            }
            const setting = Config.setting[argv[1]];
            if (!setting) {
                console.error(`No antenna settings: ${argv[1]}`);
                process.exit(1);
            }
            const ant = new Antenna(config);
            await ant.setHeading(setting.heading);
            await ant.enable();
            break;
        }
        case "--setHeading":
        {
            await Antenna.init();
            const config = Config.config[argv[1]];
            if (!config) {
                console.error(`No such antenna: ${argv[1]}`);
                process.exit(1);
            }
            const pos = parseFloat(argv[2]);
            if (isNaN(pos)) {
                console.error(`Bad antenna heading: ${argv[2]}`);
                process.exit(1);
            }
            const ant = new Antenna(config);
            await ant.setHeading(pos);
            await ant.enable();
            break;
        }
        default:
            console.error(`Commands:
  --setAll
  --set <antenna>
  --setHeading <antenna> <heading>`);
            process.exit(1);
    }

    await new Promise(_ => setTimeout(_, 2000));
    Antenna.shutdown();
    process.exit();

})();
