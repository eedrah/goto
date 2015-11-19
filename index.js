/*
label = input

Load the text of the caller's file

Look for "// LABEL ${label}"

keep the lines until // END LABEL ${label}

eval the lines

LABEL blah

goto(blah);
END LABEL

*/

var callsite = require('callsite');
var stream = require('readable-stream');
var fs = require('fs');
var split = require('split');

var goto = function (label) {
    var stack = callsite();
    var callerFile = stack[1].getFileName();

    var inLabel = false;
    fs.createReadStream(callerFile)
        .pipe(split())
        .pipe(new stream.Transform({
            transform: function (chunk, encoding, next) {
                var line = chunk.toString();
                console.log(line);
                if (line === '// LABEL END ' + label) {
                    this.push(null);
                    this.pause();
                    return;
                } else if (inLabel) {
                    console.log(line);
                    // push
                } else if(line === '// LABEL ' + label) {
                    inLabel = true;
                }
                console.log('iteration');
                next();
            },
            flush: function (done) {
                console.log('in flush');
            }
        }));
};

module.exports = goto;
