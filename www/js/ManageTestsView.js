var ManageTestsView = function () {

	this.initialize = function() {
		// div wrapper for view, used to attach events
		this.$el = $('<div/>');

        getAllDocuments("wwystest", "tests_dev")
        .then(
            function(tests) {
                for (var x in tests)
                {
                    var testDiv = document.createElement('div');
                    //testDiv.id = tests[x]._id.$oid;

                    var testHtml = "";
                    testHtml += "Test ID: " + tests[x]._id.$oid + "\n<br>\n";
                    testHtml += "<p>Active: " + tests[x].activeFlag + "</p>";
                    
                    var testQuestions = tests[x].surveyQuestions.questions;
                    var questionNum = 1;
                    for (var i in testQuestions)
                    {
                        testHtml += "<p>(Q" + questionNum + ") " + testQuestions[i] + "</p>";
                        questionNum++;
                    }

                    testHtml += "<button class='activate-test' id='" 
                                + tests[x]._id.$oid + "'>Activate This Test</button>";
                    testHtml += "<br><br>";

                    testDiv.innerHTML = testHtml;
                    document.getElementById("list-tests").appendChild(testDiv);
                }
            }
        );

        // enable show/hide dashboard
        this.$el.on('click', '#menu-toggle', 
            function(e) {
                console.log("test");
                e.preventDefault();
                $("#wrapper", this.$el).toggleClass("toggled");
            });

        this.$el.on('click', '.activate-test',
            function(e) {
                activateTest(e.target.id);
            });

		this.render();
	};

	this.render = function() {
        this.$el.html(this.template());
        return this;
    };

    this.initialize();
}

function activateTest(id)
{
    //alert("you clicked to activate test with id: " + id);

    // first, let's see if there are any active tests in db (there should be at most 1)
    getDocsWithQuery("wwystest", "tests_dev", JSON.stringify({"activeFlag":"true"}))
    .then(
        function(activeTests) {
            if (activeTests.length > 1) 
            {
                alert("Something has gone wrong with the database. Please contact a developer for assistance.");
                window.location = "#home";
            }

            if (activeTests.length == 0)
            {
                console.log("no active test currently, so no need to deactive old one.")
                updateDocById("wwystest", "tests_dev", id, {"activeFlag":"true"})
                .then(
                    function() {
                        alert("test with id " + id + " activated successfully.");
                    }
                ); 
            }

            var activeTest = activeTests[0];
            var activeId = activeTest._id.$oid;
            console.log("id of active test is:" + activeId);

            // now, let's deactive the current active test
            updateDocById("wwystest", "tests_dev", activeId, {"activeFlag":"false"})
            .then(
                function() {
                    console.log("successfully de-activated old active test.");

                    // and now update the test to be activated.
                    updateDocById("wwystest", "tests_dev", id, {"activeFlag":"true"})
                    .then(
                        function() {
                            alert("test with id " + id + " activated successfully.");
                            location.reload();
                        }
                    );
                }
            )
        }

    );

}