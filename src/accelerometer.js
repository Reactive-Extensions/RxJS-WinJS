    var accelerometer = Windows.Devices.Sensors.Accelerometer.getDefault();

    Rx.WinJS.Accelerometer = {

        /**
         * Creates a wrapper for the Accelerometer which listens for the readingchanged event.
         * @returns {Observable} An observable sequence wrapping the Accelerometer's readingchanged event.
        */   
        readingChanged: function () {
            return fromSensorEvent(accelerometer, 'readingchanged');
        },

        /**
         * Creates a wrapper for the Accelerometer which listens for the shaken event.
         * @returns {Observable} An observable sequence wrapping the Accelerometer's shaken event.
        */  
        shaken: function () {
            return fromSensorEvent(accelerometer, 'shaken');
        }
    }  
