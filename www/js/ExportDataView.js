var ExportDataView = function () {

	this.initialize = function() {
		// div wrapper for view, used to attach events
		this.$el = $('<div/>');

        // enable show/hide dashboard
        this.$el.on('click', '#menu-toggle', 
            function(e) {
                console.log("test");
                e.preventDefault();
                $("#wrapper", this.$el).toggleClass("toggled");
            });


		this.render();
	};

	this.render = function() {
        this.$el.html(this.template());
        return this;
    };

    this.initialize();
}