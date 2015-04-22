var HomeView = function () {

    this.loginCount = 2;

	this.initialize = function() {
		// div wrapper for view, used to attach events
		this.$el = $('<div/>');

        this.$el.on('click', '#login-button', this.validateLogin);

		this.render();
	};

	this.render = function() {
        this.$el.html(this.template());

        return this;
    };

    this.validateLogin = function() {

        var un = document.myform.username.value;
        var pw = document.myform.pword.value;
		
        console.log("entered username is: ", un);
        console.log("entered password is: ", pw);

        var shaObj = new jsSHA(pw+"uWY6tf87eEqddV2", "TEXT");
        var hash = shaObj.getHash("SHA-512","HEX");
        getDocsWithQuery("wwystest", "login_dev", JSON.stringify({"password":hash}))
        .then(
            function(logins) {
                
                var validLogin = false;
                for (x in logins)
                {
                    if (un == logins[x].username) {
                        validLogin = true;
                        break;
                    }
                }

                console.log("valid: " + validLogin);

                if (validLogin) {
                    window.location = "#adminHome";
                    return false;
                }

                var t = " tries";
                if (loginCount == 1) {t = " try"}

                if (loginCount >= 1) {
                    alert ("Invalid username and/or password.  You have " + loginCount + t + " left.");
                    document.myform.username.value = "";
                    document.myform.pword.value = "";
                    setTimeout("document.myform.username.focus()", 25);
                    setTimeout("document.myform.username.select()", 25);
                    loginCount--;
                }

                else {
                    alert ("Still incorrect! You have no more tries left!");
                    document.myform.username.value = "No more tries allowed!";
                    document.myform.pword.value = "";
                    document.myform.username.disabled = true;
                    document.myform.pword.disabled = true;
                    return false;
                }
            }
        );
    }

    this.initialize();
}

var loginCount = 2;