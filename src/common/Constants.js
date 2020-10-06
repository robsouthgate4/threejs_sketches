
export default class Constants {

	static IsTouchDevice() {

		return (('ontouchstart' in window) ||
				window.DocumentTouch &&
				document instanceof window.DocumentTouch) ||
				navigator.msMaxTouchPoints ||
				false;

	}

}