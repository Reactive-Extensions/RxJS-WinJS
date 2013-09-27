    var lightSensor = Windows.Devices.Sensors.LightSensor.getDefault();

    Rx.WinJS.LightSensor = {
         /**
         * Creates a wrapper for the LightSensor which listens for the readingchanged event.
         * @returns {Observable} An observable sequence wrapping the LightSensor's readingchanged event.
         */
        readingChanged: function () {
            return fromSensorEvent(lightSensor, 'readingchanged');
        }  
    };
