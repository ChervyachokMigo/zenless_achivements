
var keypress = require('keypress');
const {recognize_screenshot} = require('./recognize_screenshot');

keypress(process.stdin);

console.log('Welcome to ZenlessZoneZero Achivements Recognizer!');
console.log('Press Ctrl+C to exit');
console.log('Press Enter to recognize screenshot');

process.stdin.on('keypress', function (ch, key) {

	if (key) {
		if (key.ctrl && key.name == 'c') {
			console.log('You pressed Ctrl+C, exiting...');
            process.exit();
		}
		if (key.name == 'return') {
			recognize_screenshot();
			console.log('Screenshot recognized, waiting...');
		}
	}
});

process.stdin.setRawMode(true);
process.stdin.resume();

