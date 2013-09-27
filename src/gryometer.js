    var gyrometer = Windows.Devices.Sensors.Gyrometer.getDefault();
    if (gyrometer) {

        Rx.WinJS.Gyrometer = {
             /**
             * Creates a wrapper for the Gyrometer which listens for the readingchanged event.
             * @returns {Observable} An observable sequence wrapping the Gyrometer's readingchanged event.
             */
            readingChanged: function (reportInterval) {
                return createSensorObservable(gyrometer, 'readingchanged', reportInterval);
            }  
        };
    }

