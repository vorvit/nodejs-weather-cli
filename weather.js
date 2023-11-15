const os = require('os');
const path = require('path');
const fs = require('fs');
const https = require('https');

const userConfPath = path.join(os.homedir(), 'config.json');
if (fs.existsSync(userConfPath)) {
const config = require(userConfPath)
var sourceValue = config.city
var sourceKey = config.key
} else if (fs.existsSync('./config.json')){
const config = require('./config.json')
var sourceValue = config.city
var sourceKey = config.key
} else {
var sourceValue = 'Moscow'
var sourceKey = '90a59aaa67cc4f088b2170937231511'
};
    
function showHelp() {
    console.log('Запрашиваем погоду для указанного города с сайта api.weatherapi.com');
    console.log('Использование:');
    console.log('ключи:');
    console.log('[-s] <название города> // смена города для предсказания погоды');
    console.log('[-h] // вызов справки');
}

if (process.argv.indexOf('-h') > -1) {
    showHelp();
    process.exit();
}

const sourceFlagIndex = process.argv.indexOf('-s');
if (process.argv.indexOf('-s') > -1) {
    sourceValue = process.argv[sourceFlagIndex + 1];
}

https.get('https://api.weatherapi.com/v1/current.json?key=' + sourceKey + '&q=' + sourceValue + '&aqi=no', res => {
    let data = '';
    res.on('data', chunk => {
        data += chunk;
    });

res.on('end', () => {
            console.log('Город: ', JSON.parse(data).location.name);
            console.log('Температура (С): ', JSON.parse(data).current.temp_c);
            console.log('Ощущается как (С): ', JSON.parse(data).current.feelslike_c);
            console.log('Атмосферное давление (мм рт. ст.): ', (JSON.parse(data).current.pressure_mb * 0.75).toFixed());
            console.log('Влажность (%): ', JSON.parse(data).current.humidity);
            console.log('Скорость ветра (м/с): ', (JSON.parse(data).current.wind_mph * 0.44704).toFixed());
            console.log('Направление ветра: ', JSON.parse(data).current.wind_dir);
            console.log('Облачность: ', JSON.parse(data).current.condition.text);
});
});

// Сделал сначало запрос на API по адресу ниже, но он стал со временем выдавать ошибку
// https.get('https://goweather.herokuapp.com/weather/' + sourceValue, res => {
//     let data = '';
//     res.on('data', chunk => {
//         data += chunk;
//     });

//     res.on('end', () => {
//         console.log('The weather in ' + sourceValue.replace(/\b\w/g, l => l.toUpperCase()) + ':');
//         console.log(data);
//     });
// })