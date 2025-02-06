import { lex, parse, compile } from 'elos';

export default function elos() {

	let collectedFiles = {};

	return {
		name: 'vite-plugin-elos',
		enforce: 'pre',
		transform(code, id) {
			if (id.endsWith('.elos')) {
				try {
					const tokens = lex(code);
					const ast = parse(tokens);
					const html = compile(ast);

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