const path 				= require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack 			= require('webpack');

module.exports = env => {

	const { npm_config_sketch } = process.env;

	return {
		entry: `./src/sketches/${ npm_config_sketch }/index.js`,
		output: {
			path: path.resolve( __dirname, 'dist' ),
			filename: 'index.js'
		},
		resolve: {
			extensions: [".js", ".wasm"],
			alias: {
				Assets: 	path.resolve( __dirname, "assets/" ),
				Common: 	path.resolve( __dirname, "./src/common/" ),
				Globals: 	path.resolve( __dirname, `./src/sketches/${ npm_config_sketch }/globals` )
			},
		},
		plugins: [

			new HtmlWebpackPlugin( {

				template: `./src/sketches/${ npm_config_sketch }/index.html`,
				filename: 'index.html'

			} ),
			new webpack.DefinePlugin({

				SKETCH: npm_config_sketch

			} )

		],
		devServer: {

			contentBase: './dist',
			https: false,
			host: '0.0.0.0'

		},
		module: {
			
			rules: [
				{
					test: /\.css$/i,
					use: ['style-loader', 'css-loader'],
				},
				{
					test: /\.(png|jpe?g|gif|dds|hdr|obj|fbx|glb|gltf)$/i,
					loader: 'file-loader',
					options: {
						//publicPath: 'assets',
					},
				},
				{
					test: /\.(glsl|vs|fs|vert|frag)$/,
					exclude: /node_modules/,
					use: [
						'raw-loader',
						'glslify-loader'
					]
				}
			]

		}
	}
};	