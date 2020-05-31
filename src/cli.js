"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ParentBinLinker_1 = require("./ParentBinLinker");
var program_1 = require("./program");
var log4js = require("log4js");
var options = program_1.program.parse(process.argv);
log4js.configure({
    appenders: {
        console: { type: 'stdout', layout: { type: 'pattern', pattern: '%[%r (%z) %p %c%] %m' } }
    },
    categories: {
        default: { appenders: ['console'], level: options.logLevel }
    }
});
new ParentBinLinker_1.ParentBinLinker(options).linkBinsToChildren()
    .catch(function (err) {
    console.error('Error Linking packages', err);
    process.exit(1);
});
//# sourceMappingURL=cli.js.map