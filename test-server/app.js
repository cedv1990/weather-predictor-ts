const express = require('express');
const app = express();
require('dotenv').config();

const api = require('../functions/dist/http/app');

app.get('/generar-prediccion', api.generatePredictions);
app.get('/clima', api.getSpecificDayWeather);

app.listen(1234, () =>{
    console.log('Corriendo en 1234!');
    console.log(process.env.database_type);
});