var ThankYouView = function () {


	this.initialize = function() {
		// div wrapper for view, used to attach events
		this.$el = $('<div/>');

		this.render();
	};

	this.render = function() {
        this.$el.html(this.template());
        return this;
    };

    this.initialize();
}
