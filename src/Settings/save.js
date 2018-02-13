export default function () {
	localStorage.setItem('scraper_settings', JSON.stringify(this.user));
}
