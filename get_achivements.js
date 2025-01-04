const {setMouseDelay, moveMouse, getMousePos, getPixelColor, getScreenSize, keyTap, setKeyboardDelay, scrollMouse, mouseToggle, dragMouse, moveMouseSmooth, mouseClick} = require("robotjs");

const {recognize_screenshot, worket_init, workers_destroy} = require('./recognize_screenshot');

const categories = {
	life: {
		pos: [1220, 64],
		cats: [
			{ x: 261, y: 322 },
			{ x: 261, y: 391 },
			{ x: 261, y: 465 },
			{ x: 261, y: 538 },
			{ x: 261, y: 604 },
			{ x: 261, y: 677 },
			{ x: 261, y: 748 },
		]
	},
	tactics: {
		pos: [1467, 50],
		cats: [
			{ x: 261, y: 314 },
			{ x: 261, y: 389 },
			{ x: 261, y: 459 },
			{ x: 261, y: 539 },
			{ x: 261, y: 611 },
		]
	},
	exploration: {
		pos: [1717, 59],
		cats: [
			{ x: 261, y: 320 },
			{ x: 261, y: 397 },
		]
	}
}

const mouse_select = async (x, y) => {
	return new Promise( (res) => {
		moveMouse(x, y);
		mouseClick();
		setTimeout( () => {
			res(true);
		}, 2000);
	});
}

const mouse_scroll = async () => {
	return new Promise( (res) => {
		setMouseDelay(10);
		moveMouse(1777, 930);
		setMouseDelay(25);
		mouseToggle("down"); 
		dragMouse(1777, 830);
		setMouseDelay(25);
		mouseToggle("up");
		setMouseDelay(10);
		setTimeout( () => {
			res(true);
		}, 2500);
	});
}

const is_scroll_end = () => {
	const color = getPixelColor(1822, 972);
	return color === '808080';
}

const main = async () => {
	await worket_init();

	for (let {pos, cats} of Object.values(categories)){
		await mouse_select(pos[0], pos[1]);

		for (let {x, y} of cats){
			await mouse_select(x, y);

			do {

				await new Promise( async (res) => {
					await recognize_screenshot();
                    res(true);
				});

				await mouse_scroll();
				
			} while (!is_scroll_end());			
			
		}

	}

	await workers_destroy();

}

const single_recognize = async () => {
	await worket_init();
	await recognize_screenshot();
	await workers_destroy();
}

// catches ctrl+c event
process.on('SIGINT', async () => {
	console.log('Closing...');
	await workers_destroy();
	process.exit();
});

const args = process.argv.slice(2);

if (args.length > 0) {
	if(args.includes('single')){
		setTimeout( single_recognize, 2000);
		console.log('single recognize')

	} else {
		console.log('standart start')
		setTimeout( main, 2000);
	}
} else {
	console.log('standart start')
	setTimeout( main, 2000);
}


