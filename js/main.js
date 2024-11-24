'use strict';

/* Smooth scrolling settings */
const EASING = 'easeInOutCirc';
const DURATION = 1000;

/* Coordinates for Google Maps marker location */
const COORDINATES = { lat: 52.205637, lng: 21.022377 };

const PRELOADER_DELAY = 500;
const ERROR_TOLERANCE = 3;


/* HTML-Document is loaded and DOM is ready */
$(() =>  {
    stickyNavbar();
    scrollbarHandler();
    fixHoverOnMobile();
    touchSwipeHandler();
    closeCollapsibleMenu();
    scrollToTopButtonHandler();
    animeRandomTechIcon();
    sliderKeysHandler();
    navbarAndNavKeysHandler();
    currentYearUpdater();
    setRedirectAddress();
    clickToActivateMap();
});


/* Sticky Navigation Menu */
function stickyNavbar() {
    $('#mainNav').sticky({ topSpacing: 0, responsiveWidth: true });
}


/* Function to change the color of the scrollbar thumb on scroll event */
function scrollbarHandler() {
    const isChrome = !!window.chrome && (/Chrome/i).test(window.navigator.userAgent);

    if (isChrome) {
        let body = $('#body');
        let timeoutId;

        // Hack to force scrollbar re-rendering by temporarily hiding and showing it again
         const scrollbarRedraw = () => {
            body.css('overflow-y', 'hidden').width('100%');
            body.css('overflow-y', 'scroll');
        };

        const activateScrollBarThumb = () => {
            body.addClass('hover');             // Adds 'hover' class to body for scrollbar effect
            scrollbarRedraw();                  // Forces redraw of the scrollbar

            // Detecting the end of the scrolling event:
            // Clears timeout throughout the scrolling
            clearTimeout(timeoutId);

            // Setting a timeout to run after scrolling ends
            timeoutId = setTimeout( () => {
                body.removeClass('hover');      // Removes 'hover' class after scrolling ends
                scrollbarRedraw();              // Forces redraw of the scrollbar again
            }, 100);
        };

        $(document).on({
            'mousedown': event => {
                if(event.target === $('html')[0] && $(window).innerWidth() <= event.clientX) {
                    $(document).off('scroll', activateScrollBarThumb);
                }
            },
            'mouseup': () => {
                $(document).on('scroll', activateScrollBarThumb);
            },
            'scroll': activateScrollBarThumb
        });
    }
}


/* Function to fix the ':hover' effect on touchscreen devices */
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


/* Function to support touch swipe in Bootstrap Carousel */
function touchSwipeHandler() {
    const carousel = $('#main-header .carousel');

    carousel.on('touchstart', function (event) {
        const xClick = event.originalEvent.touches[0].pageX;

        $(this).on('touchmove', function (event) {
            const xMove = event.originalEvent.touches[0].pageX;

            if (Math.floor(xClick - xMove) > 10) {
                $(this)['carousel']('next');
            } else if (Math.floor(xClick - xMove) < -10) {
                $(this)['carousel']('prev');
            }
        });

        carousel.on('touchend', function () {
            $(this).off('touchmove');
        });
    });
}


/* Function to close the collapsible menu on scroll event */
function closeCollapsibleMenu() {
    const menuButton = $('#mainNav .navbar-toggler');

    $(document).on('scroll', () => {
        if (menuButton.attr('aria-expanded')) {
            $('.navbar-collapse').collapse('hide');
        }
    });
}


/* Function to show/hide and handle the Scroll-To-Top-Button */
function scrollToTopButtonHandler() {
    const scrollToTopButton = $('#scrollToTopButton');

    $(window).on('load scroll', showHideScrollToTopButton);

    function showHideScrollToTopButton() {
        if ($(window).scrollTop() > $(window).height() * 2) {
            scrollToTopButton.fadeIn();
        }
        else {
            scrollToTopButton.fadeOut();
        }
    }

    if (window.isMobileDevice()) {
        $('input[type="text"], input[type="email"], textarea').on({
            focusin: () => {
                scrollToTopButton.hide();
                $(document).off('scroll', showHideScrollToTopButton);
            },
            focusout: () => {
                showHideScrollToTopButton();
                $(document).on('scroll', showHideScrollToTopButton);
            }
        });
    }

    scrollToTopButton.on('click', () => {
        $('html, body').animate({ scrollTop: parseInt($('#about').offset().top) }, { duration: 1.5 * DURATION, easing: EASING });
    });
}


/* Keyboard event handler for slider buttons */
function sliderKeysHandler() {
    $(document).on('keydown', event => {
        if (event.key === 'ArrowRight') {
            $('#main-header .carousel-control-next').trigger('click');
        }

        if (event.key === 'ArrowLeft') {
            $('#main-header .carousel-control-prev').trigger('click');
        }
    });
}


/* Function to animate a random icon from the technologies section */
function animeRandomTechIcon() {
    let allTechIcons = $('#tech .icon-box');

    let index = 0;
    let indexArray = generateRandomIndex(allTechIcons);
    let intervalId = setInterval(animeIconByIndexArray, 4500);

    function animeIconByIndexArray() {
        const randomElement = allTechIcons[indexArray[index]];

        $(randomElement).addClass('animate');

        setTimeout( () => {
            $(randomElement).removeClass('animate');
        }, 2000);

        index++;

        if (index === allTechIcons.length) {
            clearInterval(intervalId);

            index = 0;
            indexArray = generateRandomIndex(allTechIcons);
            intervalId = setInterval(animeIconByIndexArray, 4500);
        }
    }

    // Generating random numbers without repetition
    function generateRandomIndex(array) {
        const tempArray = [];

        while (tempArray.length < array.length ) {
            let randomNumber = Math.floor(Math.random() * array.length);

            if (tempArray.indexOf(randomNumber) < 0) {
                tempArray.push(randomNumber);
            }
        }

        return tempArray;
    }
}


/* Function to navigate between sections using keyboard arrow keys and change the color of the navbar/active nav link */
function navbarAndNavKeysHandler() {
    const mainNavbar = $('#mainNav');
    const allMainSections = $('.main-section');
    const allNavbarLinks = $('#mainNav .nav-link');
    const techSectionHash = $(allMainSections[2]).attr('id');
    const allFormInputs = $('#contact form').children();
    const allNavigationLinks = $('a[href*="#"]:not([href="#carouselExampleIndicators"])');

    let windowHeight;                   // Height of the window
    let documentHeight;                 // Height of the entire document
    let mainNavbarHeight;               // Height of the main nav bar
    let scrollBarTopPosition;           // Top position of the scrollbar

    let sectionCoordinates = getSectionCoordinates(allMainSections);

    function getSectionCoordinates(array) {
        const coordinates = [];

        for (let i=0; i < array.length; i++) {
            coordinates.push(
                {
                    top: parseInt($(array[i]).offset().top),
                    bottom: parseInt($(array[i]).offset().top + $(array[i]).outerHeight(true)),
                    hash: $(array[i]).attr('id')
                }
            );
        }

        return coordinates;
    }

    function debounce(delay, callback) {
        let timeoutId;

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(function () {
                callback();
                timeoutId = null;
            }, delay);
        };
    }

    // Updating the window/document/navbar height and sections coordinates on window load and resize
    $(window).on('load resize', () => {
        windowHeight = parseInt($(window).outerHeight(true));
        documentHeight = parseInt($(document).outerHeight(true));
        mainNavbarHeight = parseInt($(mainNavbar).outerHeight(true));
        sectionCoordinates = getSectionCoordinates(allMainSections);
    });

    let activeElementIndex;

    // Changing the color of the navbar and the active nav link
    $(window).on('load scroll resize', function () {
        scrollBarTopPosition = parseInt($(window).scrollTop());

        for (let i=0; i < sectionCoordinates.length; i++) {
            const sectionTopPosition = activeElementIndex ? sectionCoordinates[i].top - mainNavbarHeight + ERROR_TOLERANCE : sectionCoordinates[i].top;
            const sectionBottomPosition = sectionCoordinates[i].bottom + ERROR_TOLERANCE;

            if (sectionTopPosition <= scrollBarTopPosition && sectionBottomPosition >= scrollBarTopPosition) {
                activeElementIndex = i;
                $(allNavbarLinks).not( $(allNavbarLinks[i]).addClass('active') ).removeClass('active');

                if (sectionCoordinates[i].hash === techSectionHash) {
                    $(mainNavbar).addClass('tech').removeClass('non-tech');
                } else {
                    $(mainNavbar).removeClass('tech').addClass('non-tech');
                }
            }
        }
    });

    let timeoutId = null;

    // Updating location.hash after the page scrolling stops
    $(window).on('scroll', () => {
        clearTimeout(timeoutId);

        timeoutId = setTimeout( () => {
            history.replaceState({}, '', `#${sectionCoordinates[activeElementIndex].hash}`);
        }, 50);
    });

    let isPress = false;
    let isScrolling = false;

    // Smooth scrolling - animates scrolling to anchor links
    allNavigationLinks.on('click', function () {
        if (isScrolling || ($(this).hasClass('active') && scrollBarTopPosition - sectionCoordinates[activeElementIndex].top < ERROR_TOLERANCE)) {
            return;
        }

        if (location.hostname === this.hostname && location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '')) {
            let target = $(this.hash);
                target = target.length ? target : $('[id=' + this.hash.slice(1) + ']');

            if (target.length) {
                let scrollTop = Math.round(this.hash === '#about' ? target.offset().top + 1 : target.offset().top);

                $('html, body').animate({ scrollTop: scrollTop }, { duration: DURATION, easing: EASING });

                isScrolling = true;
            }
        }
    });

    // Prevents scrolling when the top/down arrow key is still pressed down
    $(document).on('keydown', event => {
        if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && !allFormInputs.is(':focus')) {
            event.preventDefault();
        }
    });

    // Handling navigation between sections using the keyboard up/down arrow keys
    $(document).on('keydown', event => {
        if (!isPress && !isScrolling && !allFormInputs.is(':focus')) {
            switch(event.key) {
            case 'ArrowUp':
                // Scrolling to the top of the active/current section
                if (scrollBarTopPosition - sectionCoordinates[activeElementIndex].top > ERROR_TOLERANCE ) {
                    allNavbarLinks[activeElementIndex].click();
                    isPress = true;
                }
                // Scrolling to the previous section
                else if (activeElementIndex > 0) {
                    allNavbarLinks[activeElementIndex - 1].click();
                    isPress = true;
                }
                break;
            case 'ArrowDown':
                // Only if the window is not fully scrolled to the bottom
                if (documentHeight - (scrollBarTopPosition + windowHeight) >= ERROR_TOLERANCE) {
                    // Scrolling to the next section
                    if (activeElementIndex < allNavbarLinks.length - 1) {
                        allNavbarLinks[activeElementIndex + 1].click();
                        isPress = true;
                    }
                    // Scrolling to the end of the last section
                    else if (activeElementIndex === allNavbarLinks.length - 1) {
                        $('html, body').animate({ scrollTop: documentHeight }, { duration: DURATION * 1.5, easing: EASING });
                        isScrolling = true;
                        isPress = true;
                    }
                }
                break;
            }
        }
    });

    $(document).on('keyup', () => isPress = false);
    $(window).on('scroll', debounce(200, () => isScrolling = false));
}


/* Function to insert the current year in the footer section */
function currentYearUpdater() {
    $('#main-footer .year').text(new Date().getFullYear());
}


/* Function to set the redirect address for formspree.io service */
function setRedirectAddress() {
    $('#contact').find('form').find('input[name="_next"]').val(window.location.href);
}


/* Click to activate the Google Map */
function clickToActivateMap() {
    const mapContainer = $('#contact > .map-container');

    mapContainer.on('click', function () {
        $(this).find('#googleMap').addClass('clicked');
        $(this).find('.click-to-activate-info').hide();
    });

    mapContainer.on('mouseleave', function () {
        $(this).find('#googleMap').removeClass('clicked');
        $(this).find('.click-to-activate-info').show();
    });
}


/* Function to initialize and handle the Google Map */
async function initMap() {
    const customMapStyles = [
        {
            "featureType": "all",
            "elementType": "all",
            "stylers": [
                {
                    "invert_lightness": true
                },
                {
                    "saturation": "-10"
                },
                {
                    "lightness": "10"
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
                    "weight": ".00"
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
    ];

    const mapProperties = {
        center: COORDINATES,
        mapId: 'FAKE_MAP_IDENTIFIER',
        zoom:15,
        maxZoom:16,
        minZoom:13,
        disableDefaultUI: true,
        scrollwheel: false,
        zoomControl: true
    };

    const pinProperties = {
        scale: 1.25,
        glyphColor: '#171710',
        background: '#F10404',
        borderColor: '#171710'
    };

    const { Map, StyledMapType } = await google.maps.importLibrary("maps");
    const { PinElement, AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const map = new Map($('#googleMap')[0], mapProperties);
    const pin = new PinElement(pinProperties);

    // Creating a custom map type with a defined styles
    const styledMapType = new StyledMapType(customMapStyles);

    // Adding the custom styled map to available map types
    map.mapTypes.set('custom_styled_map', styledMapType);

    // Applying the custom styled map as the default map type
    map.setMapTypeId('custom_styled_map');

    const markerProperties = {
        position: COORDINATES,
        content: pin.element,
        map: map
    };

    const marker = new AdvancedMarkerElement(markerProperties);
    const markerContent = $(marker.content);

    markerContent.addClass('bounce');

    markerContent.on('click', function () {
        if ($(this).hasClass('bounce')) {
            $(this).removeClass('bounce');
        } else {
            $(this).addClass('bounce');
        }
    });

    markerContent.on('mouseenter', function () {
        $(this).addClass('pointer');
    }).on('mouseleave', function () {
        $(this).removeClass('pointer');
    });
}


/* Function to delay the page loading */
function preloaderDelay() {
    setTimeout( () => {
        $('#preloader').fadeOut('slow');
        $('#body').css('overflow-y', 'scroll');
    }, PRELOADER_DELAY);
}


/* Page is fully loaded, including all frames, objects and images */
$(window).on('load', preloaderDelay);
