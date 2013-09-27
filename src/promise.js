    /**
     * Converts an existing WinJS Promise object to an observable sequence with an optional observer for progress.
     * @param {Function|Observer} [observerOrOnNext] An optional Observer or onNext function to capture progress events. 
     * @returns {Observable} An observable sequence wrapping an existing WinJS Promise object.   
     */
    Promise.prototype.toObservable = function (observerOrOnNext) {

        var subject = new AsyncSubject();
        this.done(
            function (next) {
                subject.onNext(next);
                subject.onCompleted();
            }, 
            subject.onError.bind(subject), 
            function (progress) {
                if (typeof observerOrOnNext === 'function') {
                    observerOrOnNext(progress);
                } else if (observerOrOnNext) {
                    observerOrOnNext.onNext(progress);
                }
            }
        );
        return subject.asObservable();
    };

    /**
     * Converts an existing Observable to a WinJS Promise object.
     * @returns {WinJS.Promise} A WinJS Promise object which encapsulates the given Observable sequence.
     */     
    observableProto.toPromise = function () {

        var parent = this, subscription, value;
        return new Promise(function (c, e) {
            subscription = parent.subscribe(function (v) {
                value = v;
            }, function (exn) {
                e(exn);
            }, function () {
                c(value);
            });
        }, function () {
            if (subscription) { subscription.dispose(); }
        });
    };

    /**
     * Converts an existing WinJS Promise object to an observable sequence with an optional observer for progress.
     * @param {WinJS.Promise} promise The Promise to convert to an Observable sequence. 
     * @param {Function|Observer} [observerOrOnNext] An optional Observer or onNext function to capture progress events. 
     * @returns {Observable} An observable sequence wrapping an existing WinJS Promise object.
     */
    Promise.toObservable = function (promise, observerOrOnNext) {
        return Promise.prototype.toObservable.call(promise, observerOrOnNext);
    };