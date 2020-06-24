class WeatherData {
    constructor(json) {
        this.tempF = this.tempToF(json.main.temp);
        this.tempC = this.tempToC(json.main.temp);
        this.humidity = json.main.humidity;
        this.windSpeedMph = this.windMetersPSToMPH(json.wind.speed);
        this.windSpeedKph = this.windMetersPSToKPH(json.wind.speed);
        this.windDir = this.windDegToDir(json.wind.deg);
    }

    tempToF(kelvin) {
    return ((kelvin - 273.15) * 1.8 + 32).toFixed(0);
    }

    tempToC(kelvin) {
    return (kelvin - 273.15).toFixed(0);
    }

    windMetersPSToMPH(speed) {
    return (speed * 2.2369).toFixed(1);
    }

    windMetersPSToKPH(speed) {
    return (speed / 1000 * 3600).toFixed(1);
    }

    windDegToDir(degrees) {
        let expr = parseInt(degrees);
        switch(true) {
            case (expr <= 69 && expr > 23) :
                return "NE";
            case (expr <= 113) :
                return "E";
            case (expr <= 158) :
                return "SE";
            case ( expr <= 203) :
                return "S";
            case (expr <= 248) :
                return "SW";
            case (expr <= 293) :
                return "W"
            case (expr <= 338) :
                return "NW"
            default :
                return "N"
        }
    }
}

const apiKey = '35212c2362c920fb78bcfbc661e77b86';


$.ajax({
    url: "https://freegeoip.app/json/",
    type: "GET",
    dataType: "json",
})
    .done(function(json) {
        let lat = json.latitude;
        let lon = json.longitude;
        $("<span>").text(`${json.city} ...maybe`).appendTo("#weatherHead");
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        console.log(json);
        getWeatherData();
    })

    .fail(function(xhr, status, errorThrown) {
        console.log( "Error: " + errorThrown );
        console.log( "Status: " + status );
        console.dir( xhr );
    })

function getWeatherData() {
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
    })
        .done(function(json) {
            $("#weather").show();
            const CurrentWeather = new WeatherData(json);
            $("<span class='weather_data'>").text(CurrentWeather.tempF).appendTo("#degreesF");
            $("<span class='weather_data'>").text(CurrentWeather.tempC).appendTo("#degreesC");
            $("<span class='weather_data'>").text(`${CurrentWeather.humidity} %`).appendTo("#humidity");
            $("<span class='weather_data'>").text(`${CurrentWeather.windSpeedMph} mph / `).appendTo("#wind");
            $("<span class='weather_data'>").text(`${CurrentWeather.windSpeedKph} kph`).appendTo("#wind");
            $("<span class='weather_data'>").text(CurrentWeather.windDir).appendTo("#direction");
        })

        .fail(function(xhr, status, errorThrown) {
            console.log( "Error: " + errorThrown );
            console.log( "Status: " + status );
            console.dir( xhr );
        })
}
