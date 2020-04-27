const path = require('path');

module.exports = {
	entry: './src/index.js',
	devServer: {
		contentBase: './dist'
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.(png|svg|jpg|gif|mp3|wav)$/,
				use: [
					'file-loader'
				]
			}
		]
	}
};