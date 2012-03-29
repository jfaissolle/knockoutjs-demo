accounting.settings = {
    currency: {
        symbol : "€",
        format: "%v %s",
        decimal : ",",
        thousand: ".",
        precision : 2
    },
    number: {
        precision : 0,
        thousand: ",",
        decimal : "."
    }
}

# Extend observable to be have a formatted value (for currency formatting)
ko.extenders.formattable = (target, options) ->
    target.formatted = ko.observable()
    format = (newValue) ->
        target.formatted(accounting.formatMoney(newValue))

    format(target)
    target.subscribe(format)

    target



class InvoiceItemModel

    constructor: ->
        @description = ko.observable('')
        @price = ko.observable(0)
        @quantity = ko.observable(1)
        @amount = ko.computed(( ->
            @price() * @quantity()
        ), this).extend({ formattable: null })

class InvoiceModel
    
    constructor: ->
        @invoiceNumber = ko.observable('2012-03-24-002')
        @items = ko.observableArray([new InvoiceItemModel])

        @subtotal = ko.computed(( ->
            @items().reduce(((t, item) -> t + item.amount()), 0)
        ), this).extend({ formattable: null })

        @tax = ko.computed(( ->
            @subtotal() * 1.196
        ), this).extend({ formattable: null })

    addItem: => @items.push(new InvoiceItemModel())

    removeItem: (item) => @items.remove(item)
    
    popup: (elem) ->
        if (elem.nodeType == Node.ELEMENT_NODE) 
            $(elem).hide().fadeIn()
 
    popout: (elem) ->
        if (elem.nodeType == Node.ELEMENT_NODE) 
            $(elem).fadeOut( -> $(elem).remove())

invoice = new InvoiceModel()

ko.applyBindings(invoice)




