"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var template_1 = require("./template");
var dateFns = require('date-fns');
var MultipleDatePickerComponent = (function () {
    function MultipleDatePickerComponent() {
        this.cssDaysOfSurroundingMonths = this.cssDaysOfSurroundingMonths || 'picker-empty';
        this.arrow = 0;
        this.month = dateFns.startOfToday(); // today's day at start of day midnight or passed in value
        this.projectScope = [];
        this.days = [];
        this.daysOff = this.daysOff || [];
        this.disableBackButton = false;
        this.disableNextButton = false;
        this.daysOfWeek = [];
        // _cssDaysOfSurroundingMonths: any = this._cssDaysOfSurroundingMonths || 'picker-empty';
        this.yearsForSelect = [];
        this.propagateChange = function (_) { };
    }
    MultipleDatePickerComponent.prototype.ngOnInit = function () {
        /**
         * check to see if this.month is undefined... if it is set to todays date info
         * protection for calendar month adjustments -- otherwise will break upon loading
         */
        if (this.month === undefined) {
            this.month = dateFns.startOfToday();
        }
        this.generate();
        this.daysOfWeek = this.getDaysOfWeek();
        this.arrowSelected();
        this.weekDaysOff = this.weekDaysOff || [];
    };
    MultipleDatePickerComponent.prototype.arrowSelected = function () {
        if (this.matIcons) {
            return this.arrow = 1;
        }
        else if (this.fontAwesome) {
            return this.arrow = 2;
        }
    };
    MultipleDatePickerComponent.prototype.writeValue = function (value) {
        var _this = this;
        if (value !== undefined) {
            this.projectScope = value;
            if (value !== null) {
                this.projectScope = this.projectScope.map(function (val) {
                    return new Date(val);
                });
                this.projectScope.forEach(function (val) {
                    var day = val;
                    _this.days.forEach(function (d) {
                        if (dateFns.isSameDay(d.date, day)) {
                            d.mdp.selected = true;
                            return;
                        }
                    });
                });
            }
        }
    };
    MultipleDatePickerComponent.prototype.registerOnChange = function (fn) {
        this.propagateChange = fn;
    };
    MultipleDatePickerComponent.prototype.registerOnTouched = function () { };
    Object.defineProperty(MultipleDatePickerComponent.prototype, "projectScope2", {
        get: function () {
            return this._projectScope;
        },
        set: function (val) {
            this._projectScope = val;
            this.propagateChange(this._projectScope);
        },
        enumerable: true,
        configurable: true
    });
    MultipleDatePickerComponent.prototype.checkNavigationButtons = function () {
        var today = new Date(), previousMonth = dateFns.subMonths(this.month, 1), nextMonth = dateFns.addMonths(this.month, 1);
        this.disableBackButton = this.disableNavigation || (this.disallowBackPastMonths && dateFns.isAfter(dateFns.subDays(today,1), previousMonth));
        this.disableNextButton = this.disableNavigation || (this.disallowGoFuturMonths && dateFns.isBefore(today, nextMonth));
    };
    MultipleDatePickerComponent.prototype.getDaysOfWeek = function () {
        /*To display days of week names in moment.lang*/
        var momentDaysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], daysOfWeek = [];
        for (var i = 1; i < 7; i++) {
            daysOfWeek.push(momentDaysOfWeek[i]);
        }
        if (this.sundayFirstDay) {
            daysOfWeek.splice(0, 0, momentDaysOfWeek[0]);
        }
        else {
            daysOfWeek.push(momentDaysOfWeek[0]);
        }
        return daysOfWeek;
    };
    MultipleDatePickerComponent.prototype.getMonthYearToDisplay = function () {
        var month = dateFns.format(this.month, 'MMMM');
        return month.charAt(0).toUpperCase() + month.slice(1);
    };
    MultipleDatePickerComponent.prototype.getYearsForSelect = function () {
        var now = new Date(), changeYearPast = Math.max(0, parseInt(this.changeYearPast, 10) || 0), changeYearFuture = Math.max(0, parseInt(this.changeYearFuture, 10) || 0), min = dateFns.subYears(this.month,changeYearPast), max = dateFns.addYears(this.month, changeYearFuture), result = [];
        dateFns.addYears(max, 1);
        for (var m = new Date(min); dateFns.isAfter(max, m); dateFns.addYears(m, 1)) {
            if ((!this.disallowBackPastMonths || (dateFns.isAfter(m, now) || dateFns.isSameYear(m, now))) && (!this.disallowGoFuturMonths || (dateFns.isBefore(m, now) || dateFns.isSame(m, now)))) {
                result.push(dateFns.format(m, 'YYYY'));
            }
        }
        return result;
    };
    ;
    MultipleDatePickerComponent.prototype.toggleDay = function (event, day) {
        event.preventDefault();
        if (day.mdp.otherMonth && !this.fireEventsForDaysOfSurroundingMonths) {
            return;
        }
        var prevented = false;
        event.preventDefault = function () {
            prevented = true;
        };
        if (typeof this.dayClick == 'function') {
            if (!day.mdp.selected) {
                this.projectScope = [day.date];
                this.generate();
                this.dayClick(event, day);
            }
            else {
                this.clearDays();
                this.dayClick(event, day);
            }
        }
        if (day.selectable && !prevented) {
            day.mdp.selected = !day.mdp.selected;
            if (day.mdp.selected) {
                this.projectScope.push(day.date);
                // console.log('this project scope = ' + this.projectScope); // for testing keep!
            }
            else {
                var idx = -1;
                for (var i = 0; i < this.projectScope.length; ++i) {
                    if (dateFns.isDate(this.projectScope[i])) {
                        if (dateFns.isSameDay(this.projectScope[i],day.date)) {
                            idx = i;
                            break;
                        }
                    }
                    else {
                        if (dateFns.isSameDay(this.projectScope[i].date, day.date)) {
                            idx = i;
                            break;
                        }
                    }
                }
                if (idx !== -1) {
                    this.projectScope.splice(idx, 1);
                }
            }
        }
        this.propagateChange(this.projectScope);
    };
    MultipleDatePickerComponent.prototype.clearDays = function () {
        this.projectScope = [];
        this.generate();
        console.log('clearDays was fired off'); // for testing
    };
    MultipleDatePickerComponent.prototype.runGenerate = function () {
        this.generate();
    }; // remove this and from html
    MultipleDatePickerComponent.prototype.rightClicked = function (event, day) {
        if (typeof this.rightClick === 'function') {
            event.preventDefault();
            this.rightClick(event, day);
        }
    };
    MultipleDatePickerComponent.prototype.getDayClasses = function (day) {
        //console.log('this is day = ' + JSON.stringify(day)); // for testing keep
        var css = '';
        if (day.css && (!day.mdp.otherMonth || this.showDaysOfSurroundingMonths)) {
            css += ' ' + day.css;
        }
        if (this.cssDaysOfSurroundingMonths && day.mdp.otherMonth) {
            css += ' ' + this.cssDaysOfSurroundingMonths;
        }
        if (day.mdp.selected) {
            css += ' picker-selected';
        }
        if (!day.selectable) {
            css += ' picker-off';
        }
        if (day.mdp.today) {
            if (this.highlightDays !== undefined && this.highlightDays.length > 0) {
                var arrayObject = this.highlightDays.find(function (x) { return x.css; });
                // let index = this.highlightDays.indexOf(arrayObject); // gives number of occurenses in array
                var arrayKeys = Object.keys(this.highlightDays);
                if (arrayObject !== undefined && arrayKeys.length > 0) {
                    var highlightDayCss = arrayObject.css;
                    css += ' today ' + highlightDayCss;
                }
                else {
                    css += ' today ';
                }
            }
        }
        if (day.mdp.past) {
            css += ' past';
        }
        if (day.mdp.future) {
            css += ' future';
        }
        if (day.mdp.otherMonth) {
            css += ' picker-other-month';
        }
        return css;
    };
    /*Navigate to another month*/
    MultipleDatePickerComponent.prototype.changeMonth = function (event, disable, add) {
        if (disable) {
            return;
        }
        event.preventDefault();
        var prevented = false;
        event.preventDefault = function () {
            // console.log('entered into preventDefault *****'); // for testing
            prevented = true;
        };
        var monthTo = dateFns.addMonths(this.month, add);
        if (typeof this.monthClick == 'function') {
            this.monthClick(event, monthTo);
        }
        if (!prevented) {
            var oldMonth = new Date(this.month);
            this.month = monthTo;
            if (typeof this.monthChanged == 'function') {
                this.monthChanged(this.month, oldMonth);
            }
            this.generate();
        }
    };
    /*Change year*/
    MultipleDatePickerComponent.prototype.changeYear = function (year) {
        this.month = this.month.getYear(parseInt(year, 10));
    };
    ;
    /*Check if the date is off : unselectable*/
    MultipleDatePickerComponent.prototype.isDayOff = function (day) {
        return this.allDaysOff ||
            (this.disableDaysBefore && dateFns.isBefore(day.date, new Date())) ||
            (!!this.disableDaysAfter && dateFns.isAfter(day.date, new Date())) ||
            ((this.weekDaysOff instanceof Array) && this.weekDaysOff.some(function (dayOff) {
                return day.date.getDay() === dayOff;
            })) ||
            ((this.daysOff === Array) && this.daysOff.some(function (dayOff) {
                return dateFns.isSameDay(day.date, dayOff);
            })) ||
            ((this.daysAllowed === Array) && !this.daysAllowed.some(function (dayAllowed) {
                return dateFns.isSameDay(day.date, dayAllowed);
            })) ||
            ((Object.prototype.toString.call(this.highlightDays) === '[object Array]') && this.highlightDays.some(function (highlightDay) {
                return dateFns.isSameDay(day.date, highlightDay.date) && !highlightDay.selectable && highlightDay.css;
            }));
    };
    /*Check if the date is selected*/
    MultipleDatePickerComponent.prototype.isSelected = function (day) {
        return this.projectScope.some(function (d) {
            return dateFns.isSameDay(day.date, d);
        });
    };
    /*Generate the calendar*/
    MultipleDatePickerComponent.prototype.generate = function () {
        var _this = this;
        var year = this.month.getYear().toString();
        this.yearsForSelect = this.getYearsForSelect();
        this.monthToDisplay = this.getMonthYearToDisplay();
        this.yearToDisplay = dateFns.format(this.month, 'YYYY');
        var previousDay = dateFns.setDate(this.month, 0);

        previousDay = dateFns.setDay(previousDay, (this.sundayFirstDay ? 0 : 1));

        previousDay = dateFns.subDays(previousDay, 1);

        console.log(previousDay);


        if (dateFns.differenceInDays(dateFns.setDate(this.month, 0), previousDay) > 6) {
            previousDay = dateFns.addWeeks(previousDay, 1);
        }

        console.log(previousDay);




        var firstDayOfMonth = dateFns.setDate(this.month, 1), days = [], now = Date(), lastDay = dateFns.endOfMonth(this.month), createDate = function () {
            previousDay = dateFns.addDays(previousDay, 1);
            var day = {
                selectable: true,
                date: previousDay,
                css: null,
                title: '',
                mdp: {
                    selected: false,
                    today: false,
                    past: true,
                    future: true,
                    otherMonth: false
                },
            };
            if ((Object.prototype.toString.call(_this.highlightDays) === '[object Array]')) {
                var hlDay = _this.highlightDays.filter(function (d) {
                    return dateFns.isSameDay(day.date, d.date);
                });
                day.css = hlDay.length > 0 ? hlDay[0].css : '';
                day.title = hlDay.length > 0 ? hlDay[0].title : 't';
            }
            day.selectable = !_this.isDayOff(day);
            day.mdp.selected = _this.isSelected(day);
            day.mdp.today = dateFns.isSameDay(day.date, now);
            day.mdp.past = dateFns.isBefore(day.date, now);
            day.mdp.future = dateFns.isAfter(day.date,now);
            if (!dateFns.isSameMonth(day.date, _this.month)) {
                day.mdp.otherMonth = true;
                // console.log(_this.month);
            }
            return day;
        };
        var maxDays = dateFns.differenceInDays(lastDay, previousDay), lastDayOfWeek = this.sundayFirstDay ? 6 : 0;
        if (lastDay.getDay() !== lastDayOfWeek) {
            maxDays += (this.sundayFirstDay ? 6 : 7) - lastDay.getDay();
        }
        for (var j = 0; j < maxDays; j++) {
            days.push(createDate());
        }
        this.days = days;
        this.checkNavigationButtons();
        this.propagateChange(this.projectScope);
    };
    MultipleDatePickerComponent.prototype.findArrayofDays = function () {
        console.log('this.projectScope = ' + this.projectScope);
    };
    MultipleDatePickerComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'multiple-date-picker',
                    template: template_1.DEFAULT_TEMPLATE,
                    styles: [template_1.DEFAULT_STYLES],
                    providers: [
                        {
                            provide: forms_1.NG_VALUE_ACCESSOR,
                            useExisting: core_1.forwardRef(function () { return MultipleDatePickerComponent; }),
                            multi: true
                        }
                    ]
                },] },
    ];
    /** @nocollapse */
    MultipleDatePickerComponent.ctorParameters = function () { return []; };
    MultipleDatePickerComponent.propDecorators = {
        'highlightDays': [{ type: core_1.Input },],
        'dayClick': [{ type: core_1.Input },],
        'dayHover': [{ type: core_1.Input },],
        'rightClick': [{ type: core_1.Input },],
        'monthChanged': [{ type: core_1.Input },],
        'fontAwesome': [{ type: core_1.Input },],
        'matIcons': [{ type: core_1.Input },],
        'monthClick': [{ type: core_1.Input },],
        'weekDaysOff': [{ type: core_1.Input },],
        'allDaysOff': [{ type: core_1.Input },],
        'daysAllowed': [{ type: core_1.Input },],
        'disableNavigation': [{ type: core_1.Input },],
        'disallowBackPastMonths': [{ type: core_1.Input },],
        'disallowGoFuturMonths': [{ type: core_1.Input },],
        'showDaysOfSurroundingMonths': [{ type: core_1.Input },],
        'cssDaysOfSurroundingMonths': [{ type: core_1.Input },],
        'fireEventsForDaysOfSurroundingMonths': [{ type: core_1.Input },],
        'disableDaysBefore': [{ type: core_1.Input },],
        'disableDaysAfter': [{ type: core_1.Input },],
        'changeYearPast': [{ type: core_1.Input },],
        'changeYearFuture': [{ type: core_1.Input },],
        'month': [{ type: core_1.Input },],
        'projectScope': [{ type: core_1.Input },],
        'sundayFirstDay': [{ type: core_1.Input },],
        '_projectScope': [{ type: core_1.Input },],
    };
    return MultipleDatePickerComponent;
}());
exports.MultipleDatePickerComponent = MultipleDatePickerComponent;
