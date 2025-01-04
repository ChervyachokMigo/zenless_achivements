const {setMouseDelay, moveMouse, getMousePos, getPixelColor, getScreenSize, keyTap, setKeyboardDelay, scrollMouse, mouseToggle, dragMouse, moveMouseSmooth} = require("robotjs");
	
let old_x = 0
let old_y = 0;

const main = () => {

	const mouse = getMousePos();
	
	if (old_x != mouse.x && old_y != mouse.y) {
		const color = getPixelColor(mouse.x, mouse.y-5);
		console.log("Mouse: ", mouse.x, mouse.y, "Color: ", color);
		old_x = mouse.x;
		old_y = mouse.y;
	}

		
	
}


setInterval( main, 1000);

