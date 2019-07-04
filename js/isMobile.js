const isMobile = {
    Android: function() {
        return (/Android/i).test(navigator.userAgent);
    },
    BlackBerry: function() {
        return (/BlackBerry|RIM|BB|PlayBook/i).test(navigator.userAgent);
    },
    iOS: function() {
        return (/iPhone|iPad|iPod/i).test(navigator.userAgent);
    },
    Opera: function() {
        return (/Opera Mini/i).test(navigator.userAgent);
    },
    Windows: function() {
        return (/IEMobile|WPDesktop|Nokia|Windows Phones/i).test(navigator.userAgent);
    },
    webOS: function() {
        return (/webOS/i).test(navigator.userAgent);
    },
    Kindle: function() {
        return (/Kindle|Silk|KFAPW|KFARWI|KFASWI|KFFOWI|KFJW|KFMEWI|KFOT|KFSAW|KFSOWI|KFTBW|KFTHW|KFTT|WFFOWI/i).test(navigator.userAgent);
    },
    any: function() {
        return (
            isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() ||
            isMobile.Opera() || isMobile.Windows() || isMobile.webOS() || isMobile.Kindle()
        );
    }
};
