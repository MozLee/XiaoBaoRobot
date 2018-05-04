const ts = require('./checkWeatherTask');
async(() => {
    let {weatherData,citys,weatherUsers} = await ts.getWeatherInfo(); 
})()
console.log(weatherData);
console.log(citys);
console.log(weatherUsers);