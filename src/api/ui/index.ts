import { SectionType, Section } from './Section';

export function createSection(type: SectionType) {
	return new Section(type);
}
