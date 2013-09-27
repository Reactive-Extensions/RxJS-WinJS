    var lightSensor = Windows.Devices.Sensors.LightSensor.getDefault();
    if (lightSensor) {

        Rx.WinJS.LightSensor = {
             /**
             * Creates a wrapper for the LightSensor which listens for the readingchanged event.
             * @returns {Observable} An observable sequence wrapping the LightSensor's readingchanged event.
             */
            readingChanged: function (reportInterval) {
                return createSensorObservable(lightSensor, 'readingchanged', reportInterval);
            }  
        };
    }