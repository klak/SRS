var HomeView = function () {

	var employeeListView;

	this.initialize = function() {
		// div wrapper for view, used to attach events
		this.$el = $('<div/>');
		//this.$el.on('keyup', '.search-key', this.findByName);
		//employeeListView = new EmployeeListView();
		this.render();
	};

	this.render = function() {
        this.$el.html(this.template());
        //$('.content', this.$el).html(employeeListView.$el);
        return this;
    };

    /*this.findByName = function() {
        service.findByName($('.search-key').val()).done(function (employees) {
            employeeListView.setEmployees(employees);
        });
    };*/

    this.initialize();
}