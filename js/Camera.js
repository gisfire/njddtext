var camera = {
  
    pictureSource: new Object(),

    destinationType: new Object(),

    // Application Constructor
    initialize: function () {

        //alert('Camera Initialized');

        this.pictureSource = navigator.camera.PictureSourceType;

        this.destinationType = navigator.camera.DestinationType;
        
    },

    // Called when a photo is successfully retrieved
    //
    onPhotoDataSuccess: function (imageData) {

        // Uncomment to view the base64-encoded image data
        //alert(imageData);

        // Get image handle
        //
        var smallImage = document.getElementById('smallImage');

        // Unhide image elements
        //
        smallImage.style.display = 'block';

        // Show the captured photo
        // The in-line CSS rules are used to resize the image
        //
        smallImage.src = "data:image/jpeg;base64," + imageData;
    },

    // Called when a photo is successfully retrieved
    //
    onPhotoURISuccess:function (imageURI) {
        // Uncomment to view the image file URI
        //alert(imageURI);

        // Get image handle
        //
        var largeImage = document.getElementById('largeImage');

        // Unhide image elements
        //
        largeImage.style.display = 'block';

        // Show the captured photo
        // The in-line CSS rules are used to resize the image
        //
        largeImage.src = imageURI;
    },

    // A button will call this function
    //
    capturePhoto: function () {

        //alert('capture photo');

        // Take picture using device camera and retrieve image as base64-encoded string
        navigator.camera.getPicture(this.onPhotoDataSuccess, this.onFail, { quality: 50,
            destinationType: this.destinationType.DATA_URL });
    },

    // A button will call this function
    //
    capturePhotoEdit:function() {
        // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
        navigator.camera.getPicture(this.onPhotoDataSuccess, this.onFail, { quality: 20, allowEdit: true,
            destinationType: this.destinationType.DATA_URL });
    },

    // A button will call this function
    //
    getPhoto:function(source) {
        // Retrieve image file location from specified source
        navigator.camera.getPicture(this.onPhotoURISuccess, this.onFail, { quality: 50,
            destinationType: this.destinationType.FILE_URI,
            sourceType: source });
    },

    // Called if something bad happens.
    //
    onFail: function(message) {
        //alert('Failed because: ' + message);
    }
};

