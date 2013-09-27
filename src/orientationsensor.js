    var orientationSensor = Windows.Devices.Sensors.OrientationSensor.getDefault();

    Rx.WinJS.OrientationSensor = {
         /**
         * Creates a wrapper for the OrientationSensor which listens for the readingchanged event.
         * @returns {Observable} An observable sequence wrapping the OrientationSensor's readingchanged event.
         */
        readingChanged: function () {
            return fromSensorEvent(orientationSensor, 'readingchanged');
        }  
    };
