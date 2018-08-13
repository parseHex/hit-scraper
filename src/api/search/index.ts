import Core from 'Core';

export function isCruising() {
	return Core.cruising;
}

export * from './start-stop';
export * from './listen';
export { listenForHITs as listen } from './listen';
