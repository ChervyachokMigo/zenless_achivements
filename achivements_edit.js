var keypress = require('keypress');
const colors = require('colors')
const fs = require('fs');


const achivements = fs.existsSync('achivements.json') ? JSON.parse(fs.readFileSync('achivements.json', {encoding: 'utf8'})) : [];

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

const print_limit = 7;

const cursor = {
	position: 0,
}

const print_view = () => {
	console.clear();
	let min = cursor.position - print_limit;
	if (min < 0) min = 0;

	let max = cursor.position + print_limit;
	if (max >= achivements.length) max = achivements.length - 1;

	if (cursor.position < print_limit) {
		max = print_limit + print_limit - min;
	}

	if (cursor.position >= achivements.length - print_limit) {
        min = achivements.length - 2 * print_limit - 1;
    }

	console.log(`Achievements (${min}-${max}/${achivements.length})`.green);


    for (let i = min; i <= max; i++) {
		const string = `[${i}] [${achivements[i].completed ? 'V'.green : 'X'.red}] ${achivements[i].title}`;
		if (i === cursor.position) {
            console.log(string.bgBlue.white);
        } else {
            console.log(string);
        }
	}
}

print_view();

process.stdin.on('keypress', function (ch, key) {

	if (key) {
		if (key.ctrl && key.name == 'c') {
			console.log('You pressed Ctrl+C, exiting...');
            process.exit();
		}
		if (key.name == 'down') {
			cursor.position++;
			if (cursor.position >= achivements.length) cursor.position = achivements.length - 1;
		}
		if (key.name == 'up') {
			cursor.position--;
			if (cursor.position < 0) cursor.position = 0;
		}
		if (key.name == 'return') {

		}
		if (key.name == 'delete') {
			achivements.splice(cursor.position, 1);
            fs.writeFileSync('achivements.json', JSON.stringify(achivements), { encoding: 'utf8' });
            cursor.position--;
			if (cursor.position < 0) cursor.position = 0;
            print_view();

		}
		print_view();
	}
});

process.stdin.setRawMode(true);
process.stdin.resume();