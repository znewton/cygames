const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public');
const APP_DIR = path.resolve(__dirname, 'src');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
	entry: APP_DIR + '/index.jsx',
	output: {
		path: BUILD_DIR,
		filename: 'bundle.min.js'
	},
	module : {
		loaders : [
			{
				test : /\.jsx?/,
				include : APP_DIR,
				loader : 'babel-loader'
			},
			{
				test : /\.scss?/,
				include : APP_DIR,
				use : ExtractTextPlugin.extract([
					// {loader : "style-loader"},
					{loader : "css-loader"},
					{loader : "sass-loader"}
				])
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('bundle.min.css'),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin(),
	]
};

module.exports = config;