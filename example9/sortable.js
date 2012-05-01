(function () {

    var templateEngine = new ko.nativeTemplateEngine();

    templateEngine.addTemplate = function(templateName, templateMarkup) {
        document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "<" + "/script>");
    };

    templateEngine.addTemplate("sortable_grid", "\
        <table class=\"table table-bordered table-condensed\">\
            <thead>\
                <tr data-bind=\"foreach: columns\">\
                    <th>\
                        <a href=\"#\" data-bind=\"text: name, click: $parent.sorter().changeSort\"></a> \
                        <i data-bind=\"attr: { class: $data === $parent.sorter().by() ? ('icon-arrow-'+$parent.sorter().order()) : '' }\"></i>\
                    </th>\
                </tr>\
            </thead>\
            <tbody data-bind=\"foreach: sortedData\">\
                <tr data-bind=\"foreach: $parent.columns\">\
                   <td data-bind=\"text: typeof field == 'function' ? field($parent) : $parent[field] \"></td>\
                </tr>\
            </tbody>\
        </table>"
    )


    var Sorter = function(column) {
        var self = this
        self.order = ko.observable('up')
        self.by    = ko.observable(column)

        self.sort = function(collection) {
            var sorted = collection.slice(0)
            var order  = self.order() == 'up' ? 1 : -1
            var field  = self.by().field
            var fn = function(a,b) { return a[field] < b[field] ? -order : order }
            return sorted.sort(fn)
        }

        self.changeSort = function(column) {
            if (self.by() === column) {
                self.order(self.order() == 'up' ? 'down' : 'up')
            } else {
                self.by(column)
                self.order('up')
            }
        }
     }



    ko.sortableGrid = {
        ViewModel: function(config) {
            var self = this
            self.data      = config.data
            self.columns   = config.columns
            self.sorter    = ko.observable(new Sorter(self.columns[0]))

            self.sortedData = ko.computed(function() {
                return self.sorter().sort(self.data)
            })
        }
    }

    ko.bindingHandlers.sortableGrid = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {

            while(element.firstChild) {
                ko.removeNode(element.firstChild)
            }

            ko.renderTemplate("sortable_grid", valueAccessor(), { templateEngine: templateEngine }, element, "replaceNode");
        }
    }

})();
