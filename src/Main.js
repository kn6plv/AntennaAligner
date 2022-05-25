#!/usr/bin/env nodejs

const Log = require("debug")("main");
const Config = require("./Config");
const Antenna = require("./Antenna");

(async () => {

    await Antenna.init();

    const argv = process.argv.slice(2);
    switch (argv[0]) {
        case "--setAll":
        {
            Config.antennas.forEach(config => {
                const ant = new Antenna(config);
                ant.enable();
            });
            break;
        }
        case "--setPosition":
        {
            const config = Config.antennas.find(ant => ant.name == argv[1]);
            if (!config) {
                console.error(`No such antenna: ${argv[1]}`);
                process.exit(1);
            }
            const pos = parseFloat(argv[2]);
            if (isNaN(pos)) {
                console.error(`Bad antenna position: ${argv[2]}`);
                process.exit(1);
            }
            const ant = new Antenna(config);
            ant.setPosition(pos);
            ant.enable();
            break;
        }
        default:
            console.error("Unknown command");
            process.exit(1);
    }

    // Wait a bit before exiting
    await new Promise(_ => setTimeout(_, 2000));
    Antenna.shutdown();
    process.exit();

})();
