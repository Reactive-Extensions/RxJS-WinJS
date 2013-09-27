    function createSensorObservable(sensor, eventName, reportInterval) {
        return observableCreateWithDisposable(function (observer) {

            if (typeof reportInterval !== 'undefined') {
                var minimumReportInterval = sensor.minimumReportInterval;
                sensor.reportInterval = minimumReportInterval > 16 ? minimumReportInterval : 16;                 
            }

            function handler(eventObject) {
                observer.onNext(eventObject);
            }

            sensor.addEventListener(eventName, handler, false);

            return disposableCreate(function () {
                sensor.removeEventListener(eventName, handler, false);
                sensor.reportInterval = 0;
            });
        }).publish().refCount();          
    }
