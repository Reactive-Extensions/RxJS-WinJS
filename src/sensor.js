    /**
     * Creates a wrapper for listening to WinJS sensor's events.
     * @param {Object} sensor The WinJS sensor to attach the event listener.
     * @param {String} eventName The event name to listen for.
     * @returns {Observable} An observable sequence wrapping the Sensor's given event event.
    */   
    var fromSensorEvent = Rx.WinJS.fromSensorEvent = function (sensor, eventName) {
        return observableCreateWithDisposable(function (observer) {
           
           if (!sensor) {
               observer.onError('Sensor not supported');
               return disposableEmpty;
           }
           
           function handler(eventData) {
               observer.onNext(eventData);
           }
           
           sensor.addEventListener(sensor, eventName, false);
           
           return disposableCreate(function () {
               sensor.removeEventListener(sensor, eventName, false);
           });
        }).publish().refCount();
    };
