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

class InvoiceItemModel

    constructor: ->
        @description = ko.observable('')
        @price = ko.observable(0)
        @quantity = ko.observable(1)
        @amount = ko.computed(( -> @price() * @quantity()), this)
        @amountFormatted = ko.computed(( ->
            accounting.formatMoney(@amount())
        ), this)


class InvoiceModel

    constructor: ->
        @invoiceNumber = ko.observable('2012-03-24-002')
        @items = ko.observableArray([new InvoiceItemModel])
        @subtotal = ko.computed(( ->
            @items().reduce(((t, item) -> t + item.amount()), 0)
        ), this)
        @subtotalFormatted = ko.computed(( ->
            accounting.formatMoney(@subtotal())
        ), this)
        @tax = ko.computed(( ->
            @subtotal() * 1.196
        ), this)
        @taxFormatted = ko.computed(( ->
            accounting.formatMoney(@tax())
        ), this)

    addItem: ->
        @items.push(new InvoiceItemModel())

invoice = new InvoiceModel()

ko.applyBindings(invoice)

$(".delete").live("click", () ->
    invoice.items.remove(ko.dataFor(this))
)




