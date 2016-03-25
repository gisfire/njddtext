var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
                app.receivedEvent('deviceready');
    },
    
        // Update DOM on a Received Event
    receivedEvent: function (id) {

        //alert('Device Ready');

        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        camera.initialize();
        $("#deviceProperties").html('Device Name: ' + device.name + '<br />' +
                            'Device Cordova: ' + device.cordova + '<br />' +
                            'Device Platform: ' + device.platform + '<br />' +
                            'Device UUID: ' + device.uuid + '<br />' +
                            'Device Version: ' + device.version + '<br />');
        //alert('devicePlatform: ' + device.platform);
    }
};
