import cliBoxes, {Boxes, BoxStyle} from 'cli-boxes';
import chalk from 'chalk';
import colorize from '../colorize.js';
import {type DOMNode} from '../dom.js';
import type Output from '../output.js';
import {BoxProps} from '../index.js';
import assert from 'assert';

export type Title = {
	title: string;
	inverse?: boolean;
	dim?: boolean;
	color?: BoxProps['backgroundColor'];
	backgroundColor?: BoxProps['backgroundColor'];
	style?: 'strike-through' | 'tab-deep' | 'tab-shallow';
};

type MutableBoxStyle = {-readonly [P in keyof BoxStyle]: BoxStyle[P]};

export function renderTitle(
	x: number,
	y: number,
	node: DOMNode,
	output: Output,
	position: 'top' | 'bottom',
) {
	const width = node.yogaNode!.getComputedWidth();
	const height = node.yogaNode!.getComputedHeight();

	const hasBorder = node.style.borderStyle ? true : false;
	const hasTopBorder = hasBorder && node.style.borderTop !== false;
	const hasBottomBorder = hasBorder && node.style.borderBottom !== false;
	const hasLeftBorder = hasBorder && node.style.borderLeft !== false;
	const hasRightBorder = hasBorder && node.style.borderRight !== false;

	let box: MutableBoxStyle | undefined;
	if (hasBorder && position === 'top') {
		box = getBox(node, true);
	}
	if (hasBorder && position === 'bottom') {
		box = getBox(node, true);
	}

	let hasPadding = false;
	let contentWidth = width - (hasLeftBorder ? 1 : 0) - (hasRightBorder ? 1 : 0);
	if (contentWidth >= 2) {
		hasPadding = true;
		contentWidth -= 2;
	}

	let left = node.style.titleTopLeft;
	let center = node.style.titleTopCenter;
	let right = node.style.titleTopRight;

	if (position === 'bottom') {
		left = node.style.titleBottomLeft;
		center = node.style.titleBottomCenter;
		right = node.style.titleBottomRight;
	}

	let leftText = left?.title ?? '';
	let centerText = center?.title ?? '';
	let rightText = right?.title ?? '';

	const leftStart = 0;
	const centerStart = Math.floor((contentWidth - centerText.length) / 2);
	const rightStart = Math.max(contentWidth - rightText.length, 0);

	let fillChar = position === 'top' ? (box?.top ?? ' ') : (box?.bottom ?? ' ');

	const line = new Array(contentWidth).fill(
		fillChar === ' '
			? colorize(fillChar, node.style.backgroundColor, 'background')
			: fillChar,
	);

	let hasLeftGap = true;
	let hasRightGap = true;
	let leftEnd = leftStart;
	let j = 0;
	for (let i = leftStart; i < leftText.length; ++i) {
		if (i >= contentWidth) {
			hasLeftGap = false;
			hasRightGap = false;
		}
		if (centerText && i >= centerStart) {
			hasLeftGap = false;
			break;
		}
		if (rightText && i >= rightStart) {
			hasRightGap = false;
			hasLeftGap = false;
			break;
		}
		line[i] = leftText[j++];
		++leftEnd;
	}

	let centerEnd = centerStart;
	j = 0;
	for (let i = centerStart; i < centerStart + centerText.length; ++i) {
		if (i >= contentWidth) break;
		if (rightText && i >= rightStart) {
			hasRightGap = false;
			break;
		}
		line[i] = centerText[j++];
		++centerEnd;
	}

	let rightEnd = rightStart;
	j = 0;
	for (let i = rightStart; i < rightStart + rightText.length; ++i) {
		if (i >= contentWidth) break;
		line[i] = rightText[j++];
		++rightEnd;
	}

	let leftSlice = line.slice(leftStart, leftEnd);
	let leftGapSlice = line.slice(leftEnd, centerStart);
	let centerSlice = line.slice(centerStart, centerEnd);
	let rightGapSlice = line.slice(centerEnd, rightStart);
	let rightSlice = line.slice(rightStart, rightEnd);

	const leftTitle = colorizeSlice(leftSlice.join(''), left);
	const leftGap = leftGapSlice.join('');
	const centerTitle = colorizeSlice(centerSlice.join(''), center);
	const rightGap = rightGapSlice.join('');
	const rightTitle = colorizeSlice(rightSlice.join(''), right);

	const leftCorner = hasLeftBorder
		? position === 'top'
			? box!.topLeft
			: box!.bottomLeft
		: '';

	const rightCorner = hasRightBorder
		? position === 'top'
			? box!.bottomRight
			: box!.bottomRight
		: '';

	let outputLine = '';
	outputLine += leftCorner;
	outputLine += hasPadding ? fillChar : '';
	outputLine += leftTitle;
	outputLine += hasLeftGap ? leftGap : '';
	outputLine += centerTitle;
	outputLine += hasRightGap ? rightGap : '';
	outputLine += rightTitle;
	outputLine += hasPadding ? fillChar : '';
	outputLine += rightCorner;

	if (position === 'top') {
		output.write(x, y, outputLine, {transformers: []});
	} else {
		output.write(x, y + height - 1, outputLine, {transformers: []});
	}
}

function colorizeSlice(text: string, title?: Title): string {
	if (!title) return text;

	if (title.color) {
		text = colorize(text, title.color, 'foreground');
	}
	if (title.backgroundColor) {
		text = colorize(text, title.backgroundColor, 'background');
	}
	if (title.inverse) {
		text = chalk.inverse(text);
	}
	if (title.dim) {
		text = chalk.dim(text);
	}
	return text;
}

function getBox(node: DOMNode, colorized?: boolean): MutableBoxStyle {
	const immutableBox =
		typeof node.style.borderStyle === 'string'
			? cliBoxes[node.style.borderStyle as keyof Boxes]
			: node.style.borderStyle;

	assert(immutableBox !== undefined);

	if (!colorized) return {...immutableBox!};

	const box = {...immutableBox};

	const borderColor = node.style.borderColor;
	const borderTopColor = node.style.borderTopColor ?? borderColor;
	const borderLeftColor = node.style.borderLeftColor ?? borderColor;
	const borderRightColor = node.style.borderRightColor ?? borderColor;
	const borderBottomColor = node.style.borderBottomColor ?? borderColor;

	const colorFactory = (colorStr: string) => (str: string) => {
		return colorize(str, colorStr, 'foreground');
	};

	if (borderTopColor) {
		const color = colorFactory(borderTopColor);
		box.top = color(box.top);
		box.topLeft = color(box.topLeft);
		box.topRight = color(box.topRight);
	}

	if (borderBottomColor) {
		const color = colorFactory(borderBottomColor);
		box.bottom = color(box.bottom);
		box.bottomLeft = color(box.bottomLeft);
		box.bottomRight = color(box.bottomRight);
	}

	if (borderLeftColor) {
		const color = colorFactory(borderLeftColor);
		box.left = color(box.left);
	}

	if (borderRightColor) {
		const color = colorFactory(borderRightColor);
		box.right = color(box.right);
	}

	const borderDim = node.style.borderDimColor;
	const borderTopDim = node.style.borderTopDimColor ?? borderDim;
	const borderBottomDim = node.style.borderBottomDimColor ?? borderDim;
	const borderLeftDim = node.style.borderLeftDimColor ?? borderDim;
	const borderRightDim = node.style.borderRightDimColor ?? borderDim;

	const dim = (str: string) => chalk.dim(str);

	if (borderTopDim) {
		box.top = dim(box.top);
		box.topLeft = dim(box.topLeft);
		box.topRight = dim(box.topRight);
	}

	if (borderBottomDim) {
		box.bottom = dim(box.bottom);
		box.bottomLeft = dim(box.bottomLeft);
		box.bottomRight = dim(box.bottomRight);
	}

	if (borderLeftDim) {
		box.left = dim(box.left);
	}

	if (borderRightDim) {
		box.right = dim(box.right);
	}

	return box;
}

function getOneSideColorizedBox(
	node: DOMNode,
	side: 'top' | 'bottom' | 'left' | 'right',
): MutableBoxStyle | undefined {
	const _box =
		typeof node.style.borderStyle === 'string'
			? cliBoxes[node.style.borderStyle as keyof Boxes]
			: node.style.borderStyle;

	const box = typeof _box !== 'undefined' ? {..._box} : undefined;
	if (box === undefined) return undefined;

	const borderColor = node.style.borderColor;
	const borderTopColor = node.style.borderTopColor ?? borderColor;
	const borderBottomColor = node.style.borderBottomColor ?? borderColor;
	const borderLeftColor = node.style.borderLeftColor ?? borderColor;
	const borderRightColor = node.style.borderRightColor ?? borderColor;

	const borderDim = node.style.borderDimColor ?? false;
	const borderTopDim = node.style.borderTopDimColor ?? borderDim;
	const borderBottomDim = node.style.borderBottomDimColor ?? borderDim;
	const borderLeftDim = node.style.borderLeftDimColor ?? borderDim;
	const borderRightDim = node.style.borderRightDimColor ?? borderDim;

	const colorizeFactory = (color?: string) => (text: string) => {
		if (!color) return;
		return colorize(text, color, 'foreground');
	};
	const dimFactory = (dim: boolean) => (text: string) => {
		if (!dim) return;
		chalk.dim(text);
	};

	const controller = {
		color: (_: string) => {},
		dim: (_: string) => {},
	};

	if (side === 'top') {
		controller.color = colorizeFactory(borderTopColor);
		controller.dim = dimFactory(borderTopDim);
	}
	if (side === 'bottom') {
		controller.color = colorizeFactory(borderBottomColor);
		controller.dim = dimFactory(borderBottomDim);
	}
	if (side === 'left') {
		controller.color = colorizeFactory(borderLeftColor);
		controller.dim = dimFactory(borderLeftDim);
	}
	if (side === 'right') {
		controller.color = colorizeFactory(borderRightColor);
		controller.dim = dimFactory(borderRightDim);
	}

	for (const key in box) {
		(box as any)[key] = controller.color((box as any)[key]);
		(box as any)[key] = controller.dim((box as any)[key]);
	}

	return box;
}

// box param is not optional, non-bordered tabs will not be drawn here
// x, y must be dynamic.  This fn does not x or y offsets
function drawTab(
	x: number,
	y: number,
	title: Title,
	location: 'top' | 'bottom',
	output: Output,
	box: MutableBoxStyle,
): void {
	const LENGTH = title.title.length;
	let text = title.title;
	if (title.color) {
		text = colorize(text, title.color, 'foreground');
	}
	if (title.backgroundColor) {
		text = colorize(text, title.backgroundColor, 'background');
	}
	if (title.inverse) {
		text = chalk.inverse(text);
	}

	if (location === 'top' && title.style === 'tab-shallow') {
		let line1 = '';
		line1 += box.bottomRight;
		line1 += text;
		line1 += box.bottomLeft;
		output.write(x, y, line1, {transformers: []});

		let line2 = '';
		line2 += box.topLeft;
		line2 += box.top.repeat(LENGTH);
		line2 += box.topRight;
		output.write(x - 1, y, line2, {transformers: []});
	}

	if (location === 'top' && title.style === 'tab-deep') {
		let line1 = '';
		line1 += box.bottomRight;
		line1 += ' '.repeat(LENGTH);
		line1 += box.bottomLeft;
		output.write(x, y, line1, {transformers: []});

		let line2 = '';
		line2 += box.left;
		line2 += text;
		line2 += box.right;
		output.write(x - 1, y, line2, {transformers: []});

		let line3 = '';
		line3 += box.topLeft;
		line3 += box.top.repeat(LENGTH);
		line3 += box.topRight;
		output.write(x - 2, y, line3, {transformers: []});
	}

	/***** NEED TO ADJUST Y OFFSET FOR BOTTOM!!! *****/
	if (location === 'bottom' && title.style === 'tab-shallow') {
		let line1 = '';
		line1 += box.topRight;
		line1 += text;
		line1 += box.topLeft;
		output.write(x, y, line1, {transformers: []});

		let line2 = '';
		line2 += box.bottomLeft;
		line2 += box.bottom.repeat(LENGTH);
		line2 += box.bottomRight;
		output.write(x + 1, y, line2, {transformers: []});
	}

	if (location === 'bottom' && title.style === 'tab-deep') {
		let line1 = '';
		line1 += box.topRight;
		line1 += ' '.repeat(LENGTH);
		line1 += box.topLeft;
		output.write(x, y, line1, {transformers: []});

		let line2 = '';
		line2 += box.left;
		line2 += text;
		line2 += box.right;
		output.write(x + 1, y, line2, {transformers: []});

		let line3 = '';
		line3 += box.bottomLeft;
		line3 += box.bottom.repeat(LENGTH);
		line3 += box.bottomRight;
		output.write(x + 2, y, line3, {transformers: []});
	}
}

function getDim(
	text: string,
	style: Title['style'],
	hasBorder: boolean,
): [number, number] {
	if (style === 'strike-through') return [text.length, 0];

	let dx = text.length;
	let dy = 0;
	if (hasBorder) {
		dx += 2;
		dy += 1;
	}

	if (style === 'tab-shallow') {
		dy += 1;
	}

	if (style === 'tab-deep') {
		dy += 2;
	}

	return [dx, dy];
}
