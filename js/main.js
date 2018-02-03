$(document).ready(function () {
    sticky();
    smoothScroll();
    initMap();
    mapClick();
});


/* Sticky Navigation Menu */
function sticky() {
    $("#mainNav").sticky({
        topSpacing: 0
    });
}


/* Smooth Scrolling and Closes responsive menu when a scroll trigger link is clicked*/
function smoothScroll() {
    $('a[href*="#"]:not([href="#carouselExampleIndicators"])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 700, function () {

                });

                //Closes responsive menu when a scroll trigger link is clicked
                var toggle = $(".navbar-toggler").is(":visible");
                if (toggle) {
                    $(".navbar-collapse").collapse('hide');
                }
                return false;
            }
        }
    });
}

/* Google Maps */
function initMap() {
    
    var mapProperties = {
        center: {lat: 50.044465,lng: 19.949019}, 
        zoom:15,
        maxZoom:16,
        minZoom:14,
        disableDefaultUI: true,
        zoomControl: true,
        scrollwheel: false,
        styles: [
                {
                    "featureType": "all",
                    "elementType": "all",
                    "stylers": [
                        {
                            "invert_lightness": true
                        },
                        {
                            "saturation": "-9"
                        },
                        {
                            "lightness": "0"
                        },
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "landscape.man_made",
                    "elementType": "all",
                    "stylers": [
                        {
                            "weight": "1.00"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [
                        {
                            "weight": "0.49"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "weight": "0.01"
                        },
                        {
                            "lightness": "-7"
                        },
                        {
                            "saturation": "-35"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                }
                ]  
    };
        
    var map = new google.maps.Map(document.getElementById('googleMap'), mapProperties);
        
   
    var markerProperties = {
        position: {lat: 50.044465,lng: 19.949019},
        icon:'img/icons/google-maps-marker-1.png',
        map: map,
        animation: google.maps.Animation.DROP,
    };
        
    var marker = new google.maps.Marker(markerProperties);
        
    
    function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      };
    
    marker.addListener('click', toggleBounce);
    
};


/* Click to active map */
function mapClick(){
    $('#map-container')
    .click(function () {
        $(this).find('#googleMap').addClass('clicked')
    })
    .mouseleave(function () {
        $(this).find('#googleMap').removeClass('clicked')
    });
}




