    var inclinometer = Windows.Devices.Sensors.Inclinometer.getDefault();
    if (inclinometer) {

        Rx.WinJS.Inclinometer = {
             /**
             * Creates a wrapper for the Inclinometer which listens for the readingchanged event.
             * @returns {Observable} An observable sequence wrapping the Inclinometer's readingchanged event.
             */
            readingChanged: function (reportInterval) {
                return createSensorObservable(inclinometer, 'readingchanged', reportInterval);
            }  
        };
    }