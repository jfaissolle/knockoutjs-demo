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
                        <a href=\"#\" data-bind=\"text: name, click: $parent.changeSort\"></a> \
                        <i data-bind=\"attr: { class: $data === $parent.sort().by() ? ('icon-arrow-'+$parent.sort().order()) : '' }\"></i>\
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


    var Sort = function(column) {
        var self = this
        this.order = ko.observable('up')
        this.by    = ko.observable(column)

        this.compare = function() {
            var field = self.by().field
            if (self.order() == 'up') {
                return function(a,b) { return a[field] < b[field] ? -1 : 1 }
            } else {
                return function(a,b) { return a[field] < b[field] ? 1 : -1 }
            }
        }

        this.changeColumn = function (column) {
            this.by(column)
            this.order('up')
        }

        this.changeOrder = function() {
            this.order(this.order() == 'up' ? 'down' : 'up')
        }
     }



    ko.sortableGrid = {
        ViewModel: function(config) {
            var self = this
            self.data      = config.data
            self.columns   = config.columns
            self.sort      = ko.observable(new Sort(self.columns[0]))

            self.changeSort = function(column) {
                if (self.sort().by() === column) {
                    self.sort().changeOrder()
                } else {
                    self.sort().changeColumn(column)
                }
            }
 
            self.sortedData = ko.computed(function() {
                var sorted = self.data().slice(0)
                sorted.sort(self.sort().compare())
                return sorted
            })
        }
    }

    ko.bindingHandlers.sortableGrid = {
        update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var viewModel = valueAccessor(), allBindings = allBindingsAccessor();

            // Empty the element
            while(element.firstChild)
                ko.removeNode(element.firstChild);

            // Allow the default templates to be overridden
            var gridTemplateName = "sortable_grid"

            // Render the grid
            var gridContainer = element
            ko.renderTemplate(gridTemplateName, viewModel, { templateEngine: templateEngine }, gridContainer, "replaceNode");
        }
    }

})();
