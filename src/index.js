import {lex, parse, compile} from "elos";

export default function elos() {
	return {
		name: 'vite-plugin-elos',
		enforce: 'pre',

		// Handle .elos files during build
		async buildStart() {
			console.log('Compiling .elos files...');
		},

		async transform(code, id) {
			if (!id.endsWith('.elos')) return;

			compileElosToHtml(code);

			// Return nothing because we don’t want JS output
			return { code: '', map: null };
		},

		async generateBundle(_, bundle) {
			for (const [file, chunk] of Object.entries(bundle)) {
				if (file.endsWith('.elos')) {
					const source = chunk.source;
					const compiledHtml = compileElosToHtml(source);

					// Write the compiled HTML file to the output directory
					const htmlFileName = file.replace(/\.elos$/, '.html');
					this.emitFile({
						type: 'asset',
						fileName: htmlFileName,
						source: compiledHtml,
					});

					delete bundle[file]; // Prevent .elos from being bundled
				}
			}
		},
	};
}

// Dummy compiler function (Replace this with your actual Elos compiler)
function compileElosToHtml(code) {
	const tokens = lex(code);
	const ast = parse(tokens);
	return compile(ast);
}

