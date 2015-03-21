// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    
    HomeView.prototype.template = Handlebars.compile($("#home-template").html());
    AdminHomeView.prototype.template = Handlebars.compile($("#admin-home-template").html());
    ConfigureRoomLayoutView.prototype.template = Handlebars.compile($("#configure-room-template").html());
    ViewRoomView.prototype.template = Handlebars.compile($("#view-room-template").html());

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

    router.addRoute('home', function (){
        $('body').html(new HomeView().render().$el);
    });

    router.addRoute('adminHome', function (){
        $('body').html(new AdminHomeView().render().$el);
    });

    router.addRoute('configureRoom', function (){
        $('body').html(new ConfigureRoomLayoutView().render().$el);
    }); 

    router.addRoute('viewRoom', function (){
        $('body').html(new ViewRoomView().render().$el);
    }); 

    router.start();

    /* --------------------------------- Event Registration -------------------------------- */


    /* ---------------------------------- Local Functions ---------------------------------- */



}());