    function createEventListener(el, eventName, handler) {
        var disposables = new CompositeDisposable();

        function createListener(element, en, fn) {
            element.addEventListener(en, fn, false);
            return disposableCreate(function () {
                element.removeEventListener(en, fn, false);
            });
        };

        // Assume collection versus single
        if (el && el.length) {
            for (var i = 0, len = el.length; i < len; i++) {
                disposables.add(createEventListener(el[i], eventName, handler));
            }
        } else {
            disposables.add(createListener(el, eventName, handler));
        }

        return disposables;
    }

    /**
     * Binds an event to a given element or item.  This supports either a single object or a collection.
     *
     * @param {Element|NodeList} element The element or object to bind the event to.
     * @param {String} eventName The name of the event to bind to the given element
     * @returns {Observable} An observable sequence which listens to the event on the given element or object
     */
    Rx.WinJS.fromEvent = function (element, eventName) {
        return observableCreateWithDisposable(function (observer) {
            return createEventListener(element, eventName, observer.onNext.bind(observer));
        }).publish().refCount();
    };
