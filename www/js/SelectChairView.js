var avatarCoords = [0,0];
var avatarCellId = "0";

var SelectChairView = function () {

    this.initialize = function() {

    	// div wrapper for view, used to attach events
    	this.$el = $('<div/>');

        console.log("answers passed from survey are: " + localStorage.getItem("answerString"));
        
        // fetch grid from active test in db, populate and render grid
        getDocsWithQuery("wwystest", "tests_dev", JSON.stringify({"activeFlag":"true"}))
        .then(
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

        $('#submit-selection').prop('disabled', true);

        // click listener for submit button -- alert and save to db on submit
        this.$el.on('click', '#submit-selection', 
            function ()
            {
                verifySelection(0, 0, avatarCellId);

                // todo: this should save id to local storage instead of passing, maybe?
                saveTestData(avatarCellId);
                // and redirect to view for selecting chair
                window.location = "#thankyou";
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
	grid.id = 'grid';
	grid.name = 'bob';

    // creates the rows
    for (var r = 0; r < rows; ++r){
        var tr = grid.appendChild(document.createElement('tr'));
        
        // creates the columns
        for (var c = 0; c < cols; ++c){
            var cell = tr.appendChild(document.createElement('td'));
            // adds id to the cell
            cell.id = ++idCtr;
			cell.className = 'blank';

            for (var x in empChairArray)
            {
                if (r == empChairArray[x][0] && c == empChairArray[x][1])
                {
                    cell.className = 'unoccupied';
                    console.log()
                }
            }

            for (var x in occChairArray)
            {
                if (r == occChairArray[x][0] && c == occChairArray[x][1])
                {
                    cell.className = 'occupied';
                }
            }
        }
    }
	
	//TODO: Figure out how to store entrance coords and load avatar starting on entrance
	avatarCoords[0] = rows-1;
	var entranceCell = grid.rows[avatarCoords[0]].cells[avatarCoords[1]];
	entranceCell.className = 'entranceWithAvatar';
	entranceCell.name = 'entrance';


	
	// Click listeners for directional buttons to move avatar
	document.getElementById("left").addEventListener("click", function() {
		moveAvatar('left');
	});
	document.getElementById("right").addEventListener("click", function() {
		moveAvatar('right');
	});
	document.getElementById("down").addEventListener("click", function() {
		moveAvatar('down');
	});
	document.getElementById("up").addEventListener("click", function() {
		moveAvatar('up');
	});

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

function moveAvatar(direction) {
	// direction is a string passed in from html (up, down, left, right)
	grid = document.getElementById('grid');
	console.log("Move avatar " + direction);
	console.log("Current avatarCoords: " + avatarCoords);
	var tempAvatarCoords = [0,0];
	tempAvatarCoords[0] = avatarCoords[0];
	tempAvatarCoords[1] = avatarCoords[1];
	
	switch (direction) {
		case 'up':
			tempAvatarCoords[0]--;
			break;
		case 'down':
			tempAvatarCoords[0]++;
			break;
		case 'left': 
			tempAvatarCoords[1]--;
			break;
		case 'right':
			tempAvatarCoords[1]++;
			break;
		default:
			console.log("Invalid parameter to moveAvatar(direction)");
	}
	console.log("New avatarCoords: " + tempAvatarCoords);
	
	if (!(tempAvatarCoords[0] < 0 || tempAvatarCoords[0] > grid.rows.length-1 || tempAvatarCoords[1] < 0 || tempAvatarCoords[1] > grid.rows[0].cells.length-1)) {
		var oldCell = grid.rows[avatarCoords[0]].cells[avatarCoords[1]];
		var newCell = grid.rows[tempAvatarCoords[0]].cells[tempAvatarCoords[1]];
		console.log("oldCell:" + oldCell.id + "   newCell: " + newCell.id);
		
        if (newCell.className == "unoccupied") {
            $('#submit-selection').prop('disabled', false);
        } else {
            $('#submit-selection').prop('disabled', true);
        }

        if (newCell.className != 'occupied') {
			newCell.className += "WithAvatar";
			oldCell.className = oldCell.className.replace('WithAvatar','');
			avatarCoords = tempAvatarCoords;
            avatarCellId = newCell.id;
		}


	}
	else { console.log("Invalid avatar movement"); }
}


