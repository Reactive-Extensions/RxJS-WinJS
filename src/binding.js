    var originalAs = Binding.as;

    function bindObservable(bindable, name) {
        return observableCreate(function (observer) {
            var handler = function (newValue, oldValue) {
                observer.onNext({
                    name: name,
                    newValue: newValue,
                    oldValue: oldValue,
                    dataObject: bindable
                });
            };
            bindable.bind(name, handler);
            return function () {
                bindable.unbind(name, handler);
            };
        });
    }

    /**
     * Returns an observable object. This may be an observable proxy for the specified object, an existing proxy, or
     * the specified object itself if it directly supports observability.
     * This also adds a `toObservable` method which allows to turn the given binding object into an observable object.
     * 
     * @param {Object} data Object to provide observability for.
     * 
     * @returns {Observable} The observable object.
     */
    Binding.as = function (data) {
        var bindable = originalAs(data);
        bindable.toObservable = function () {
            if (arguments.length === 0) {
                throw new Error('Must have at least one binding');
            }
            var observables = [];
            for (var i = 0, len = arguments.length; i < len; i++) {
                observables.push(bindObservable(bindable, arguments[i]));
            }
            return Observable.merge(observables);
        };

        return bindable;
    };
