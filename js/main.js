/* Page is fully loaded, including all frames, objects and images */
$(window).on('load', function() {
    setTimeout(function() {
        preloaderDelay();
    }, 500);
});


/* HTML-Document is loaded and DOM is ready */
$(document).ready(function () {
    stickyNavbar();
    smoothScroll();
    scrollBarHandler();
    fixHoverOnMobile();
    touchSwipeHandler();
    closeCollapsibleMenu();
    scrollTopButtonHandler();
    sliderButtonsHandler();
    animeRandomTechIcon();
    navBarHandler();
    currentYear();
    mapClick();
});


/* Function to delay page load */
function preloaderDelay() {
    $('#preloader').fadeOut('slow');
    $('#body').css('overflow-y', 'scroll');
}


/* Sticky Navigation Menu */
function stickyNavbar() {
    $('#mainNav').sticky( {topSpacing: 0, responsiveWidth: true} );
}


/* Smooth scrolling */
function smoothScroll() {
    $('a[href*="#"]:not([href="#carouselExampleIndicators"])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {

            let target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

            if (target.length) {
                $('html, body').animate({ scrollTop: target.offset().top }, 1000);
            }
        }
    });
}


/* Function to change color of scrollbar thumb on scroll event */
function scrollBarHandler() {
    let isChrome = !!window.chrome && !!window.chrome.runtime && (/Chrome/i).test(window.navigator.userAgent);

    if (isChrome) {
        let body = $('#body');
        let isScrolling;

        $(document).on('scroll', activateScrollBarThumb);

        function activateScrollBarThumb() {
            body.addClass('hover');
            scrollBarReDraw();

            // Detecting end of scrolling event:
            // Clears timeout throughout the scroll
            clearTimeout(isScrolling);

            // Sets a timeout to run after scrolling ends
            isScrolling = setTimeout(function() {
                body.removeClass('hover');
                scrollBarReDraw();
            }, 100);
        };

        // Hack to force scrollbar redraw
        function scrollBarReDraw() {
            body.css('overflow-y', 'hidden').width('100%');
            body.css('overflow-y', 'scroll');
        }

        // Click event on scrollbar
        $(document).on({
            mousedown: function(event) {
                if(event.target === $('html')[0] && $(window).innerWidth() <= event.clientX) {
                    $(document).off('scroll', activateScrollBarThumb);
                }
            },
            mouseup: function(event) {
                $(document).on('scroll', activateScrollBarThumb);
            },
        });
    }
}


/* Function to Fix ':hover' on touchscreen */
function fixHoverOnMobile() {
    let allFixHover = $('.fix-hover');

    $(allFixHover).on('touchstart', function () {
        $(this).trigger('hover');
    });
    
    $(allFixHover).on('touchend', function () {
        $(this).trigger('hover');
    });
}


/* Function for Touch Swipe in Carousel Bootstrap */
function touchSwipeHandler() {
    let carousel = $('#main-header').find('.carousel');

    $(carousel).on('touchstart', function (event) {
        let xClick = event.originalEvent.touches[0].pageX;

        $(this).on('touchmove', function (event) {
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


/* Function to close collapsible menu on scroll event */
function closeCollapsibleMenu() {
    let menuButton = $('#mainNav').find('.navbar-toggler');

    $(document).on('scroll', function() {
        if ($(menuButton).attr('aria-expanded')) {
            $('.navbar-collapse').collapse('hide');
        }
    });
}


/* Function to show/hide and handling Scrol-Top-Button */
function scrollTopButtonHandler() {
    let scrollTopButton = $('#scrollTopButton');

    $(document).on('scroll', showHideScrollTopButton);

    function showHideScrollTopButton() {
        if ($(window).scrollTop() > $(window).height() * 2) {
            $(scrollTopButton).fadeIn();
        } else {
            $(scrollTopButton).fadeOut();
        }
    }

    if (isMobile.any()) {
        $('input[type="text"], input[type="email"], textarea').on({
            focusin: function() {
                $(scrollTopButton).hide();
                $(document).off('scroll', showHideScrollTopButton);
            },
            focusout: function() {
                $(scrollTopButton).fadeIn();
                $(document).on('scroll', showHideScrollTopButton);
            }
        });
    }

    $(scrollTopButton).on('click', function() {
        $('html, body').animate({scrollTop: $('#about').offset().top}, 900, 'linear');
    });
}


/* Keyboard event for slider buttons */
function sliderButtonsHandler() {
    let introSection = $('#main-header');

    $(document).keydown(function(event) {
        if (event.keyCode === 39) {
            $(introSection).find('.carousel-control-next').click();
        }
        if (event.keyCode === 37) {
            $(introSection).find('.carousel-control-prev').click();
        }
    });
}


/* Function to animate random icon from technologies section */
function animeRandomTechIcon() {
    let allTechIcons = $('#tech').find('.icon-box');

    let index = 0;
    let indexArray = generateRandomIndex(allTechIcons);
    let intervalId = setInterval(animeIconByIndexArray, 4500);

    function animeIconByIndexArray() {
        let randomElement = allTechIcons[indexArray[index]];

        $(randomElement).addClass('animate');

        setTimeout(function() {
            $(randomElement).removeClass('animate')
        }, 2000);

        index++;

        if (index === allTechIcons.length) {
            clearInterval(intervalId);
            index = 0;
            indexArray = generateRandomIndex(allTechIcons);
            intervalId = setInterval(animeIconByIndexArray, 4500);
        }
    }

    // Generates random numbers without repetition
    function generateRandomIndex(array) {
        let tempArray = [];

        while (tempArray.length < array.length ) {
            let randomNumber = Math.floor(Math.random() * allTechIcons.length);

            if (tempArray.indexOf(randomNumber) == -1) {
                tempArray.push(randomNumber);
            }
        }
        return tempArray;
    }
}


/* Function to handling scroll with keyboard keys and change color of navbar/active nav link */
function navBarHandler() {
    let mainNavBar = $('#mainNav');
    let allSectionArray = $('.main-section');
    let allNavLinkArray = $(mainNavBar).find('.nav-link');

    let technology = $(allSectionArray[2]).attr('id');
    
    let windowHeight = $(window).innerHeight();             // Returns the height of the window
    let documentHeight = $(document).innerHeight();         // Returns the height of the entire document
    let scrollBarTopPosition = $(window).scrollTop();       // Returns the top position of the scrollbar

    let activeNavLinkIndex;
    let sectionCoordinates = getSectionCoordinates(allSectionArray, mainNavBar);

    function getSectionCoordinates(array, element) {
        let coordinates = [];
        for (let i=0; i < array.length; i++) {
            coordinates.push(
                {
                    top: $(array[i]).offset().top - $(element).outerHeight(true),
                    bottom: $(array[i]).offset().top + $(array[i]).outerHeight() - $(element).outerHeight(true),
                    hash: $(array[i]).attr('id')
                }
            )
        }
        return coordinates;
    }

    function findActiveNavLink(array) {
        for (let i=0; i < array.length; i++) {
            if ($(array[i]).hasClass('active')) {
                return i;
            }
        }
    }

    // Updates the window height and section coordinates on window resize
    $(window).on('resize', function() {
        windowHeight = $(window).innerHeight();
        sectionCoordinates = getSectionCoordinates(allSectionArray, mainNavBar);
    });

    // Changes color of navbar and active nav link
    $(window).on('load scroll resize', function() {
        scrollBarTopPosition = $(window).scrollTop();

        for (let i=0; i < sectionCoordinates.length; i++) {

            let sectionTopPosition = sectionCoordinates[i].top;
            let sectionBottomPosition = sectionCoordinates[i].bottom;

            if (sectionTopPosition <= scrollBarTopPosition && sectionBottomPosition >= scrollBarTopPosition) {
                $(allNavLinkArray).not( $(allNavLinkArray[i]).addClass('active') ).removeClass('active');

                if (sectionCoordinates[i].hash == technology) {
                    $(mainNavBar).addClass('tech').removeClass('non-tech');
                    return false;
                } 
                else {
                    $(mainNavBar).removeClass('tech').addClass('non-tech');
                    return false;
                }
            }
        }
    });

    // Handling scroll with keyboard up/down arrow keys
    $(window).on('load scroll keydown', function(event) {
        activeNavLinkIndex = findActiveNavLink(allNavLinkArray);

        if (event.keyCode === 38) {
            if (activeNavLinkIndex != 0) {
                $(allNavLinkArray[activeNavLinkIndex - 1]).click();
            }
            if (activeNavLinkIndex == 0 && scrollBarTopPosition > 0) {
                $('html, body').animate({scrollTop: 0}, 900, 'linear');
            }
        }

        if (event.keyCode === 40) {
            if (activeNavLinkIndex + 1 < allNavLinkArray.length) {
                $(allNavLinkArray[activeNavLinkIndex + 1]).click();
            }
            if (activeNavLinkIndex == allNavLinkArray.length - 1 && scrollBarTopPosition + windowHeight < documentHeight) {
                $('html, body').animate({scrollTop: documentHeight}, 1500, 'linear');
            }
        }
    });
}


/* Function to insert the current year in footer section */
function currentYear() {
    $('#main-footer').find('.year').text(new Date().getFullYear());
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
        center: {lat: 50.044465, lng: 19.949019},
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
        icon: 'img/icons/google-maps-marker-1.png',
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
    }

    marker.addListener('click', toggleBounce);
}