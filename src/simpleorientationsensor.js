    var simpleOrientationSensor = Windows.Devices.Sensors.SimpleOrientationSensor.getDefault();
    if (simpleOrientationSensor) {

        Rx.WinJS.SimpleOrientationSensor = {
             /**
             * Creates a wrapper for the SimpleOrientationSensor which listens for the orientationchanged event.
             * @returns {Observable} An observable sequence wrapping the SimpleOrientationSensor's orientationchanged event.
             */
            orientationChanged: function (reportInterval) {
                return createSensorObservable(simpleOrientationSensor, 'orientationchanged', reportInterval);
            }  
        };
    }