(function (config) {
	'use strict';
	const helpers = {
		getRandomInt (min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
		getRandomIndex (arr) {
			const idx = this.getRandomInt(0, arr.length - 1);
			return arr[idx];
		}
	};

	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);
	const ctx = canvas.getContext('2d');

	const controller = {
		columns: 0,
		cols: {},
		maxCols: 0
	};

	function onResize() {
		canvas.width = document.body.clientWidth;
		canvas.height = document.body.clientHeight;

		controller.columns = Math.floor(canvas.width / config.fontSize);
		controller.cols = {};
		controller.maxCols = Math.floor(controller.columns / 2);
	}
	window.addEventListener('resize', onResize);
	onResize();

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {keyof CanvasRenderingContext2D} params
	 * @param {Function} fn
	 */
	function runCtxAction (ctx, params, fn) {
		ctx.save();
		Object.assign(ctx, params);
		fn();
		ctx.restore();
	}

	function fillText (txt, x, y) {
		runCtxAction(ctx, {
			fillStyle: config.fontColor,
			font: `${config.fontSize}px serif`
		}, () => {
			ctx.fillText(txt, x, y);
		});
	};
	function fillTextSpecial (txt, x, y) {
		runCtxAction(ctx, {
			shadowColor: '#ffffff',
			shadowBlur: '2',
			strokeStyle: '#fff',
			font: `${config.fontSize}px serif`
		}, () => {
			ctx.strokeText(txt, x, y);
		});
	};
	function moreTransparent () {
		runCtxAction(ctx, {
			fillStyle: `rgba(0, 0, 0, ${config.transparencyUpadateLevel})`
		}, () => {
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		});
	};

	function randCol () {
		const x = Array.apply(null, {
			length: controller.columns
		}).map((_, b) => b.toString()).filter(a => Object.keys(controller.cols).indexOf(a) === -1);
		return helpers.getRandomIndex(x);
	};
	function newColumn () {
		const index = randCol();
		controller.cols[index] = {
			row: 0,
			last: null
		};
	};

	function next () {
		moreTransparent();
		if (Object.keys(controller.cols).length < controller.maxCols) {
			newColumn();
		}
		for (let i in controller.cols) {
			ctx.fillStyle = "rgba(0, 0, 0, 1)";
			ctx.fillRect(i * config.fontSize, controller.cols[i].row - config.fontSize, config.fontSize, config.fontSize);
			fillText(controller.cols[i].last, i * config.fontSize, controller.cols[i].row);

			controller.cols[i].row += config.fontSize;
			if (controller.cols[i].row >= canvas.height + config.fontSize) {
				delete controller.cols[i];
			} else {
				const char = config.getRandomChar(helpers);
				controller.cols[i].last = char;
				fillText(char, i * config.fontSize, controller.cols[i].row);
				fillTextSpecial(char, i * config.fontSize, controller.cols[i].row);
			}
		}
	};

	let interval;
	function start () {
		interval = window.setInterval(next, 1000 / config.speed);
	}
	start();
	return {
		start,
		stop() {
			clearInterval(interval);
		},
		$: canvas
	}
})({
	fontColor: '#02ed18',
	fontSize: 10,
	transparencyUpadateLevel: 0.05,
	getRandomChar (helpers) {
		return String.fromCharCode(helpers.getRandomInt(0, 2000));
	},
	speed: 30
});