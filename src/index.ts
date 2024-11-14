export type {RenderOptions, Instance} from './render.js';
export {default as render} from './render.js';
export type {Props as TextProps} from './components/Text.js';
export {default as Text} from './components/Text.js';
export type {Props as AppProps} from './components/AppContext.js';
export type {Props as StdinProps} from './components/StdinContext.js';
export type {Props as StdoutProps} from './components/StdoutContext.js';
export type {Props as StderrProps} from './components/StderrContext.js';
export type {Props as StaticProps} from './components/Static.js';
export {default as Static} from './components/Static.js';
export type {Props as TransformProps} from './components/Transform.js';
export {default as Transform} from './components/Transform.js';
export type {Props as NewlineProps} from './components/Newline.js';
export {default as Newline} from './components/Newline.js';
export {default as Spacer} from './components/Spacer.js';
export type {Key} from './hooks/use-input.js';
export {default as useInput} from './hooks/use-input.js';
export {default as useApp} from './hooks/use-app.js';
export {default as useStdin} from './hooks/use-stdin.js';
export {default as useStdout} from './hooks/use-stdout.js';
export {default as useStderr} from './hooks/use-stderr.js';
export {default as useFocus} from './hooks/use-focus.js';
export {default as useFocusManager} from './hooks/use-focus-manager.js';
export {default as measureElement} from './measure-element.js';
export type {DOMElement} from './dom.js';

// Fork
export {STDIN, ALT_STDIN, setMouse} from './Stdin/Stdin.js';
export {default as useEvent} from './Stdin/KeyboardInputHooks/useEvent.js';
export {useTypedEvent} from './Stdin/KeyboardInputHooks/useEvent.js';
export {default as useKeymap} from './Stdin/KeyboardInputHooks/useKeymap.js';

// Add 'backgroundColor' property to Box component
export type {Props as BoxProps} from './components/Box.js';
export {default as Box} from './components/Box.js';
// export type {Props as BoxProps} from './BoxBgColor/Box.js';
// export {Box} from './BoxBgColor/Box.js';

import {KeyboardTypes} from './Stdin/Keyboard.js';
type KeyMap = KeyboardTypes.KeyMap;
export type {KeyMap};

// Window
export {useWindow} from './Window/useWindow.js';
export {Window} from './Window/Window.js';
export type {ItemGenerator} from './Window/Window.js';
export {useListItem, useIsFocus, usePage} from './Window/UnitContext.js';

// List
export {useList} from './Window/List/useList.js';
export {List} from './Window/List/List.js';

// Pages
export {usePages} from './Window/Pages/usePages.js';
export {Pages} from './Window/Pages/Pages.js';

// Lines
export {VerticalLine, HorizontalLine} from './Lines/Line.js';
