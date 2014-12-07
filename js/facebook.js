(function(w) {
    w.fbAsyncInit = function() {
        FB.init({
            appId: '1512036642388764',
            xfbml: true,
            version: 'v2.2'
        });

        FB.login(function() {
            FB.api('/me/events?since=0&limit=5000', {}, function(response) {
                if (response.data.length > 0) {
                    layOutTimeline(response.data, 0.3);
                } else {
                    alert('Sorry, you either have no events on facebook, or there\'s something wrong with the permissions');
                }
            });
        }, {
            scope: 'user_events'
        });
    }
}(window));
