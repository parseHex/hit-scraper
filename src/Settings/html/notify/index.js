import additionalNotifications from './additional-notifications';

export default function () {
	return `
		${additionalNotifications.call(this.user)}
	`;
}
