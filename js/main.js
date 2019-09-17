/* Page is fully loaded, including all frames, objects and images */
$(window).on('load', function() {
    preloaderDelay();
});


/* HTML-Document is loaded and DOM is ready */
$(document).ready(function () {
    stickyNavbar();
    scrollbarHandler();
    fixHoverOnMobile();
    touchSwipeHandler();
    closeCollapsibleMenu();
    scrollTopButtonHandler();
    animeRandomTechIcon();
    sliderKeysHandler();
    navbarAndNavkeysHandler();
    currentYearUpdater();
    clickToActivateMap();
});


/* Function to delay page load */
function preloaderDelay() {
    setTimeout(function() {
        $('#preloader').fadeOut('slow');
        $('#body').css('overflow-y', 'scroll');
    }, 500);
}


/* Sticky Navigation Menu */
function stickyNavbar() {
    $('#mainNav').sticky( {topSpacing: 0, responsiveWidth: true} );
}


/* Function to change color of scrollbar thumb on scroll event */
function scrollbarHandler() {
    let isChrome = !!window.chrome && !!window.chrome.runtime && (/Chrome/i).test(window.navigator.userAgent);

    if (isChrome) {
        let body = $('#body');
        let timeoutId;

        $(document).on('scroll', activateScrollBarThumb);

        function activateScrollBarThumb() {
            body.addClass('hover');
            scrollbarRedraw();

            // Detecting end of scrolling event:
            // Clears timeout throughout the scroll
            clearTimeout(timeoutId);

            // Sets a timeout to run after scrolling ends
            timeoutId = setTimeout(function() {
                body.removeClass('hover');
                scrollbarRedraw();
            }, 100);
        }

        // Hack to force scrollbar redraw
        function scrollbarRedraw() {
            body.css('overflow-y', 'hidden').width('100%');
            body.css('overflow-y', 'scroll');
        }

        // Click event on scrollbar
        $(document).on({
            'mousedown': function(event) {
                if(event.target === $('html')[0] && $(window).innerWidth() <= event.clientX) {
                    $(document).off('scroll', activateScrollBarThumb);
                }
            },
            'mouseup': function() {
                $(document).on('scroll', activateScrollBarThumb);
            }
        });
    }
}


/* Function to Fix ':hover' on touchscreen */
function fixHoverOnMobile() {
    $('.fix-hover').on({
        'touchstart': function () {
            $(this).trigger('hover');
        },
        'touchend': function () {
            $(this).trigger('hover');
        }
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
        }
        else {
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
        $('html, body').animate({scrollTop: parseInt($('#about').offset().top)}, 900, 'linear');
    });
}


/* Keyboard event for slider buttons */
function sliderKeysHandler() {
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

            if (tempArray.indexOf(randomNumber) === -1) {
                tempArray.push(randomNumber);
            }
        }
        return tempArray;
    }
}


/* Function to navigation between section with keyboard arrows keys and change color of navbar/'active nav link' */
function navbarAndNavkeysHandler() {
    let mainNavbar = $('#mainNav');
    let allMainSections = $('.main-section');
    let allNavbarLinks = $(mainNavbar).find('.nav-link');
    let techSectionHash = $(allMainSections[2]).attr('id');
    let allNavigationLinks = $('a[href*="#"]:not([href="#carouselExampleIndicators"])');

    let windowHeight = parseInt($(window).innerHeight());                 // Returns the height of the window
    let documentHeight = parseInt($(document).innerHeight());             // Returns the height of the entire document
    let mainNavbarHeight = parseInt($(mainNavbar).outerHeight(true));     // Returns the height of the main nav bar
    let scrollBarTopPosition = parseInt($(window).scrollTop());           // Returns the top position of the scrollbar

    let activeElementIndex;
    let sectionCoordinates = getSectionCoordinates(allMainSections);

    function getSectionCoordinates(array) {
        let coordinates = [];
        for (let i=0; i < array.length; i++) {
            coordinates.push(
                {
                    top: parseInt($(array[i]).offset().top) ,
                    bottom: parseInt($(array[i]).offset().top + $(array[i]).outerHeight()),
                    hash: $(array[i]).attr('id')
                }
            )
        }
        return coordinates;
    }

    function debounce(delay, callback) {
        let timeoutId;
        return function () {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout( function() {
                callback();
                timeoutId = null;
            }, delay);
        }
    }

    // Updates the window/document/navbar height and sections coordinates on window load and resize
    $(window).on('load resize', function() {
        windowHeight = parseInt($(window).innerHeight());
        documentHeight = parseInt($(document).innerHeight());
        mainNavbarHeight = parseInt($(mainNavbar).outerHeight(true));
        sectionCoordinates = getSectionCoordinates(allMainSections);
    });

    // Changes color of navbar and active nav link
    $(window).on('load scroll resize', function() {
        scrollBarTopPosition = parseInt($(window).scrollTop());

        for (let i=0; i < sectionCoordinates.length; i++) {
            let sectionTopPosition = sectionCoordinates[i].top - mainNavbarHeight;
            let sectionBottomPosition = sectionCoordinates[i].bottom - mainNavbarHeight;

            if (sectionTopPosition <= scrollBarTopPosition && sectionBottomPosition >= scrollBarTopPosition) {
                activeElementIndex = i;
                $(allNavbarLinks).not( $(allNavbarLinks[i]).addClass('active') ).removeClass('active');

                if (sectionCoordinates[i].hash === techSectionHash) {
                    $(mainNavbar).addClass('tech').removeClass('non-tech');
                    return false;
                }
                else {
                    $(mainNavbar).removeClass('tech').addClass('non-tech');
                    return false;
                }
            }
        }
    });

    let isPress = false;
    let isScrolling = false;

    // Smooth scrolling - animate scrolling to anchor links
    $(allNavigationLinks).on('click', function() {
        if (isScrolling || ($(this).hasClass('active') && parseInt($(this.hash).offset().top) === scrollBarTopPosition)) {
            return false;
        }

        if (location.hostname === this.hostname && location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '')) {
            let target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

            if (target.length) {
                $('html, body').animate({ scrollTop: target.offset().top }, 1000);
                isScrolling = true
                return false;
            }
        }
    });

    // Prevents scrolling when the top/down arrow key is still pressed down
    $(document).on('keydown', function(event) {
        if (event.keyCode === 38 || event.keyCode === 40) {
            event.preventDefault();
        }
    });

    // Handling navigation between sections with keyboard up/down arrow keys
    $(document).on('keydown', function(event) {
        if (!isPress && !isScrolling) {
            switch(event.keyCode) {
            case 38:
                if (sectionCoordinates[activeElementIndex].top < scrollBarTopPosition) {
                    isScrolling = true;
                    isPress = true;
                    $('html, body').animate({scrollTop: sectionCoordinates[activeElementIndex].top}, 750, 'linear');
                }
                else if (activeElementIndex > 0) {
                    isScrolling = true;
                    isPress = true;
                    $('html, body').animate({scrollTop: sectionCoordinates[activeElementIndex - 1].top}, 1000, 'linear');
                }
                break;
            case 40:
                if (activeElementIndex < allNavbarLinks.length -1) {
                    isScrolling = true;
                    isPress = true;
                    $('html, body').animate({scrollTop: sectionCoordinates[activeElementIndex + 1].top}, 1000, 'linear');
                }
                if (activeElementIndex === allNavbarLinks.length - 1 && scrollBarTopPosition + windowHeight < documentHeight) {
                    isScrolling = true;
                    isPress = true;
                    $('html, body').animate({scrollTop: documentHeight}, 1250, 'linear');
                }
                break;
            }
        }
    });

    $(document).on('keyup', function() { isPress = false });
    $(window).on('scroll', debounce(100, function() { isScrolling = false }));
}


/* Function to insert the current year in footer section */
function currentYearUpdater() {
    $('#main-footer').find('.year').text(new Date().getFullYear());
}


/* Click to activate google map */
function clickToActivateMap() {
    let mapContainer = $('#map-container > .container');

    $(mapContainer).click(function() {
        $(this).find('#googleMap').addClass('clicked')
    });

    $(mapContainer).mouseleave(function() {
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