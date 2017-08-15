const path = require('path');
const webpack = require('webpack');
const nopt = require('nopt')

var failPlugin = require('webpack-fail-plugin')

const args = nopt(process.argv)
const isProd = args.prod

let plugins = [
	failPlugin,
	new webpack.DllPlugin({
		path: path.join(__dirname, '/build', '[name]-manifest.json'),
		name: '[name]_[hash]'
	}),
	new webpack.optimize.OccurrenceOrderPlugin(true)
]

if (isProd) {
	plugins = plugins.concat([
		new webpack.optimize.DedupePlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"'
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	])
}

module.exports = {
	entry: {
		vendors: [
			'react',
			'react-dom',
			'redux',
			'react-redux',
			'react-router',
			'react-router-dom',
			'jquery',
			'reselect',
			'underscore',
			'./src/locale-number-seperators.json',
			'./src/time-zone-names.json',
			'numeral',
			'moment',
			'moment-timezone',
			'backbone',
			'marker-clusterer-plus',
			'superagent'
		]
	},
	output: {
		path: path.join(__dirname, '/build'),
		filename: '[name]_[hash].js',
		library: '[name]_[hash]'
	},
	plugins,
	module: {
		loaders: [
			{ test: /\.json$/, loader: 'json-loader' }
		]
	}
};