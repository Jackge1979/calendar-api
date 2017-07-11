import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve'

export default {
	entry: 'src/CalendarAPI.es6',
	dest: 'dist/CalendarAPI.js',
	format: 'umd',
	moduleName: 'CalendarAPI',
	plugins: [
		resolve({
			customResolveOptions: {
				moduleDirectory: 'node_modules'
			}
		}),
		babel({
			exclude: 'node_modules/**'
		})
	]
};