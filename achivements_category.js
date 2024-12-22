var keypress = require('keypress');
const colors = require('colors')
const fs = require('fs');
const achivements_categories_const = require('./achivements_categories_const');

const achivements = fs.existsSync('achivements.json') ? JSON.parse(fs.readFileSync('achivements.json', {encoding: 'utf8'})) : [];

const achivements_categories = fs.existsSync('achivements_categories.json') ? JSON.parse(fs.readFileSync('achivements_categories.json', {encoding: 'utf8'})) : [];

keypress(process.stdin);

const print_limit = 7;

const cursor = {
	position: 0,
	selected_cat: null,
	last_cursor: 0
}

let is_select_category = false;

const get_cat = (title) => {
	const res = achivements_categories.findIndex( v => v.title === title);
	if (res == -1) {
		return null;
	}

	const num = achivements_categories[res].cat;
	return achivements_categories_const[num];
}

const print_view = () => {
	console.clear();

	if (!is_select_category) {
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
		console.log('Category:'.yellow, cursor.selected_cat === null ? 'None' : achivements_categories_const[cursor.selected_cat]);

		for (let i = min; i <= max; i++) {
			const string = `[${i}] [${achivements[i].completed ? 'V'.green : 'X'.red}] [${get_cat(achivements[i].title)}] ${achivements[i].title}`;
			if (i === cursor.position) {
				console.log(string.bgBlue.white);
			} else {
				console.log(string);
			}
		}
	} else {
		let min = cursor.position - print_limit;
		if (min < 0) min = 0;

		let max = cursor.position + print_limit;
		if (max >= achivements_categories_const.length) max = achivements_categories_const.length - 1;

		if (cursor.position < print_limit) {
			max = print_limit + print_limit - min;
		}

		if (cursor.position >= achivements_categories_const.length - print_limit) {
			min = achivements_categories_const.length - 2 * print_limit - 1;
		}

		console.log('Select category:'.yellow);
        for (let i = 0; i < achivements_categories_const.length; i++) {
			const string = `[${i}] ${achivements_categories_const[i]}`;
			if (i === cursor.position) {
				console.log(string.bgBlue.white);
			} else {
				console.log(string);
			}
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

		if (key.name == 'q') {
			let cursor_pos = cursor.position;
			cursor.position = cursor.last_cursor;
			cursor.last_cursor = cursor_pos;

			is_select_category = !is_select_category;
		}

		if (key.name == 'down') {
			cursor.position++;
			if (is_select_category) {
				if (cursor.position >= achivements_categories_const.length) cursor.position = achivements_categories_const.length - 1;
			} else {
				if (cursor.position >= achivements.length) cursor.position = achivements.length - 1;
			}
		}
		if (key.name == 'up') {
			cursor.position--;
			if (cursor.position < 0) cursor.position = 0;
		}

		if (key.name == 'return') {
			if (is_select_category) {
				cursor.selected_cat = cursor.position;

				let cursor_pos = cursor.position;
				cursor.position = cursor.last_cursor;
				cursor.last_cursor = cursor_pos;
				
                is_select_category = false;
			} else {
				const idx = achivements_categories.findIndex( v => v.title === achivements[cursor.position].title );
				if (idx === -1) {
                    achivements_categories.push({ title: achivements[cursor.position].title, cat: cursor.selected_cat });
                } else {
                    achivements_categories[idx].cat = cursor.selected_cat ;
                }
                fs.writeFileSync('achivements_categories.json', JSON.stringify(achivements_categories), { encoding: 'utf8' });
			}
		}

		if (key.name == 'delete') {
			

		}
		print_view();
	}
});

process.stdin.setRawMode(true);
process.stdin.resume();