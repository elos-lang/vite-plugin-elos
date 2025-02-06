import { lex, parse, compile } from 'elos';

export default function elos() {
	return {
		name: 'vite-plugin-elos',
		transform(code, id) {
			if (id.endsWith('.elos')) {
				try {
					const tokens = lex(code);
					const ast = parse(tokens);
					const html = compile(ast);

					// Return the HTML as a JS module
					return {
						code: `export default ${JSON.stringify(html)}`,
						map: null // Optionally add source map if supported
					};
				} catch (error) {
					this.error(`Error compiling ELOS file ${id}: ${error.message}`);
				}
			}
		},
		generateBundle(_, bundle) {
			for (const [fileName, chunk] of Object.entries(bundle)) {
				if (chunk.type === 'chunk' && chunk.isEntry) {
					const match = chunk.code.match(/export\s+default\s+"(.*)"/);
					if (match) {
						const htmlContent = match[1]; // Extract transformed HTML
						const outputFileName = fileName.replace(/\.(js|ts)$/, '.html');

						// Emit as an asset in the output bundle
						this.emitFile({
							type: 'asset',
							fileName: outputFileName,
							source: htmlContent,
						});
					}
				}
			}
		},
	};
}