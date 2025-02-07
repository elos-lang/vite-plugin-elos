import { dirname } from 'path';
import { Elos } from 'elos';

export default function elos() {

	let collectedFiles = {};

	return {
		name: 'vite-plugin-elos',
		enforce: 'pre',
		transform(code, id) {
			if (id.endsWith('.elos')) {
				try {

					Elos.on('fileTouch', (data) => {
						this.addWatchFile(data.filename);
					});

					const path = dirname(id);
					const html = Elos.make(code, path);

					// Store for later writing
					collectedFiles[id] = html;

					// Return the HTML as a JS module
					return {
						code: `export default ${JSON.stringify(html)}`,
						map: null
					};
				} catch (error) {
					this.error(`Error compiling ELOS file ${id}: ${error.message}`);
				}
			}
		},
		handleHotUpdate({ file, server }) {
			// Check if the changed file is an included file
			server.ws.send({
				type: "full-reload",
				path: "*"
			});
		},
		generateBundle(_, bundle) {
			for (const [id, htmlContent] of Object.entries(collectedFiles)) {
				const fileName = id.split('/').pop().replace('.elos', '.html');

				this.emitFile({
					type: 'asset',
					fileName: fileName,
					source: htmlContent,
				});
			}
		}
	};
}