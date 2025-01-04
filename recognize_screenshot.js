const { createWorker } = require('tesseract.js');

const {Jimp} = require('jimp');

const fs = require("fs");
const { Window } = require("node-screenshots");
const path = require('path');
const colors = require('colors')

const achivements = fs.existsSync('achivements.json') ? JSON.parse(fs.readFileSync('achivements.json', {encoding: 'utf8'})) : [];
const achivements_categories = fs.existsSync('achivements_categories.json') ? JSON.parse(fs.readFileSync('achivements_categories.json', {encoding: 'utf8'})) : [];

let windows = Window.all();

const checktitle = ({ title, desc, title_eng }) => {
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
		{ 
			title: 'Ты да я', 
			names: [
				'Ты дая'
			]
		},
		{ 
			title: 'А вы, мой друг, истинный глашатай правосудия!',
			names: [
				'Авы, мой друг, истинный глашатай правосудия!'
			]
		},
		{
			title: 'И вовсе я не сплю!',
			names: [
                'Ивовсе я не сплю!'
            ]
		},
		{
			title: 'Тсс, цена не имеет значения',
			names: [
                'Тес, цена не имеет значения'
            ]
		},
		{ 
			title: 'Любовь к сверхъестественному', 
			names: [
                'Любовьк сверхестественному'
            ] 
		},
		{ 
			title: 'Тсс! Не стоит говорить с эфириалами', 
			names: [
                'Тесс! Не стоит говорить с эфириалами',
				'Тес! Не стоит говорить с эфириалами'
            ] 
		},
		{ 
			title: 'Внештатный инженер', 
			names: [ 
				'внештатный инженер',
			] 
		},
		{
			title: '...Бесправное племя?',
			names: [
                '„„Бесправное племя?',
            ] 
        },
		{ 
            title: 'Страсть к коллекционированию', 
            names: [
                'Страсть кколлекционированию'
            ] 
        },
	];

	const eng_aliases = [
		{ 
			title: `It's Showtime!`, 
			names: []
		},
		{ 
			title: `DO NOT ENTER`, 
			names: []
		},
	]

	for (let v of alliases) {
		if (title === v.title || v.names.includes(title)) {
			return v.title;
		}
    }

	for (let v of eng_aliases) {
        if (title_eng === v.title || v.names.includes(title_eng)) {
            return v.title;
        }
    }

	return title;
}


const img_folder = 'images';

if (!fs.existsSync(img_folder)) {
    fs.mkdirSync(img_folder);
}

const check_stats = () => {
	const achivements_true = achivements.filter(v => v.completed);
	const achivements_true_count = achivements_true.length;
	const achivements_true_percent = Math.round((achivements_true_count / achivements.length) * 100);
	console.log(`Achievements: ${achivements_true_count}/${achivements.length} (${achivements_true_percent}%)`);
}

const workers = {
	rus: null,
	eng: null
}

module.exports = {
	worket_init: async () => {
		workers.rus = await createWorker('rus');
		workers.eng = await createWorker('eng');
	},

	workers_destroy: async () => {
		if (workers.rus) await workers.rus.terminate();
		if (workers.eng) await workers.eng.terminate();
	},

	recognize_screenshot: async () => {
		return new Promise( (res) => {
			windows.forEach((window) => {
				if (window.title.indexOf('ZenlessZoneZero') > -1) {

					window.captureImage().then( async data => { 
						
						fs.writeFileSync(`original.png`, await data.toPng());
						const height = 132;

						added_new = 0;

						for (let y = 205; y < 900; y = y + height) {
							const data_crop = await data.crop(525, y, 870, height);
							const filename = path.join(img_folder, y+'.png');
							fs.writeFileSync(filename, await data_crop.toPng());
							await (await Jimp.read(filename)).contrast(1).write(filename);

							const ret_rus = await workers.rus.recognize(filename);
							const text_rus = ret_rus.data.text.split('\n').filter( v => v);

							if (text_rus.length == 0) {
								console.log('Empty text'.red);
								continue;
							}

							const rus_title = text_rus.shift();
							const eng_title = '';

							const found_type = achivements_categories.findIndex( v => v.title === rus_title);
							if (found_type == -1) {
								const ret_eng = await workers.eng.recognize(filename);
								const text_eng = ret_eng.data.text.split('\n').filter( v => v);
								eng_title = text_eng.shift();
							}

							const result = {
								title_eng:  eng_title,
								title: rus_title,
								desc: text_rus.join('\n')
							}

							result.title = checktitle(result);

							const data_crop_points = await data.crop(1568, y, 40, height);
							const filename_points = path.join(img_folder, y+'_p.png');
							fs.writeFileSync(filename_points, await data_crop_points.toPng());
							await (await Jimp.read(filename_points)).contrast(1).write(filename_points);
							
							const ret_ponints = await workers.eng.recognize(filename_points);
							result.completed = ret_ponints.data.text.replace('\n', '').length > 0 ? true : false;

							const idx = achivements.findIndex( v => v.title === result.title );
							if (idx === -1) {
								console.log(result);
								achivements.push(result);
								added_new++;
							} else {
								achivements[idx] = result;
							}
							
						}
						console.log(`Added new achievements: ${added_new == 6 ? added_new.toString().green : added_new.toString().red}/6`);

						check_stats();

						fs.writeFileSync('achivements.json', JSON.stringify(achivements), { encoding: 'utf8' });

						res(true);

					});
				}

			});
		});
	}
}