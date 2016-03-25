var audio = {
    
    recordAudio: function (src,maxSeconds) {
        
        this.message("Recording audio to " + audio.getPlatformSpecificSrcName(src));

        var mediaRec = new Media(audio.getPlatformSpecificSrcName(src), this.onRecordSuccess, this.onError);
        var recTime = 0;
        var ms = this.maxSeconds;
        // Record audio
        mediaRec.startRecord();
        // Stop recording after 10 sec
        var recInterval = setInterval(function () {
            recTime++;
            $("#audio_position").text(recTime.toString() + "sec");
            if (recTime >= maxSeconds) {
                clearInterval(recInterval);
                mediaRec.stopRecord();
            }
        }, 1000);
    },

    getPlatformSpecificSrcName: function (src) {
        /*android
        blackberry
        ios
        symbian
        webos
        wp7
        wp8*/
        var msg;
        
        switch (device.platform)
        {
            case "Android":
                return src + ".amr";
                break;
            case "iOS":
                return "documents://" + src + ".wav";
                break;
            default:
                msg = "ERROR: " + device.platform + " is not recognized in audio.getPlatformSpecificSrcName";
                this.message(msg);
                return msg;
                break;
        }
    },
    // onSuccess Callbacka
    //
    onRecordSuccess: function () {
        audio.message("Recording Stopped");
    },

    // onError Callback
    //
    onError: function (error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    },

    my_media: null,
    mediaTimer:null,

    // Play audio
    //
    playAudio:function(src) {

        this.message("Playing " + audio.getPlatformSpecificSrcName(src));

        // Create Media object from src
        this.my_media = new Media(audio.getPlatformSpecificSrcName(src), this.onPlaySuccess, this.onError);

        // Play audio
        this.my_media.play();

        // Update my_media position every second
        if (this.mediaTimer == null) {
            this.mediaTimer = setInterval(function() {
                // get my_media position
                my_media.getCurrentPosition(
                    // success callback
                    function(position) {
                        if (position > -1) {
                            $("#audio_position").text(position + " sec");
                        }
                    },
                    // error callback
                    function(e) {
                        this.message("Error getting pos=" + e);
                        $("#audio_position").text("Error: " + e);
                    }
                );
            }, 1000);
        }
    },

    // Pause audio
    //
    pauseAudio:function () {
        if (this.my_media) {
            this.my_media.pause();
            this.message("Paused..");
        }
    },

    // Stop audio
    //
    stopAudio:function () {
        if (this.my_media) {
            this.my_media.stop();
            this.message("Stopped.");
        }
        clearInterval(mediaTimer);
        this.mediaTimer = null;
    },

    // onSuccess Callback
    //
    onPlaySuccess:function () {
        this.message("Finished Playing Successfully");
    },

    message: function (msg) {
        alert(msg);
        $("#message").text(msg);
    }
    
};

