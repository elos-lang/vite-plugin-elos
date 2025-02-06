import {lex, parse, compile} from "elos";

export default function elos(options = { extension: '.elos' }) {
	return {
		name: 'vite-plugin-elos',
		enforce: 'pre', // Ensures it runs early in the transform pipeline
		transform(code, id) {

			const tokens = lex(code);
			const ast = parse(tokens);
			const html = compile(ast);

			if (id.endsWith(options.extension)) {
				return {
					code: html,
					map: null, // No source map needed
				};
			}
		},
	};
}
