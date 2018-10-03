import { SectionType, Section } from './Section';
import { Modal } from './Modal';

export function createSection(type: SectionType) {
	return new Section(type);
}
export function createModal() {
	return new Modal();
}
