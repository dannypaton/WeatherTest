// Create empty object to start application
var app = {};

// Get current location
app.getLocation = function() {
  if ("geolocation" in navigator) {
    // geolocation is available
    navigator.geolocation.getCurrentPosition(function(position) {
      app.latLng = position.coords.latitude + ',' + position.coords.longitude;
      // console.log(app.latLng);
      $.ajax({
        url: 'http://maps.googleapis.com/maps/api/geocode/json',
        type: 'GET',
        dataType: 'json',
        data: {
          latlng: app.latLng 
        },
        success: function(location) {
          app.getWeatherInfo(location.results[5]);
          app.showLocation(location.results[5]);
        }
      });
    });
  } else {
     console.log('geolocation IS NOT available');
  }
};

// Show Location in header
app.showLocation = function(loc) {
  $('.main h1').text(loc.address_components[0].long_name + ', ' + loc.address_components[2].long_name);
  $('title').text(loc.address_components[0].long_name + ', ' + loc.address_components[2].long_name + ' | ' + 'Forecastr');
};

// Get weather information from Weather Underground
app.getWeatherInfo = function(city) {
  var cityState = 'Ontario/Toronto';
  $.ajax({
    url: 'http://api.wunderground.com/api/6aaf4b4a2f7e9b41/forecast10day/q/' + cityState +'.json',
    type: 'GET',
    dataType: 'jsonp',
    success: function(data) {
      app.showWeather(data.forecast.simpleforecast.forecastday);
    }
  });
};

// Show weather info
app.showWeather = function(weather) {
  var condition = '';
  $.each(weather, function(i, day) {
    condition = day.conditions;
    var $temp = $('<h2>').addClass('temp').html(day.high.celsius + '&deg;');
    var $day = $('<h3>').text(day.date.weekday);
    var $cond = $('<h4>').text(day.conditions);
    var $svg;
    if (day.conditions === "Mostly Cloudy" || day.conditions === "Partly Cloudy") {
      $svg = $('.climacon_cloudSunFill').html();
    }
    if (day.conditions === "Sunny" || day.conditions === "Clear") {
      $svg = $('.climacon_sunFill').html();
    }
    if (day.conditions === "Overcast") {
      $svg = $('.climacon_cloudFill').html();
    }
    if (day.conditions === "Chance of Rain" || day.conditions === "Rain") {
      $svg = $('.climacon_cloudDrizzleFillAlt').html();
    }
    if (day.conditions === "Chance of a Thunderstorm") {
      $svg = $('.climacon_cloudLightning').html();
    }
    var $icon = $('<div>').addClass('icon').html('<svg version="1.1" viewBox="15 15 70 70">' + $svg + '</svg>');
    var $weatherItem = $('<article>').addClass('weatherItem').append($day, $icon, $temp, $cond);

    $weatherItem.data('condition', day.conditions);

    $('.weather').append($weatherItem);
    return i < 6;
  });
  app.getImages(condition);
};

app.weatherConditions = function() {
  $('.weather').on('click', '.weatherItem', function() {
    app.getImages($(this).data('condition'));
  });
};

// Initialize the app
app.init = function() {
  // init locate
  app.getLocation();
  // init images
  app.weatherConditions();
};

// Make the magic happen
$(function() {
  app.init();
});