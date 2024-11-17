'use strict';

const screenSizeDetection = window.matchMedia("(max-width: 767px)").matches;

const userAgent = navigator.userAgent || navigator.vendor || window.opera;

const userAgentDetection = {
    Android: () => (/Android/i).test(userAgent),
    BlackBerry: () => (/BlackBerry|RIM|BB|PlayBook/i).test(userAgent),
    iOS: () => (/iPhone|iPad|iPod/i).test(userAgent),
    Opera: () => (/Opera Mini/i).test(userAgent),
    Windows: () => (/IEMobile|WPDesktop|Nokia|Windows Phones/i).test(userAgent),
    webOS: () => (/webOS/i).test(userAgent),
    Kindle: () => (/Kindle|Silk|KFAPW|KFARWI|KFASWI|KFFOWI|KFJW|KFMEWI|KFOT|KFSAW|KFSOWI|KFTBW|KFTHW|KFTT|WFFOWI/i).test(userAgent),

    any: function() {
        return this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows() || this.webOS() || this.Kindle();
    }
};


window.isMobileDevice = () => userAgentDetection.any() || screenSizeDetection;
