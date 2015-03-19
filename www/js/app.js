// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    
    HomeView.prototype.template = Handlebars.compile($("#home-template").html());

    /*datastorage.initialize().done(function () {
        //console.log("Service initialized");
        router.addRoute('', function (){
            $('body').html(new HomeView().render().$el);
        });

        router.start();
        
    });*/

    router.addRoute('', function (){
        $('body').html(new HomeView().render().$el);
    });

    router.start();

    /* --------------------------------- Event Registration -------------------------------- */


    /* ---------------------------------- Local Functions ---------------------------------- */




}());