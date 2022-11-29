//Importamos los modulos
const express = require('express');
const https = require('https');
const bodyParser = require("body-parser");

//Instanciamos el servidor con ExpressJS
const app = express();
const port = 3000;

//Decodificacion de bodyParser
app.use(bodyParser.urlencoded({extended:true}));

//Método GET para petición de busqueda
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
})

//Método POST para envío de formulario
app.post("/", function(req, res) {  
  let query = req.body.cityName;  //Definicion de variables para realizar la peticion HTTP a la API OpenWeather
  const key = "111050335c8faae8308d1b5a75b6154e";
  const unit = "metric";  
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + key;

  //Obtiene la respuesta del método GET a la URL de la API para obtener una response
  https.get(url, function(response) {
    console.log(response.statusCode);

    if (response.statusCode == 200) {
      response.on("data", function(data){
        const weatherData = JSON.parse(data); //Extraer los datos del JSON generado por la API como response al request
        const temp = weatherData.main.temp;
        const desc = weatherData.weather[0].description;
        const feel = weatherData.main.feels_like;
        const icon = weatherData.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@4x.png";  
        
        res.write("<p>The weather is currently " + desc)
        res.write("<h1>The temperature in " + query + " is " + temp + " Celsius</h1>")
        res.write("<p>But it feels like " + feel + " Celsius</p>");
        res.write("<img src='" + imageURL + "'>");
        res.send();
      })
    }
    else if (response.statusCode == 400) {
      res.send("City name is invalid!!!");
    }
    
  })
})

app.listen(port); //Listener del servidor
