var keypress = require('keypress');
const colors = require('colors')
const fs = require('fs');
const achivements_categories_const = require('./achivements_categories_const');

const achivements = fs.existsSync('achivements.json') ? JSON.parse(fs.readFileSync('achivements.json', {encoding: 'utf8'})) : [];

const achivements_categories = fs.existsSync('achivements_categories.json') ? JSON.parse(fs.readFileSync('achivements_categories.json', {encoding: 'utf8'})) : [];

const add_spaces = (string, target_length) => {
	const spaces_count = target_length - string.length;
	if (spaces_count < 0) return string;
	return string +' '.repeat(spaces_count);

}

const check_stats = () => {
	const achivements_true = achivements.filter(v => v.completed);
	const achivements_true_count = achivements_true.length;
	const achivements_true_percent = Math.round((achivements_true_count / achivements.length) * 100);
	console.clear();
	console.log(`Achievements categories:`);
	for (let i = 0; i < achivements_categories_const.length; i++){
		const achivements_title_set = new Set(achivements_categories.filter(v => v.cat === i).map( v => v.title ));
		const achivements_grouped = achivements.filter( v => achivements_title_set.has(v.title)) || [];
		const achivements_completed = achivements_grouped.filter(v => v.completed) || [];
		//count
		const percent_group = achivements_completed.length * 100 / achivements_grouped.length;
		console.log(
			add_spaces(` [${achivements_categories_const[i]}]`,28), 
			add_spaces(`${achivements_completed.length}/${achivements_grouped.length}`.yellow, 17), 
			`(${percent_group.toFixed(1)}%)`
		);		
	}
	console.log(add_spaces(`Achievements:`, 28), add_spaces(`${achivements_true_count}/${achivements.length}`.yellow, 17),`(${achivements_true_percent}%)`);
}

check_stats();