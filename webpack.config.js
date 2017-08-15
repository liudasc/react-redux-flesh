'use strict'

const webpack = require('webpack')
const path = require('path')
const glob = require('glob')
const nopt = require('nopt')
const fs = require('fs')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const CoreJsPlugin = require('core-js-webpack-plugin')
const failPlugin = require('webpack-fail-plugin')

// parse args
const args = nopt({
	'testFile': String
}, {}, process.argv)

const env = process.env.WEBPACK_ENV
const isDev = env == 'dev'
const isProd = env == 'prod'
const isTest = env == 'test'
const useSourceMap = args.sourceMap
const useRepoMocks = args.mock
const usePerfTool = args.perf

const testFile = args.testFile
let testFiles = './src/**/*-test.ts*'
if (testFile && testFile.length > 0) {
	testFiles = './src/**/' + testFile
}

// build params
let buildDate = new Date().toISOString().slice(0, 10)
let buildVersion = 1

let vendorsManifest

const coreJsPlugins = [
	'es6.string.repeat',
	'es6.object.assign',
	'es6.number.is-nan',
	'es6.array.find',
	'es6.array.find-index',
	'es6.promise',
	'web.dom.iterable'
]

// pre-build
if (isDev || isProd) {

	const jsonManifest = './build/vendors-manifest.json'
	try {

		if (usePerfTool) {
			throw new Error('Rebuild')
		}

		fs.accessSync(jsonManifest, fs.F_OK)
		vendorsManifest = require(jsonManifest)

	} catch (error) {

		const execSync = require('child_process').execSync
		let command = 'npm run build:vendors'

		if (isProd) {
			command += ' -- --prod'
		}

		let res = execSync(command)
		console.log('' + res)
		vendorsManifest = require(jsonManifest)
	}
}

// plugins
const getProdPlugins = () => ([
	failPlugin,
	new CoreJsPlugin({
		modules: coreJsPlugins,
		library: false
	}),
	new webpack.BannerPlugin(
		'Liudas Cereskevicius (C) redux-juice ' + buildDate + ' v' + buildVersion,
		{ 'entryOnly': true }
	),
	new webpack.DefinePlugin({
		'process.env.NODE_ENV': '"production"' // // for use of faster redux build
	}),
	new webpack.optimize.DedupePlugin(),
	new webpack.optimize.OccurrenceOrderPlugin(true),
	new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
	}),
	new HtmlWebpackPlugin({
		template: 'index.ejs'
	}),
	new AddAssetHtmlPlugin({
		filepath: require.resolve('./build/' + vendorsManifest.name),
		includeSourcemap: false
	}),
	new webpack.DllReferencePlugin({
		context: __dirname,
		manifest: require(__dirname + "/build/vendors-manifest.json")
	}),
	new webpack.ProvidePlugin({
		'jQuery': 'jquery',
	})
])

const getDevPlugins = () => ([
	failPlugin,
	new CoreJsPlugin({
		modules: coreJsPlugins,
		library: false
	}),
	new HtmlWebpackPlugin({
		template: 'index.ejs'
	}),
	new AddAssetHtmlPlugin({
		filepath: require.resolve('./build/' + vendorsManifest.name),
		includeSourcemap: false
	}),
	new webpack.DllReferencePlugin({
		context: __dirname,
		manifest: require(__dirname + "/build/vendors-manifest.json")
	}),
	new webpack.ProvidePlugin({
		'jQuery': 'jquery',
	})
])

const getTestPlugins = () => ([
	new CoreJsPlugin({
		modules: coreJsPlugins,
		library: false
	}),
	new webpack.DefinePlugin({
		'global.GENTLY': false // for superagent to work with webpack: https://github.com/visionmedia/superagent/wiki/SuperAgent-for-Webpack
	})
])

// config
module.exports = {
	context: __dirname,
	entry: !isTest ? './src/index.tsx' : glob.sync(testFiles),
	devtool: useSourceMap ? 'source-map' : null,
	devServer: {
		host: '0.0.0.0', // needed for exposing via IP address
		port: 3000,
		historyApiFallback: true
	},
	output: {
		path: __dirname + '/build',
		publicPath: '/',
		filename: !isTest ? 'app' + (isDev ? '': '_[hash]') + '.js' : 'testBundle.js',
		devtoolModuleFilenameTemplate: '[absolute-resource-path]'
	},
	resolve: {
		extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.json']
	},
	plugins: isProd && getProdPlugins() || isDev && getDevPlugins() || isTest && getTestPlugins() || [],
	externals: {
		'react/addons': true,
		'react/lib/ExecutionEnvironment': true,
		'react/lib/ReactContext': true
	},
	module: {
		preLoaders: useSourceMap ? [{ test: /\.js$/, loader: 'source-map-loader' }] : [],
		loaders: [
			{ test: /\.json?$/, loader: 'json-loader' },
			{ test: /\.tsx?$/, exclude: [/node_modules/, /build/], loader: 'ts-loader' }
		]
	}
}
