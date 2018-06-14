$(window).on("load", function() {
        preloader();
        
});

$(document).ready(function () {
        sticky();
        smoothScroll();
        initMap();
        mapClick();
        fixedOff();
        hover();
        topFunction();
        touchSwipe();
        sliderButtons();
});


/* Preloader function*/
function preloader() {
    var timeOut = setTimeout(function(){ 
        $("#preloader").fadeOut("slow");
        $("body").css("overflow", "auto")}, 1000 );
    clearTimeout(this.timeOut);
}


/* Sticky Navigation Menu */
function sticky() {
    $("#mainNav").sticky({
        topSpacing: 0
    });
}


/* Smooth Scrolling and Closes responsive menu when a scroll trigger link was clicked*/
function smoothScroll() {
    $('a[href*="#"]:not([href="#carouselExampleIndicators"])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 900, function () {

                });

                //Closes responsive menu when a scroll trigger link was clicked
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


/* Changing "background-attachement" form "fixed" to "scroll" on iPhone etc.*/
function fixedOff() {
    if (/iphone|ipod|ipad|blackberry/i.test(navigator.userAgent)) {
        console.log('apple');
        $('.carousel-item').css("background-attachment", "scroll");
    }
}


/* Fix :hover for touchscreen */
function hover() {
    $('*').on('touchstart', function () {
        $(this).trigger('hover');
    }).on('touchend', function () {
        $(this).trigger('blur');
    });
}


/* Function show/hide Scroll Button and Scrolling Top */
function topFunction(){
 
	$(window).scroll(function() {
		if ($(window).scrollTop() > $(window).height() * 2) {
			$('#scrollTopButton').addClass('show');
		} else {
			$('#scrollTopButton').removeClass('show');
		}
	});
    
    $('.buttonTop').click(function() {
		$('html, body').animate({scrollTop: $('#about').offset().top}, 900, 'linear');
	});
}


/* Function Touch Swipe in Carousel Bootstrap*/
function touchSwipe() {

    $(".carousel").on("touchstart", function (event) {
        var xClick = event.originalEvent.touches[0].pageX;
        $(this).one("touchmove", function (event) {
            var xMove = event.originalEvent.touches[0].pageX;
            if (Math.floor(xClick - xMove) > 10) {
                $(this).carousel('next');
            } else if (Math.floor(xClick - xMove) < -10) {
                $(this).carousel('prev');
            }
        });
        $(".carousel").on("touchend", function () {
            $(this).off("touchmove");
        });
    });
}


/* Keyboard event to slider buttons */
function sliderButtons(){
    
    let introSite = $('#main-header');
    $(window).keydown(function(event) {
        if (event.keyCode === 39 ) {
            introSite.find(".carousel-control-next").click();
        }
        if (event.keyCode === 37 ) {
            introSite.find(".carousel-control-prev").click();
        }
    });
}

