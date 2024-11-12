import {randomUUID} from 'crypto';
import useEvent from '../Stdin/KeyboardInputHooks/useEvent.js';
import useKeymap from '../Stdin/KeyboardInputHooks/useKeymap.js';
import {ListKeymaps, LIST_CMDS} from './ListKeymaps.js';
import {
	UseWindowOpts,
	UseWindowReturn,
	UseWindowUtil,
	ViewState,
} from './types.js';
import {useScroll} from './useScroll.js';
import {useState} from 'react';

export function useWindow(
	items: unknown[],
	opts: UseWindowOpts,
): UseWindowReturn {
	// Set default opts
	opts = {
		windowSize: null,
		centerScroll: false,
		navigation: 'vi-vertical',
		fallthrough: false,
		vertical: true,
		...opts,
	};

	let fitWindow = false;
	if (opts.windowSize === 'fit') {
		fitWindow = true;
		opts.windowSize = 0;
	}

	const {scrollState, scrollAPI, LENGTH, WINDOW_SIZE} = useScroll(items, {
		centerScroll: opts.centerScroll,
		fallthrough: opts.fallthrough,
		windowSize: opts.windowSize,
	});

	const [ID] = useState(randomUUID());

	const getKeymap = () => {
		// prettier-ignore
		switch (opts.navigation) {
			case 'vi-vertical': return ListKeymaps.vimVertical(ID);
			case 'vi-horizontal': return ListKeymaps.vimHorizontal(ID);
			case 'arrow-vertical': return ListKeymaps.arrowVertical(ID);
			case 'arrow-horizontal': return ListKeymaps.arrowHorizontal(ID);
			default: return {};
		}
	};

	const keymap = getKeymap();

	useKeymap(keymap);
	useEvent(LIST_CMDS.increment(ID), () => {
		scrollAPI.nextItem();
	});
	useEvent(LIST_CMDS.decrement(ID), () => {
		scrollAPI.prevItem();
	});
	useEvent(LIST_CMDS.goToTop(ID), () => {
		scrollAPI.goToIndex(0);
	});
	useEvent(LIST_CMDS.goToBottom(ID), () => {
		scrollAPI.goToIndex(LENGTH - 1);
	});
	useEvent(LIST_CMDS.scrollDown(ID), () => {
		scrollAPI.scrollDown();
	});
	useEvent(LIST_CMDS.scrollUp(ID), () => {
		scrollAPI.scrollUp();
	});

	const util: UseWindowUtil = {
		currentIndex: scrollState.idx,
		...scrollAPI,
	};

	const viewState: ViewState = Object.freeze({
		_start: scrollState.start,
		_end: scrollState.end,
		_idx: scrollState.idx,
		_winSize: WINDOW_SIZE,
		_itemsLen: LENGTH,
		_util: util,
		_items: items,
		_fitWindow: fitWindow,
	});

	return {
		viewState,
		util,
	};
}
