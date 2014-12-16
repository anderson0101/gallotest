/*
 * Google Maps documentation: http://code.google.com/apis/maps/documentation/javascript/basics.html
 * Geolocation documentation: http://dev.w3.org/geo/api/spec-source.html
 */
var googleMap = {
    verMapa: function(latitude, longitude, idcanvas) {
        $("#"+idcanvas).css("background-color","white");
        $("#"+idcanvas).html('<div class="loader"><div>');
        status = navigator.network.connection.type;

        if (navigator.network && status != "none") { 
            console.log("verMapa()");
            /*$(".ui-content").css({
                height: $(window).height(),
                width: $(window).width()
            });*/
            var defaultLatLng = new google.maps.LatLng(latitude, longitude);
            googleMap.drawMap(defaultLatLng, idcanvas);
            /*
            if (navigator.geolocation) {
                function success(pos) {
                    // Location found, show map with these coordinates
                    console.log("geolocation encontrada");
                    googleMap.drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude), idcanvas);
                }
                function fail(error) {
                    console.log("geolocation no encontrada");
                    googleMap.drawMap(defaultLatLng, idcanvas);  // Failed to find location, show default map
                }
                // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
                navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
            } 

            else {
                console.log("geolocation no soportada");
                googleMap.drawMap(defaultLatLng);  // No geolocation support, show default map
            }
            */
            window["_GOOG_TRANS_EXT_VER"] = "1";
        }
    },

    drawMap: function(latlng, idcanvas) {
        console.log("drawMap()");
        var myOptions = {
            zoom: 14,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById(idcanvas), myOptions);
        // Add an overlay to the map of current lat/lng
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Alero"
        });
    },

    mapEvent: function(latitude, longitude) {
        console.log("mapEvent()");
        /*$(".ui-content").css({
            height: $(window).height(),
            width: $(window).width()
        });*/
        var defaultLatLng = new google.maps.LatLng(latitude, longitude);
        if (navigator.geolocation) {
            function success(pos) {
                googleMap.drawMapEvent(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            }
            function fail(error) {
                googleMap.drawMapEvent(defaultLatLng);
            }

            navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
        } 

        else {
            googleMap.drawMap(defaultLatLng);
        }
        window["_GOOG_TRANS_EXT_VER"] = "1";
    },

    drawMapEvent: function(latlng) {
        console.log("drawMapEvent()");
        var myOptions = {
            zoom: 14,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-event-canvas"), myOptions);
        
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Mi evento"
        });

        google.maps.event.addListener(map, "mousedown", function(event) {
            var lat = event.latLng.lat();
            var lng = event.latLng.lng();
            $("#latitude-event").val(lat);
            $("#longitude-event").val(lng);
            alert(lat);
        });

        google.maps.event.addListener(marker, 'click', function() {
            map.setZoom(8);
            map.setCenter(marker.getPosition());
            alert("click");
        });

    },
    drawMapCrearEvento: function(lat, lang, idcanvas) {
          $("#"+idcanvas).css("background-color","white");
          $("#"+idcanvas).html('<div class="loader"><div>');
          var marker;
          status = navigator.network.connection.type;

          if (navigator.network && status != "none") {   
          if (navigator.geolocation) {
            function success(pos) {
                // Location found, show map with these coordinates
                console.log("geolocation encontrada");
                defaultLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                  var mapOptions = {
                    zoom: 12,
                    center: defaultLatLng
                  };

                  var map = new google.maps.Map(document.getElementById(idcanvas),
                      mapOptions);

                  google.maps.event.addListener(map, 'click', function(e) {
                    //jQuery("#latitude").val(e.latLng.lat());
                    //jQuery("#longitude").val(e.latLng.lng());
                    alert(e.latLng.lng());
                    placeMarker(e.latLng, map);
                  });
            }
            function fail(error) {
                 console.log("geolocation no encontrada");
                  var mapOptions = {
                    zoom: 12,
                    center: new google.maps.LatLng(lat,lang)
                  };

                  var map = new google.maps.Map(document.getElementById(idcanvas),
                      mapOptions);

                  google.maps.event.addListener(map, 'click', function(e) {
                    jQuery("#latitude-event").val(e.latLng.lat());
                    jQuery("#longitude-event").val(e.latLng.lng());
                    placeMarker(e.latLng, map);
                  });
            }
            // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
            navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
          }
        }
        
         
        function placeMarker(position, map) {
          try { deleteMarkers() } catch(err) { } 
          marker = new google.maps.Marker({
            position: position,
            map: map
          });
          map.panTo(position);
        }

        function deleteMarkers(){
        marker.setMap(null);
        }

        
    }
};