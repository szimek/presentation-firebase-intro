(function () {
    BROADCAST_MODE_PARAM = 'broadcast';
    FOLLOW_MODE_PARAM = 'follow';
    PRESENTATION_NAME_PARAM = 'firebase-intro';

    var params = window.location.search.substring(1).split('&').map(function (el) {
        return el.split('=');
    }), ref, auth;

    for (var i = 0, param; param = params[i]; ++i) {
        if (param[0].toLowerCase() == BROADCAST_MODE_PARAM) {
            ref = new Firebase('https://presentations.firebaseio.com');

            auth = new FirebaseSimpleLogin(ref, function(error, user) {
                if (error) {
                    console.log('Firebase: Authentication error. ', error);
                } else if (user) {
                    console.log('Firebase: Logged in as', user.name);
                } else {
                    console.log('Firebase: Logged out. Logging in...');
                    auth.login('github', {
                        rememberMe: true
                    });
                }
            });

            document.addEventListener('slideenter', function (event) {
                ref.child('firebase-intro').set(event.slideNumber, function (error) {
                    if (error) console.log('Firebase: ', error);
                });
            });
        } else if (param[0].toLowerCase() == FOLLOW_MODE_PARAM) {
            ref = new Firebase('https://presentations.firebaseio.com');
            ref.child('firebase-intro').on('value', function (snapshot) {
                var slideNumber = snapshot.val();
                window.slidedeck.loadSlide(slideNumber);
            });
        }
    }
})();
