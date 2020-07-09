define([
        'jquery',
        'ko',
        'Magento_Checkout/js/model/quote'
    ], function (
    $,
    ko,
    quote
    ) {
        'use strict';
        var mixin = {
            defaults: {
                startTimeArray: [6,7],
                closeTimeArray: [16,17],
                localWeekend: [0,6] //Weekend Sunday and Saturday
            },
            initialize: function (config) {
                this.storeCustomDate = ko.observable(new Date());
                this.startTime = ko.observable();
                this.closeTime = ko.observable();

                this._super();
            },

            initObservable: function () {
                this._super();
                this.selectedMethod = function(present_method){
                    return ko.computed(function () {
                        var method = quote.shippingMethod();
                        var selectedMethod = method != null ? method.method_code + '_' + method.carrier_code : null;
                        if (selectedMethod === 'bestway_tablerate') {
                            this.startTime = this.startTimeArray[0];
                            this.closeTime = this.closeTimeArray[0];
                        } else if (selectedMethod === 'flatrate_flatrate'){
                            this.startTime = this.startTimeArray[1];
                            this.closeTime = this.closeTimeArray[1];
                        }
                        return selectedMethod === present_method;
                        }, this);
                };
                return this;
            },
            getMinDate: function() {
                var currentDate = new Date(), currentTime, currentDay, i, localeWeekend = this.getLocalWeekend(),
                    startTime = this.startTime;
                currentTime = currentDate.getHours();

                if(currentTime >= this.closeTime){
                    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
                }
                currentDay = currentDate.getDay();
                var dateFactor = function(currentDate) {
                    if(localeWeekend.indexOf(currentDay) >=0 ) {
                        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
                        currentDay = currentDate.getDay();
                        return dateFactor(currentDate);
                    }
                    return currentDate;
                };
                currentDate = dateFactor(currentDate);
                currentDate.setHours(startTime);
                currentDate.setMinutes(0);
                return currentDate;
            },
            getLocalWeekend: function() {
                return this.localWeekend;
            }
        };

        return function (target) {
            return target.extend(mixin);
        };
    }
);