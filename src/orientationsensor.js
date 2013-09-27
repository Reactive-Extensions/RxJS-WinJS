    var orientationSensor = Windows.Devices.Sensors.OrientationSensor.getDefault();
    if (orientationSensor) {

        Rx.WinJS.OrientationSensor = {
             /**
             * Creates a wrapper for the OrientationSensor which listens for the readingchanged event.
             * @returns {Observable} An observable sequence wrapping the OrientationSensor's readingchanged event.
             */
            readingChanged: function (reportInterval) {
                return createSensorObservable(orientationSensor, 'readingchanged', reportInterval);
            }  
        };
    }