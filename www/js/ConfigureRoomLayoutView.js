var ConfigureRoomLayoutView = function () {
    
    this.grid = function() {

        var counter = 0;
        console.log("in grid()...");
        // Grabs the number from the form in the height box
        //var height = document.getElementById("heightInput").value;
        var height = $("#heightInput", this.$el).val();
        console.log("height entered is: ", height);

        //Grabs the number from the form in the width box
        //var width = document.getElementById("widthInput").value;
        var width = $("#widthInput", this.$el).val();
        console.log("width entered is: ", width);
        
        var lastClicked;

        var grid = createClickableGrid(height, width,
                    function(el, row, col, i)
                    {
                        console.log("You clicked on element:", el);
                        console.log("You clicked on row:", row);
                        console.log("You clicked on col:", col);
                        console.log("You clicked on item #:", i);
                  

                        // Uses the class name to determine if the box has been clicked
                  
                        if (el.className == '') {
                            el.className = 'clicked1';
                        } else if (el.className == 'clicked1') {
                            el.className = 'clicked2';
                        } else if (el.className == 'clicked2') {
                            el.className = '';
                        }
                    }
        );

        //prints the array
        //var testGrid = document.body.appendChild(grid);
        $("#test", this.$el).html(grid);

        localStorage.setItem('gridHeight', height);
        localStorage.setItem('gridWidth', width);

    };

	this.initialize = function() {
        var survey = JSON.parse(localStorage.getItem("surveyQuestions"));
        console.log("survey JSON is: ");
        console.log("answer types:" + survey.answerTypes);
        console.log("answer choices: " + survey.answerChoices);
        console.log("questions: " + survey.questions);

		// div wrapper for view, used to attach events
		this.$el = $('<div/>');
		//this.$el.on('keyup', '.search-key', this.findByName);
		//employeeListView = new EmployeeListView();

        // enable show/hide dashboard
        this.$el.on('click', '#menu-toggle', 
            function(e) {
                console.log("test");
                e.preventDefault();
                $("#wrapper", this.$el).toggleClass("toggled");
            });

        // button for generating grid from coords
        this.$el.on('click', '#generate-grid', this.grid);

        // button for generating grid from coords
        this.$el.on('click', '#save-grid', saveTest);

		this.render();
	};

	this.render = function() {
        this.$el.html(this.template());
        //$('.content', this.$el).html(employeeListView.$el);
        return this;
    };



    this.initialize();

    // TODO: stick javascript that configure room needs in here somewhere.
    // TODO: build some sort of structure around local storage???
}

var createClickableGrid = function(rows, cols, callback) 
{
    console.log("in clickableGrid...");

    var i = 0;
    var grid = document.createElement('table');
    
    //grid.id = 'grid-table';
    console.log("setting id of grid table...");

    grid.setAttribute("id", "grid-table");
    grid.className = 'grid';
    

    //creates the rows
    for (var r = 0; r < rows; ++r)
    {
        var tr = grid.appendChild(document.createElement('tr'));
      
        //creates the columns
        for (var c = 0; c < cols; ++c)
        {
            var cell = tr.appendChild(document.createElement('td'));
            //adds numbers to the cells
            //cell.innerHTML = ++i;
            cell.id = ++i;

            cell.addEventListener('click', 
                (function(el, r, c, i) {
                    return function() {
                        callback(el,r,c,i);
                    };
                })

            (cell,r,c,i),false);
        }
    }
    
    return grid;
};

var saveTest = function()
{
    // TODO: in this func we are actually going to save to DB along with survey

    var emptyChairIds = new Array();
    var occupiedChairIds = new Array();

    var emptyChairTuples = new Array();
    var occupiedChairTuples = new Array();

    // var table = document.getElementById('table');
    var table = document.getElementById('grid-table');
    
    for (var r = 0, n = table.rows.length; r < n; r++) 
    {
        for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
            console.log(table.rows[r].cells[c].className);

            if (table.rows[r].cells[c].className == 'clicked1'){
              emptyChairIds.push(table.rows[r].cells[c].id);
              var tempTuple = [];
              tempTuple.push(r);
              tempTuple.push(c);
              emptyChairTuples.push(tempTuple);
            }
            else if (table.rows[r].cells[c].className == 'clicked2'){
              occupiedChairIds.push(table.rows[r].cells[c].id);
              var tempTuple = [];
              tempTuple.push(r);
              tempTuple.push(c);
              occupiedChairTuples.push(tempTuple);
            }
        }
    }

    var empIdsString = emptyChairIds.toString();
    var occIdsString = occupiedChairIds.toString();

    var empTuplesJson = JSON.stringify(emptyChairTuples);
    var occTuplesJson = JSON.stringify(occupiedChairTuples);

    console.log("empTuplesJson: ", empTuplesJson);
    console.log("occTuplesJson: ", occTuplesJson);

    console.log("saving to empChairArray: ", empIdsString);
    console.log("saving to occChairArray: ", occIdsString);


    localStorage.setItem('empChairIds', empIdsString);
    localStorage.setItem('occChairIds', occIdsString);

    // this is the survey we previous created
    var survey = JSON.parse(localStorage.getItem("surveyQuestions"));

    var fullTest = new Object();
    fullTest.RoomLayout = new Object();

    fullTest.activeFlag = "true";
    fullTest.surveyQuestions = survey;

    fullTest.RoomLayout.height = localStorage.getItem("gridHeight");
    fullTest.RoomLayout.width = localStorage.getItem("gridWidth");
    fullTest.RoomLayout.emptyChairs = emptyChairTuples;
    fullTest.RoomLayout.occupiedChairs = occupiedChairTuples;
    

    console.log("full test to save to db is: " + JSON.stringify(fullTest));


    insertDocument("wwystest", "tests_dev", fullTest).then(
        function() {
            console.log("test saved to database successfully.");
        });

}