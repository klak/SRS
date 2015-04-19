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
            }
        );

        this.$el.on('click', '#export-all-results', 
            function(e) {
                exportAllResults();
            }
        );

        this.$el.on('click', '#export-all-tests', 
            function(e) {
                exportAllTests();
            }
        );

        this.$el.on('click', '#export-by-test-id', 
            function(e) {
                exportResultsByTestId();
            }
        );

		this.render();
	};

	this.render = function() {
        this.$el.html(this.template());
        return this;
    };

    this.initialize();
}

function exportAllResults()
{
    getAllDocuments("wwystest", "results_dev")
    .then(
        function(results) {
            var csvContent = "testId,chairChoice,surveyAnswers\n";
            for (var x in results)
            {
                var curResult = results[x];
                csvContent += curResult.testId + ",";
                csvContent += curResult.chairChoice + ",";

                for (var i in curResult.surveyAnswers)
                {
                    csvContent += curResult.surveyAnswers[i];
                    if (i != curResult.surveyAnswers.length - 1)
                    {
                        csvContent += ",";
                    }
                }

                csvContent += "\n";
            }

            var link = document.createElement("a");
            var fileName = "all_results.csv";

            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                var url = URL.createObjectURL(blob);            
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                link.style = "visibility:hidden";
            }

            if (navigator.msSaveBlob) { // IE 10+
               link.addEventListener("click", function (event) {
                 var blob = new Blob([csvContent], {
                   "type": "text/csv;charset=utf-8;"
                 });
               navigator.msSaveBlob(blob, fileName);
              }, false);
            }

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    );
}

function exportAllTests()
{
    getAllDocuments("wwystest", "tests_dev")
    .then(
        function(tests) {
            var csvContent = "testId,activeFlag,roomHeight,roomWidth,surveyQuestions\n";
            for (var x in tests)
            {
                var curTest = tests[x];
                csvContent += curTest._id.$oid + ",";
                csvContent += curTest.activeFlag + ",";
                csvContent += curTest.RoomLayout.height + ",";
                csvContent += curTest.RoomLayout.width + ",";

                for (var i in curTest.surveyQuestions.questions)
                {
                    csvContent += curTest.surveyQuestions.questions[i];
                    if (i != curTest.surveyQuestions.questions.length - 1)
                    {
                        csvContent += ",";
                    }
                }

                csvContent += "\n";
            }

            var link = document.createElement("a");
            var fileName = "all_tests.csv";

            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                var url = URL.createObjectURL(blob);            
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                link.style = "visibility:hidden";
            }

            if (navigator.msSaveBlob) { // IE 10+
               link.addEventListener("click", function (event) {
                 var blob = new Blob([csvContent], {
                   "type": "text/csv;charset=utf-8;"
                 });
               navigator.msSaveBlob(blob, fileName);
              }, false);
            }

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    );
}

function exportResultsByTestId() 
{
    var testId = document.getElementById("testId").value.toLowerCase().trim();
    getDocsWithQuery("wwystest", "results_dev", JSON.stringify({"testId":testId}))
    .then(
        function(results) {
            var csvContent = "testId,chairChoice,surveyAnswers\n";
            for (var x in results)
            {
                var curResult = results[x];
                csvContent += curResult.testId + ",";
                csvContent += curResult.chairChoice + ",";

                for (var i in curResult.surveyAnswers)
                {
                    csvContent += curResult.surveyAnswers[i];
                    if (i != curResult.surveyAnswers.length - 1)
                    {
                        csvContent += ",";
                    }
                }

                csvContent += "\n";
            }

            var link = document.createElement("a");
            var fileName = "test_" + testId + "_results.csv";

            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                var url = URL.createObjectURL(blob);            
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                link.style = "visibility:hidden";
            }

            if (navigator.msSaveBlob) { // IE 10+
               link.addEventListener("click", function (event) {
                 var blob = new Blob([csvContent], {
                   "type": "text/csv;charset=utf-8;"
                 });
               navigator.msSaveBlob(blob, fileName);
              }, false);
            }

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    );

}