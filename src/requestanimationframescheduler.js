
    // Get the right animation frame method
    var requestAnimFrame, cancelAnimFrame;
    if (window.requestAnimationFrame) {
        requestAnimFrame = window.requestAnimationFrame;
        cancelAnimFrame = window.cancelAnimationFrame;
    } else if (window.mozRequestAnimationFrame) {
        requestAnimFrame = window.mozRequestAnimationFrame;
        cancelAnimFrame = window.mozCancelAnimationFrame;
    } else if (window.webkitRequestAnimationFrame) {
        requestAnimFrame = window.webkitRequestAnimationFrame;
        cancelAnimFrame = window.webkitCancelAnimationFrame;
    } else if (window.msRequestAnimationFrame) {
        requestAnimFrame = window.msRequestAnimationFrame;
        cancelAnimFrame = window.msCancelAnimationFrame;
    } else if (window.oRequestAnimationFrame) {
        requestAnimFrame = window.oRequestAnimationFrame;
        cancelAnimFrame = window.oCancelAnimationFrame;    
    } else {
        requestAnimFrame = function(cb) { window.setTimeout(cb, 1000 / 60); };
        cancelAnimFrame = window.clearTimeout;
    }

    /** 
     * Gets a scheduler that schedules schedules work on the requestAnimationFrame for immediate actions.
     *
     * @memberOf Scheduler
     */
    Scheduler.requestAnimationFrame = (function () {

        var defaultNow = (function () { return !!Date.now ? Date.now : function () { return +new Date; }; }());

        function scheduleNow(state, action) {
            var scheduler = this,
                disposable = new SingleAssignmentDisposable();
            var id = requestAnimFrame(function () {
                if (!disposable.isDisposed) {
                    disposable.setDisposable(action(scheduler, state));
                }
            });
            return new CompositeDisposable(disposable, disposableCreate(function () {
                cancelAnimFrame(id);
            }));
        }

        function scheduleRelative(state, dueTime, action) {
            var scheduler = this,
                dt = Scheduler.normalize(dueTime);
            if (dt === 0) {
                return scheduler.scheduleWithState(state, action);
            }

            var disposable = new SingleAssignmentDisposable(),
                id;
            var scheduleFunc = function () {
                if (id) { cancelAnimFrame(id); }
                if (dt - scheduler.now() <= 0) {
                    if (!disposable.isDisposed) {
                        disposable.setDisposable(action(scheduler, state));
                    }
                } else {
                    id = requestAnimFrame(scheduleFunc);
                }
            };

            id = requestAnimFrame(scheduleFunc);

            return new CompositeDisposable(disposable, disposableCreate(function () {
                cancelAnimFrame(id);
            }));
        }

        function scheduleAbsolute(state, dueTime, action) {
            return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
        }

        return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);        

    }());
    