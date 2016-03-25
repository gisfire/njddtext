var compass = {

    // The watch id references the current `watchHeading`
    watchID: new Object(),
       
    // Start watching the compass
    //
    startWatch: function() {
        // Update compass every 3 seconds
        var options = { frequency: 3000 };
        watchID = navigator.compass.watchHeading(this.onSuccess, this.onError, options);
    },

    // Stop watching the compass
    //
    stopWatch:function() {
        if (watchID) {
            navigator.compass.clearWatch(watchID);
            watchID = null;
        }
    },

    // onSuccess: Get the current heading
    //
    onSuccess: function(heading) {
        var element = document.getElementById('heading');
        element.innerHTML = 'Heading: ' + heading.magneticHeading;
    },

    // onError: Failed to get the heading
    //
    onError:function(compassError) {
        //alert('Compass error: ' + compassError.code);
    }

};

