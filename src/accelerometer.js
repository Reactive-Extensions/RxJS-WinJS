    var accelerometer = Windows.Devices.Sensors.Accelerometer.getDefault();
    if (accelerometer) {

        Rx.WinJS.Accelerometer = {

            /**
             * Creates a wrapper for the Accelerometer which listens for the readingchanged event.
             * @returns {Observable} An observable sequence wrapping the Accelerometer's readingchanged event.
            */   
            readingChanged: function (reportInterval) {
                return createSensorObservable(accelerometer, 'readingchanged', reportInterval);
            },

            /**
             * Creates a wrapper for the Accelerometer which listens for the shaken event.
             * @returns {Observable} An observable sequence wrapping the Accelerometer's shaken event.
            */  
            shaken: function () {
                return createAccelerometerObservable('shaken', reportInterval);
            }
        }   
    }
