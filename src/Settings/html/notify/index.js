import additionalNotifications from './additional-notifications';

export default function () {
	return `
		${additionalNotifications.apply(this)}
	`;
}
