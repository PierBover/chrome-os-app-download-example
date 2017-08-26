chrome.app.runtime.onLaunched.addListener(() => {
	chrome.app.window.create('index.html', {
		bounds: {
			width: 800,
			height: 600
		}
	});
});