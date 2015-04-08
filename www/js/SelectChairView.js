var SelectChairView = function () {

	  this.initialize = function() {

    		// div wrapper for view, used to attach events
    		this.$el = $('<div/>');

        console.log("answers passed from survey are: " + localStorage.getItem("answerString"));
        
        // fetch grid from active test in db, populate and render grid
        getDocsWithQuery("wwystest", "tests_dev", JSON.stringify({"activeFlag":"true"})).
            then(
                function(tests) {
                    var activeTest = tests[0];
                    //console.log("num tests:" + tests.length);
                    //console.log("test:" + JSON.stringify(activeTest));
                    console.log("room height: " + activeTest.RoomLayout.height);
                    console.log("room width: " + activeTest.RoomLayout.width);
                    console.log("empty chairs: " + activeTest.RoomLayout.emptyChairs[0]);
                    console.log("occupied chairs: " + activeTest.RoomLayout.occupiedChairs[0]);
					
					// NOTE: emptyChairs and occupiedChairs are both arrays of size 2 int arrays.
					// The inner arrays are coords of a chair (e.g. [[0,2], [4,3]])
					
                    // populate and display room here
                    renderRoom(activeTest.RoomLayout.height,
                                activeTest.RoomLayout.width,
                                activeTest.RoomLayout.emptyChairs,
                                activeTest.RoomLayout.occupiedChairs);
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

function renderRoom(height, width, emptyChairs, occupiedChairs) {

    var counter = 0;

    var lastClicked;

    var grid = generateGrid(height, width, emptyChairs, occupiedChairs);

    $("#test-room").html(grid);
}

function generateGrid( rows, cols, empChairArray, occChairArray) {
    
    var idCtr = 0;

    var grid = document.createElement('table');
    grid.className = 'grid';

    // creates the rows
    for (var r = 0; r < rows; ++r){
        var tr = grid.appendChild(document.createElement('tr'));
        
        // creates the columns
        for (var c = 0; c < cols; ++c){
            var cell = tr.appendChild(document.createElement('td'));
            // adds id to the cell
            cell.id = ++idCtr;

            for (var x in empChairArray)
            {
                if (r == empChairArray[x][0] && c == empChairArray[x][1])
                {
                    cell.className = 'clicked1';
                    console.log()
                }
            }

            for (var x in occChairArray)
            {
                if (r == occChairArray[x][0] && c == occChairArray[x][1])
                {
                    cell.className = 'clicked2';
                }
            }
        }
    }
	
	//TODO: Figure out how to store entrance coords and load avatar starting on entrance
	var l = grid.rows.length;
	var entranceCell = grid.rows[l-1].cells[5];
	entranceCell.className = 'entrance';
	entranceCell.name = 'entrance';

    // add click listener for all the grid places
    $("#test-room").on('click', 'td',
        function()
        {
            verifySelection(0, 0, $(this).attr('id'));

            // todo: this should save id to local storage instead of passing, maybe?
            saveTestData($(this).attr('id'));
            // and redirect to view for selecting chair
            window.location = "#thankyou";
        }
    );

    return grid;
}

function verifySelection(row, col, id)
{
    alert("you selected seat with id " + id);
    // TODO: this should actually ask "are you sure?" or something, and
    // go back if the user says no.
}

function saveTestData(chairId)
{
    var surveyResults = JSON.parse(localStorage.getItem("answerString"));

    var answers = [];

    for (var x in surveyResults)
    {
        //console.log("adding " + surveyResults[x].value + " to list of answers");
        answers.push(surveyResults[x].value);

    }

    // build up our result object to send to the database
    var result = new Object();
    result.surveyAnswers = answers;
    result.chairChoice = chairId;

    //resultString = JSON.stringify(result);

    insertDocument("wwystest", "results_dev", result).
      then(function() {
              console.log("saved to db: " + JSON.stringify(result))
          }
      );


}


