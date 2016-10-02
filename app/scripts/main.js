(function (window, $) {
    'use strict';
    $.fn.countdownDigital = function (options) {

        // Default parameters
        var _defaults = $.extend({
            dateTo: '2016-06-21',
            dateNow: null,
            labels: false,
            showBlank: true,
            seperator: true,
            seperatorChar: ',',
            showMSecs: false,
            refreshRateMsecs: 0

        }, options);

        var _digits = [
            'zero',
            'one',
            'two',
            'three',
            'four',
            'five',
            'six',
            'seven',
            'eight',
            'nine'
        ];

        var _labels = [
            'seconds'
        ];

        var _mSecsRefreshDisplay;

        function drawCountdown(element) {

            var num, numSplit, numSplitWithCommas, isComma, isColon, digit, i;
            var dateTo = moment(_defaults.dateTo);
            var dateNow = (_defaults.dateNow === null) ? moment() : _defaults.dateNow;
            var dateDiff = true === _defaults.showMSecs ? dateTo.diff(dateNow) : dateTo.diff(dateNow, 'seconds');
            var digit_holder = $('<div class="_digits"></div>').appendTo(element);

            $.each(_labels, function(labelKey, labelVal) {
                if(dateDiff > 0) {
                    num = pad(dateDiff, 8);
                    numSplit = num.toString().split("");
                } else {
                    numSplit = ['0','0'];
                }
                numSplitWithCommas = addCommas(numSplit);
                var label = $('<div></div>', {
                    class: 'each ' +labelVal
                });
                $.each(numSplitWithCommas, function(numberKey, numberVal) {
                    isComma = ('comma' === numberVal) ? true : false;
                    isColon = ('colon' === numberVal) ? true : false;

                    if (isComma) {
                        digit = $('<div></div>', {
                            class: 'comma digit ' + labelVal + '_' + numberKey
                        });
                        digit.append('<span class="comma">' + _defaults.seperatorChar + '</span>');
                    } else if (isColon) {
                        digit = $('<div></div>', {
                            class: 'colon digit '+ labelVal + '_' + numberKey
                        });
                        digit.append('<span class="colon">.</span>');
                    } else {
                        digit = $('<div></div>', {
                            class: 'real-number digit ' + labelVal + '_' + numberKey
                        });
                        for(i=1; i<8; i+=1){
                            digit.append('<span class="side d' + i + '">');
                        }
                        if(dateDiff > 0) {
                            digit.addClass(_digits[numberVal]);
                        } else {
                            digit.addClass('zero');
                        }
                    }
                    digit.appendTo(label);
                });
                if (_defaults.labels) { label.append('<span class="text">'+labelVal+'</span>'); }
                label.append('<span class="dots"></span>');
                label.appendTo(digit_holder);
            });

        }

        function updateTime(element) {

            var dateTo = moment(_defaults.dateTo);
            var dateNow = (_defaults.dateNow === null) ? moment() : _defaults.dateNow;
            var dateDiff = true === _defaults.showMSecs ? dateTo.diff(dateNow) : dateTo.diff(dateNow, 'seconds');

            if(dateDiff > 0) {
                $.each(_labels, function(key, val){
                    var num = pad(dateDiff, 8);
                    var numSplit = num.toString().split("");
                    var numSplitWithCommas = addCommas(numSplit);
                    var dig, isComma, isColon;

                    $.each(numSplitWithCommas, function(key_no, val_no){
                      isComma = 'comma' === val_no ? true : false;
                      isColon = 'colon' === val_no ? true : false;
                        if (isComma) {
                            dig = $(element).find('.digit.'+val+'_'+key_no);
                            dig.removeClass().addClass('comma digit '+val+'_'+key_no);
                        }
                        else if (isColon) {
                            dig = $(element).find('.digit.'+val+'_'+key_no);
                            dig.removeClass().addClass('colon digit '+val+'_'+key_no);
                        } else {
                            dig = $(element).find('.digit.'+val+'_'+key_no);
                            dig.removeClass().addClass('real-number digit '+val+'_'+key_no+' '+_digits[val_no]);
                        }
                    });
                });
            } else {
                $.each(_labels, function(key, val){
                    var dig = $(element).find('.digit');
                    dig.addClass('zero');
                });
            }
        }

        function startCountdown(element) {
            setInterval(
                function() {
                    updateTime(element);
                }, _mSecsRefreshDisplay);
        }

        // Return instance
        return this.each(function(){

            var element = $(this);
            // only need to update display every second if we not showing msecs
            _mSecsRefreshDisplay = true === _defaults.showMSecs ? 210 : 1000;
            // override refreshRate if its been manually set
            _mSecsRefreshDisplay = _defaults.refreshRateMsecs > 0 ?
              _defaults.refreshRateMsecs : _mSecsRefreshDisplay;
            drawCountdown(element);
            startCountdown(element);
        });

        function pad(num, size) {
            // Add the leading zeros to the numbers
            var s = num + '';
            while (s.length < size) { s = '0' + s; }
            return s;
        }

        function addCommas(numbers) {
            var numbers_with_commas = numbers;
            var arr_length = numbers_with_commas.length;
            var i;
            for (i = arr_length; i > 0; --i) {
                if (0 === i % 3) {
                    numbers_with_commas.splice(i -2 , 0, 'comma');
                }
            }
            if (true === _defaults.showMSecs) {
                arr_length = numbers_with_commas.length;
                numbers_with_commas[arr_length - 4] = 'colon';
            }
            return removeUnnecFinalComma(numbers_with_commas);
        }

        function removeUnnecFinalComma(numbers_with_commas) {
            var lastIndexOfComma = numbers_with_commas.lastIndexOf('comma');
            var lastIndexOfColon = numbers_with_commas.lastIndexOf('colon');
            if ((lastIndexOfComma === numbers_with_commas.length) ||
                (lastIndexOfColon - 1 === lastIndexOfComma)) {
                numbers_with_commas.splice(lastIndexOfComma, 1);
            }
            return numbers_with_commas;
        }
    };
    
}(window, jQuery));