var buttonElement = document.getElementById('the-button');

buttonElement.addEventListener('click', (event) => {
	downloadFile();
});

async function downloadFile () {
	// The file we are going to download. It's big on purpose to see progress.
	// Yeah, I made that GIF to signal my team to deploy to production on Slack.
	const URL = 'http://i.imgur.com/CiOS56r.gif';

	console.log('downloading...', URL);

	const response = await axios.get(URL, {
		responseType:"blob",
		onDownloadProgress: (progressEvent) => {
			console.log('progress', progressEvent.loaded / progressEvent.total);
		}
	});

	console.log('response', response);

	saveBlobToFile(response.data, 'kraken.gif');
}

function saveBlobToFile (blob, fileName) {

	// First get a file system reference
	window.webkitRequestFileSystem(window.PERSISTENT, blob.size, function (fs) {

		console.log(fs);
		console.log(fs.root);

		// then we create an empty file and get a fileEntry reference for that file
		fs.root.getFile(fileName, {create: true}, (fileEntry) => {

			console.log(fileEntry);

			// Then generate a writer to be able to write (d'oh)
			fileEntry.createWriter((writer) => {

				console.log(writer);

				writer.onwriteend = (event) => {
					console.log('file written!', event);
					// Since the file is stored in a sandboxed folder we need to get the URL to be able to show it back
					// Using href="/kraken.gif" will return a file not found error
					showFileToUser(fileEntry.toURL());
				};

				writer.onerror = errorHandler;

				// FINALLY write the file
				writer.write(blob);
			});

		}, errorHandler);

	}, errorHandler);
}

function errorHandler (error) {
	console.log('Error', error);
}

function showFileToUser(path) {
	console.log('showing', path);
	const  img = document.createElement("img");
	img.src = path;
	document.getElementById('the-result').appendChild(img);
}