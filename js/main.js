/* Page is fully loaded, including all frames, objects and images */
$(window).on('load', function() {
    preloaderDelay();
});


/* Document is loaded and DOM is ready */
$(document).ready(function () {
    stickyNavbar();
    smoothScroll();
    mapClick();
    fixHover();
    scrollTopFunction();
    touchSwipe();
    sliderButtons();
    animeRandomTechIcon();
    currentYear();
    navLinkAndNavbarColorChanger();
});


/* Function to delay page load */
function preloaderDelay() {
    setTimeout( () => {
        $("#preloader").fadeOut("slow");
        $("body").css("overflow", "auto");
    }, 500);
}


/* Sticky Navigation Menu */
function stickyNavbar() {
    $("#mainNav").sticky( {topSpacing: 0, responsiveWidth: true} );
}


/* Function to close collapse menu */
function closeCollapseMenu() {
    let toggle = $('.navbar-toggler').is(':visible');
    if (toggle) {
        $('.navbar-collapse').collapse('hide');
    }
}


/* Smooth scrolling and closes collapse menu when a navbar link was clicked */
function smoothScroll() {
    $('a[href*="#"]:not([href="#carouselExampleIndicators"])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
            location.hostname == this.hostname) {

            let target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 900);
            }
        }
        closeCollapseMenu();
    });
}


/* Function to Fix ':hover' on touchscreen */
function fixHover() {
    let allFixHover = $('.fix-hover');

    $(allFixHover).on('touchstart', function () {
        $(this).trigger('hover');
    })
    
    $(allFixHover).on('touchend', function () {
        $(this).trigger('hover');
    });
}


/* Function to show/hide and handling Scrol-Top-Button */
function scrollTopFunction() {
    let scrollTopButton = $('#scrollTopButton');

    $(window).scroll(function() {
        if ($(window).scrollTop() > $(window).height() * 2) {
            $(scrollTopButton).fadeIn();
        } else {
            $(scrollTopButton).fadeOut();
        }
        closeCollapseMenu();
    });

    $(scrollTopButton).click(function() {
        $('html, body').animate({scrollTop: $('#about').offset().top}, 900, 'linear');
    });
}


/* Function for Touch Swipe in Carousel Bootstrap */
function touchSwipe() {
    let carousel = $('#main-header').find('.carousel');

    $(carousel).on('touchstart', function (event) {
        let xClick = event.originalEvent.touches[0].pageX;

        $(this).one('touchmove', function (event) {
            let xMove = event.originalEvent.touches[0].pageX;
            if (Math.floor(xClick - xMove) > 10) {
                $(this).carousel('next');
            } else if (Math.floor(xClick - xMove) < -10) {
                $(this).carousel('prev');
            }
        });

        $(carousel).on('touchend', function () {
            $(this).off('touchmove');
        });
    });
}


/* Keyboard event for slider buttons */
function sliderButtons() {
    let introSection = $('#main-header');

    $(window).keydown(function(event) {
        if (event.keyCode === 39 ) {
            $(introSection).find(".carousel-control-next").click();
        }
        if (event.keyCode === 37 ) {
            $(introSection).find(".carousel-control-prev").click();
        }
    });
}


/* Function to animate random icon from technologies section */
function animeRandomTechIcon() {
    let allTechIcons = $("#tech").find(".icon-box");

    setInterval( function() {

        let randomNumber = Math.floor(Math.random() * allTechIcons.length);
        let randomElement = allTechIcons[randomNumber];

        $(randomElement).addClass('animate');

        setTimeout( function() { 
            $(randomElement).removeClass('animate')
        }, 2000);

    }, 4500);
}


/* Function to insert the current year in footer section */
 function currentYear() {
    $("#main-footer").find(".year").text(new Date().getFullYear());
}


/* Function to change navbar color and  */
function navLinkAndNavbarColorChanger() {

    let navBar = $('#mainNav');
    let navLinkHome =  $(navBar).find('.nav-link[href="#main-header"]');
    let navLinkAbout = $(navBar).find('.nav-link[href="#about"]');
    let navLinkTechnologies = $(navBar).find('.nav-link[href="#tech"]');
    let navLinkPortfolio = $(navBar).find('.nav-link[href="#portfolio"]');
    let navLinkContact =  $(navBar).find('.nav-link[href="#contact"]');

    function detectSection(element, navbar) {
        let docViewTopPosition = $(window).scrollTop();
        let sectionTopPosition = $(element).position().top;
        
        let sectionHeight = $(element).outerHeight();
        let mainNavHeight = $(navbar).outerHeight();

        let detectTop = sectionTopPosition - mainNavHeight <= docViewTopPosition;
        let detectBottom = sectionTopPosition + sectionHeight - mainNavHeight >= docViewTopPosition;
        let sectionRange = detectTop && detectBottom;

        return sectionRange
    }

    $(window).on('scroll resize load', function() {

        let detectIntro = detectSection('#main-header', $(navBar));
        let detectAbout = detectSection('#about', $(navBar));
        let detectTechnologies = detectSection('#tech', $(navBar));
        let detectPortfolio = detectSection('#portfolio', $(navBar));
        let detectContact = detectSection('#contact', $(navBar));

        if (detectIntro){
            $(navLinkHome).addClass('active');
            $(navLinkAbout).removeClass('active');
        }
        else if (detectAbout) {
            $(navLinkHome).removeClass('active');
            $(navLinkAbout).addClass('active');
            $(navLinkTechnologies).removeClass('active');

            $(navBar).removeClass('tech');
            $(navBar).addClass('non-tech');
        }
        else if (detectTechnologies) {
            $(navLinkAbout).removeClass('active');
            $(navLinkTechnologies).addClass('active');
            $(navLinkPortfolio).removeClass('active');

            $(navBar).addClass('tech');
            $(navBar).removeClass('non-tech');
        }
        else if (detectPortfolio) {
            $(navLinkTechnologies).removeClass('active');
            $(navLinkPortfolio).addClass('active');
            $(navLinkContact).removeClass('active');

            $(navBar).removeClass('tech');
            $(navBar).addClass('non-tech');
        }
        else if (detectContact) {
            $(navLinkPortfolio).removeClass('active');
            $(navLinkContact).addClass('active');
        }
    });
}


/* Click to active google map */
function mapClick() {
    let mapContainer = $('#map-container > .container')
    
    $(mapContainer).click(function () {
        $(this).find('#googleMap').addClass('clicked')
    })
    
    $(mapContainer).mouseleave(function () {
        $(this).find('#googleMap').removeClass('clicked')
    });
}


/* Google Maps */
function initMap() {
    let mapProperties = {
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

    let map = new google.maps.Map(document.getElementById('googleMap'), mapProperties);

    let markerProperties = {
        position: {lat: 50.044465,lng: 19.949019},
        icon:'img/icons/google-maps-marker-1.png',
        map: map,
        animation: google.maps.Animation.DROP,
    };

    let marker = new google.maps.Marker(markerProperties);

    function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      };

    marker.addListener('click', toggleBounce);
};
