// Counter
function funcounterUpdate( elems, settings ) {
    [].forEach.call(elems, function(el){
        var counterUpper = function() {
            this.destroy();
            var nums = [];
            var divisions = settings.time / settings.delay;
            var num = el.innerText;
            var isComma = /[0-9]+,[0-9]+/.test(num);
            num = num.replace(/,/g, '');
            var isInt = /^[0-9]+$/.test(num);
            var isFloat = /^[0-9]+\.[0-9]+$/.test(num);
            var decimalPlaces = isFloat ? (num.split('.')[1] || []).length : 0;

            // Generate list of incremental numbers to display
            for (var i = divisions; i >= 1; i--) {

                // Preserve as int if input was int
                var newNum = parseInt(num / divisions * i);

                // Preserve float if input was float
                if (isFloat) {
                    newNum = parseFloat(num / divisions * i).toFixed(decimalPlaces);
                }

                // Preserve commas if input had commas
                if (isComma) {
                    while (/(\d+)(\d{3})/.test(newNum.toString())) {
                        newNum = newNum.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
                    }
                }

                nums.unshift(newNum);
            }

            el.counterupNums =  nums;
            el.innerText = '0';

            // Updates the number until we're done
            var f = function(f) {
                if (el.counterupNums && el.counterupNums.length) {
                    el.innerText = el.counterupNums.shift();
                    setTimeout(f, settings.delay, f);
                } else {
                    delete el.counterupNums;
                }
            };

            // Start the count up
            setTimeout(f, settings.delay, f);
        };

        // Perform counts when the element gets into view
        new Waypoint({
            element: el,
            handler: counterUpper,
            offset: '100%'
        })
    });
}

document.addEventListener("MainContentChanged", () => {
    funcounterUpdate(document.getElementsByClassName('counter'), {
        delay: 10,
        time: 1000
    });
});