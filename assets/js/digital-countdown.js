(function(window, $, undefined) {
    
    $.fn.countdownDigital = function(options){
        
        // Default parameters
        var _defaults = $.extend({
            dateTo: '2016-06-21',
            dateNow: null,
            _labels: false,
            showBlank: true,
            seperator: true,
            seperatorChar: ','

        },options);
  
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
            'nine',
            'comma'
        ];

        var _labels = [
            'seconds'
        ];

        function drawCountdown(element) {
            
            var dateTo = moment(_defaults.dateTo);
            var dateNow = (_defaults.dateNow === null) ? moment() : _defaults.dateNow; 
            var dateDiffSeconds = dateTo.diff(dateNow, 'seconds');
            var digit_holder = $('<div class="_digits"></div>').appendTo(element);
            var num, numSplit, numSplitWithCommas, isComma, digit;
            
            $.each(_labels, function(key,val){
                if(dateDiffSeconds > 0) {
                    num = pad(dateDiffSeconds,8);
                    numSplit = num.toString().split("");
                } else {
                    numSplit = ['0','0'];
                }
                numSplitWithCommas = addCommas(numSplit);
                var label = $('<div></div>',{
                    class: 'each '+val
                });
                $.each(numSplitWithCommas, function(key_no,val_no){
                    isComma = undefined === _digits[val_no] ? true : false;
                    
                    if (isComma) {
                        digit = $('<div></div>',{
                            class: 'comma digit '+val+'_'+key_no
                        });
                        digit.append('<span class="comma">,</span>');
                    } else {
                        digit = $('<div></div>',{
                            class: 'real-number digit '+val+'_'+key_no
                        });
                        for(var i=1; i<8; i++){
                            digit.append('<span class="side d' + i + '">');
                        }
                        if(dateDiffSeconds > 0) {
                            digit.addClass(_digits[val_no]);
                        } else {
                            digit.addClass('zero');
                        }
                    }
                    digit.appendTo(label);
                });
                if(_defaults._labels) label.append('<span class="text">'+val+'</span>');
                label.append('<span class="dots"></span>');
                label.appendTo(digit_holder);
            });

        }

        
        function updateTime(element) {

            var dateTo = moment(_defaults.dateTo);
            var dateNow = (_defaults.dateNow === null) ? moment() : _defaults.dateNow; 
            var dateDiffSeconds= dateTo.diff(dateNow, 'seconds');
            
            if(dateDiffSeconds > 0) {
                $.each(_labels, function(key,val){
                    var num = pad(dateDiffSeconds,8);
                    var numSplit = num.toString().split("");
                    var numSplitWithCommas = addCommas(numSplit);
                    var dig, isComma;
 
                    $.each(numSplitWithCommas, function(key_no,val_no){
                        isComma = undefined === _digits[val_no] ? true : false;
                        if (isComma) {
                            dig = $(element).find('.digit.'+val+'_'+key_no);
                            dig.removeClass().addClass('comma digit '+val+'_'+key_no);
                        } else {
                            dig = $(element).find('.digit.'+val+'_'+key_no);
                            dig.removeClass().addClass('real-number digit '+val+'_'+key_no+' '+_digits[val_no]);
                        }
                    });
                });
            } else {
                $.each(_labels, function(key,val){
                    var dig = $(element).find('.digit');
                    dig.addClass('zero');
                });
            }
            
        }
        
        function startCountdown(element) {
            setInterval( 
                function() { 
                    updateTime(element);
                }, 1000);
        }
        
        
        // Return instance
        return this.each(function(){
            
            var element = $(this);
            
            drawCountdown(element);
            startCountdown(element);
        });

        function pad(num, size) {
            // Add the leading zeros to the numbers
            var s = num + '';
            while (s.length < size) s = '0' + s;
            return s;
        }

        function addCommas(numbers) {
            var numbers_with_commas = numbers;
            var arr_length = numbers_with_commas.length;
            for (var i = numbers_with_commas.length; i > 0; --i) {
                if (0 === i % 3) {
                    numbers_with_commas.splice(i - 1, 0, 'comma');
                }
            }
            return numbers_with_commas;
        }
    };
    
}(window, jQuery));