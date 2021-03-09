module.exports = {
	configureWebpack: config =>{
		config.optimization = {
			minimize: false
		}     
	}, 
	 publicPath:  process.env.NODE_ENV === 'production'?'/balloons/':'/'
}