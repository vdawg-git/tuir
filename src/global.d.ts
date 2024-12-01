import {type ReactNode, type Key, type LegacyRef} from 'react';
import {type Except} from 'type-fest';
import {type DOMElement} from './dom.js';
import {type Styles} from './styles.js';
import {TextProps} from './index.ts';

declare global {
	namespace JSX {
		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
		interface IntrinsicElements {
			'ink-box': Ink.Box;
			'ink-text': Ink.Text;
		}
	}
}

declare namespace Ink {
	type Box = {
		internal_static?: boolean;
		children?: ReactNode;
		key?: Key;
		ref?: LegacyRef<DOMElement>;
		style?: Except<Styles, 'textWrap'>;
		ID?: string;
		isPageFocus?: boolean;
		setLeftActive?: (b: boolean) => void;
		setRightActive?: (b: boolean) => void;
		internalStyles?: Styles;
	};

	type Text = {
		children?: ReactNode;
		key?: Key;
		// was just Styles
		style?: Styles & TextProps;

		// eslint-disable-next-line @typescript-eslint/naming-convention
		internal_transform?: (children: string, index: number) => string;
		internalStyles?: TextProps;
	};
}
