    var simpleOrientationSensor = Windows.Devices.Sensors.SimpleOrientationSensor.getDefault();

    Rx.WinJS.SimpleOrientationSensor = {
         /**
         * Creates a wrapper for the SimpleOrientationSensor which listens for the orientationchanged event.
         * @returns {Observable} An observable sequence wrapping the SimpleOrientationSensor's orientationchanged event.
         */
        orientationChanged: function (reportInterval) {
            return fromSensorEvent(simpleOrientationSensor, 'orientationchanged');
        }  
    };
