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
				if (fileName.endsWith('.js')) {
					const match = chunk.code.match(/export\s+default\s+"(.*)"/);
					if (match) {
						const htmlContent = JSON.parse(match[1]);
						const outputFileName = fileName.replace(/\.js$/, '.html');
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