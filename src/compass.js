	var compass = Windows.Devices.Sensors.Compass.getDefault();
	if (compass) {
		Rx.WinJS.Compass = {

            /**
             * Creates a wrapper for the Compass which listens for the readingchanged event.
             * @returns {Observable} An observable sequence wrapping the Compass's readingchanged event.
            */   
			readingChanged: function (reportInterval) {
				return createSensorObservable(compass, 'readingchanged', reportInterval);
			}
		};
	}