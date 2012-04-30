accounting.settings = {
    currency: {
        symbol: "€",
        format: "%v %s",
        decimal: ",",
        thousand: ".",
        precision: 2
    },
    number: {
        precision: 0,
        thousand: ",",
        decimal: "."
    }
}

ko.extenders.formattable = function(target, options) {
    target.formatted = ko.observable();
    var format = function(newValue) {
        return target.formatted(accounting.formatMoney(newValue));
    }

    format(target);
    target.subscribe(format);
    return target;
}