const { createWorker } = require('tesseract.js');

var robot = require("robotjs");
const {Jimp} = require('jimp');

const fs = require("fs");
const { Window } = require("node-screenshots");
const path = require('path');
const colors = require('colors')

const achivements = fs.existsSync('achivements.json') ? JSON.parse(fs.readFileSync('achivements.json', {encoding: 'utf8'})) : [];

let windows = Window.all();

const checktitle = ({ title, desc }) => {
	const replacements = [
		{ title: 'Основы подготовки', levels: [ 
			{ num: '1', desc: '5 раз'},
			{ num: '2', desc: '20 раз'},
            { num: '3', desc: '50 раз'}
		]},
		{ title: 'Идти напролом', levels: [ 
			{ num: '1', desc: '\nполучите боевой ранг 5.'},
			{ num: '2', desc: '5 раз'},
            { num: '3', desc: '20 раз'}
		]},
		{ title: 'Коронный приём', levels: [ 
			{ num: '1', desc: '100 000 урона'},
			{ num: '2', desc: '500 000 урона'},
            { num: '3', desc: '1 000 000 урона'}
		]},
		{ title: 'Удар всей жизни', levels: [ 
			{ num: '1', desc: '10 раз'},
			{ num: '2', desc: '50 раз'},
            { num: '3', desc: '200\nраз'}
		]},
		{ title: 'Своевременная помощь', levels: [ 
			{ num: '1', desc: '10 раз'},
			{ num: '2', desc: '50 раз'},
            { num: '3', desc: '200 раз'}
		]},
		{ title: 'По ту сторону клинка', levels: [ 
			{ num: '1', desc: '10 раз'},
			{ num: '2', desc: '50 раз'},
            { num: '3', desc: '200 раз'}
		]},
		{ title: 'Пламя энтузиазма', levels: [ 
			{ num: '1', desc: '10 раз'},
			{ num: '2', desc: '50 раз'},
            { num: '3', desc: '200 раз'}
		]},
		{ title: 'Хладнокровие', levels: [ 
			{ num: '1', desc: '10 раз'},
			{ num: '2', desc: '50 раз'},
            { num: '3', desc: '200 раз'}
		]},
		{ title: 'Поражение током', levels: [ 
			{ num: '1', desc: '10 раз'},
			{ num: '2', desc: '50 раз'},
            { num: '3', desc: '200 раз'}
		]},
		{ title: 'Эфемерные трудности', levels: [ 
			{ num: '1', desc: '10 раз'},
			{ num: '2', desc: '50 раз'},
            { num: '3', desc: '200 раз'}
		]},
		{ title: 'Главный аргумент', levels: [ 
			{ num: '1', desc: '10 раз'},
			{ num: '2', desc: '50 раз'},
            { num: '3', desc: '200 раз'}
		]},
		{ title: 'Мимолётное видение', levels: [ 
			{ num: '1', desc: '10 раз'},
			{ num: '2', desc: '50 раз'},
            { num: '3', desc: '200 раз'}
		]},
	];
	for (let v of replacements) {
		if (title.includes(v.title)) {
            for (let level of v.levels) {
                if (desc.indexOf(level.desc) > -1) {
                    return `${v.title} ${level.num}`;
                }
            }
        }
	}
	const alliases = [
		{ title: 'Ты да я', 
		names: [
			'Ты да я', 
			'Ты дая'
		]},
		{ title: 'А вы, мой друг, истинный глашатай правосудия!',
		names: [
			'А вы, мой друг, истинный глашатай правосудия!',
			'Авы, мой друг, истинный глашатай правосудия!'
		]}
	];
	for (let v of alliases) {
		if (v.names.includes(title)) {
			return v.title;
		}
    }

	return title;
}

const check_stats = () => {
	const achivements_true = achivements.filter(v => v.completed);
	const achivements_true_count = achivements_true.length;
	const achivements_true_percent = Math.round((achivements_true_count / achivements.length) * 100);
	console.log(`Achievements: ${achivements_true_count}/${achivements.length} (${achivements_true_percent}%)`);
}

const img_folder = 'images';

if (!fs.existsSync(img_folder)) {
    fs.mkdirSync(img_folder);
}

const recognize_screenshot = () => {
	windows.forEach((window) => {
		if (window.title.indexOf('ZenlessZoneZero') > -1) {

			window.captureImage().then( async data => { 
				
				fs.writeFileSync(`original.png`, await data.toPng());
				const height = 132;

				const worker_rus = await createWorker('rus');
				const worker_eng = await createWorker('eng');

				added_new = 0;

				for (let y = 205; y < 900; y = y + height) {
					const data_crop = await data.crop(525, y, 870, height);
					const filename = path.join(img_folder, y+'.png');
					fs.writeFileSync(filename, await data_crop.toPng());
					await (await Jimp.read(filename)).contrast(1).write(filename);

					const ret = await worker_rus.recognize(filename);
					const text = ret.data.text.split('\n').filter( v => v);

					if (text.length == 0) {
						console.log('Empty text'.red);
						continue;
					}

					const result = {
						title: text.shift(),
						desc: text.join('\n')
					}

					result.title = checktitle(result);

					const data_crop_points = await data.crop(1568, y, 40, height);
					const filename_points = path.join(img_folder, y+'_p.png');
					fs.writeFileSync(filename_points, await data_crop_points.toPng());
					await (await Jimp.read(filename_points)).contrast(1).write(filename_points);
					
					const ret_ponints = await worker_eng.recognize(filename_points);
					result.completed = ret_ponints.data.text.replace('\n', '').length > 0 ? true : false;

					console.log(result);

					const idx = achivements.findIndex( v => v.title === result.title );
					if (idx === -1) {
						achivements.push(result);
						added_new++;
					} else {
						achivements[idx] = result;
					}
					
				}
				console.log(`Added new achievements: ${added_new == 6 ? added_new.toString().green : added_new.toString().red}/6`);

				await worker_rus.terminate();
				await worker_eng.terminate();

				check_stats();

				fs.writeFileSync('achivements.json', JSON.stringify(achivements), { encoding: 'utf8' });
			});
		}
	});
}

var keypress = require('keypress');

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

