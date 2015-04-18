var ConfigureSurveyView = function () {
    

	this.initialize = function() {
		  // div wrapper for view, used to attach events
		  this.$el = $('<div/>');
      countAnswers = 0;
      countQuestion = 0;
      questionsArray = [];
      answerTypesArray = [];
      tempAnswerTypes = [];
      answerChoicesArray = [];
      numberArr = []; // Contains the number of answer choices per question.

      firstQuest = true
      answerBool  = false;
      inputType = "";

      // enable show/hide dashboard
      this.$el.on('click', '#menu-toggle', 
          function(e) {
              console.log("test");
              e.preventDefault();
              $("#wrapper", this.$el).toggleClass("toggled");
          }
      );

      this.$el.on('click', '#question', 
          function ()
          {
              addAllInputsHelper('dynamicInputs', 'text', true);
          }
      );

      this.$el.on('click', '#answer', 
          function()
          {
              addAllInputs('dynamicInputs', document.myForm.inputSelect.value, false);
          }
      );

      this.$el.on('click', "#finish", 
          function ()
          {
              saveSurvey();
          }
      );

      this.$el.on('click', ".btn-remove", 
          function ()
          {
              removeAnswerChoice($(this));
          }
      );

		  this.render();
	};

	this.render = function() {
      this.$el.html(this.template());
      return this;
  };

  this.initialize();

    // TODO: stick javascript that configure room needs in here somewhere.
    // TODO: build some sort of structure around local storage???
}


var countAnswers = 0; // number of answers per question
var counterQuestion = 0; // Number of questions.

// Arrays that will contain survey data (will be sent to db)
var questionsArray = [];
var answerTypesArray = [];
var tempAnswerTypes = [];
var answerChoicesArray = [];
var numberArr = []; // Contains the number of answer choices per question.

var firstQuest = true
var answerBool  = false;
var inputType = "";

function selectInputType() {
    inputType = document.getElementById("inputSelect").value;
    switch(inputType) {
        case 'text':
          return 'text';
        case 'radio':
          return 'radio';
        case 'checkbox':
          return 'checkbox';
        case 'textarea':
          return 'textarea';
    }
}

function removeAnswerChoice(removeButton) // passed the remove button for the answer to remove
{
    var btnId = $(removeButton).attr("id");
    console.log(btnId);

    var questionNum = parseInt(btnId.substring(8,9));
    var answerNum = parseInt(btnId.substring(10,11));

    if (questionNum == counterQuestion) // we are on the latest question
    {
        // remove item answerNum from tempAnswerTypes
        tempAnswerTypes.splice(answerNum, 1);
        countAnswers--;
        console.log("removing from latest question answer option " + answerNum)
    } else // if this is not the latest question, we have to adjust a bunch of things
    {
        console.log("removing from question num " + questionNum + " answer number " + answerNum);

        // remove item answerNum from answerTypes[questionNum-1]
        console.log("answertypes array at questNum-1 was:    " + answerTypesArray[questionNum]);
        answerTypesArray[questionNum].splice(answerNum, 1)
        console.log("answertypes array at questNum-1 is now: " + answerTypesArray[questionNum]);

        // reset id's of later answer choices -- lower the answer numbers in the id's
        for (var i = answerNum+1; i <= numberArr[questionNum-1] - 1; i++)
        {
            console.log("going to reset id q" + questionNum + "a" + i);
            var newAnswerNum = i - 1;
            console.log("to q" + questionNum + "a" + newAnswerNum);

            // update id for both answer div itself and the remove button!
            var oldId = "q" + questionNum + "a" + i;
            var newId = "q" + questionNum + "a" + newAnswerNum;
            var answerDiv = document.getElementById(oldId);
            answerDiv.id = newId;

            var oldRemBtn = document.getElementById("remove-" + oldId);
            oldRemBtn.id = "remove-" + newId; 
        }

        numberArr[questionNum-1]--; 
    }

    // finally, remove the visible answer div itself
    $(removeButton).parent('div').remove();

}

function newAnswerHelper() {
    addAllInputs("dynamicInputs", inputType, false);
}


/*
  Helper function that is called when the "New Question" button is pressed.
  Stores the data collected from addAllInputs() and stores it in a temporary array.
  The temporary array added to the answerTypesArray[].
  The temporary array is then emptied.
*/
function addAllInputsHelper(divName, inputType, questionBool){
    inputType = selectInputType(inputType);
    addAllInputs(divName, inputType, questionBool);
    answerTypesArray[answerTypesArray.length] = tempAnswerTypes;
    //console.log(answerTypesArray);
    tempAnswerTypes = [];
}


/*
  Main function for adding new questions and responses.
*/
function addAllInputs(divName, inputType, questionBool) {
    var newdiv = document.createElement('div');

    if (questionBool == true) {
          
          // Ensures that no question is added without an answer option
          if (firstQuest == true || answerBool == true) {
              var htmlString = "</br>(" + (counterQuestion + 1) + ") " + "<input id='newDiv" 
              + counterQuestion + "' type='text' name='myInputs[]'>";
              console.log(htmlString);

              newdiv.innerHTML = htmlString;

              if (countAnswers != 0) {
                  numberArr.push(countAnswers);
              }

              counterQuestion++;
              countAnswers = 0;
              firstQuest = false;
              answerBool = false;
          } else { // Sends an alert if a question is tried to be made and doesn't have an answer option
              alert("Please add at least one answer choice to the question.");
          }
    } else {
        switch(inputType) {
            case 'text':
                newdiv.innerHTML = "</br>" + "<input type='text' id='q" 
                + counterQuestion + "a" + countAnswers + "'><button type='button' id='remove-q" 
                + counterQuestion + "a" + countAnswers + "' class='btn btn-xs btn-remove'>" 
                + "<span class='glyphicon glyphicon-remove'>" +"</span></button>";

                tempAnswerTypes[tempAnswerTypes.length] = "text";
                countAnswers++;
                break;
            case 'radio':
                newdiv.innerHTML = "</br>" + "<input type='radio' >" 
                + "<input text='text' id='q" + counterQuestion + "a" + countAnswers + "'><button type='button' id='remove-q" 
                + counterQuestion + "a" + countAnswers + "' class='btn btn-xs btn-remove'>" 
                + "<span class='glyphicon glyphicon-remove'>" +"</span></button>";

                tempAnswerTypes[tempAnswerTypes.length] = "radio";
                countAnswers++;
                break;
            case 'checkbox':
                newdiv.innerHTML = "</br>" + "<input type='checkbox' >" 
                + "<input text='text' id='q" + counterQuestion + "a" + countAnswers + "'><button type='button' id='remove-q" 
                + counterQuestion + "a" + countAnswers + "' class='btn btn-xs btn-remove'>" 
                + "<span class='glyphicon glyphicon-remove'>" +"</span></button>";

                tempAnswerTypes[tempAnswerTypes.length] = "checkbox";
                countAnswers++;
                break;
            case 'textarea':
                newdiv.innerHTML = "</br>" + "<textarea id='q" + counterQuestion 
                + "a" + countAnswers + "'>type here...</textarea><button type='button' id='remove-q" 
                + counterQuestion + "a" + countAnswers + "' class='btn btn-xs btn-remove'>" 
                + "<span class='glyphicon glyphicon-remove'>" +"</span></button>";

                tempAnswerTypes[tempAnswerTypes.length] = "textarea";
                countAnswers++;
                break;
        }
        answerBool = true;
    }

    // Disables the answer button unless there has been a question

    if (questionBool == true) {
        answer.disabled = false;
    }

    console.log("count answers is: " + countAnswers);
    document.getElementById(divName).appendChild(newdiv);
    console.log(document.getElementById("newDiv0").value);
}


function saveSurvey()
{
    if(countAnswers != 0) {
        numberArr.push(countAnswers);
    }

    //console.log(numberArr);
    for(i = 0; i < counterQuestion; i++)
    {
        console.log("question " + i + " has " + tempNum + " answers")
        var tempAnswerChoicesArray = [];
        var tempNum = numberArr.shift();
        console.log("temp num is: " + tempNum);
        console.log(tempNum);
        for(k = 0; k < tempNum; k++)
        {
            console.log("fetching answer: q" + (i + 1) + "a" + k);
            console.log("value is: " + document.getElementById("q" + (i + 1) + "a" + k).value)
            tempAnswerChoicesArray.push(document.getElementById("q" + (i + 1) + "a" + k).value);
        }
        answerChoicesArray.push(tempAnswerChoicesArray);
        questionsArray.push(document.getElementById("newDiv" + i).value);
        //console.log(answerChoicesArray);
    }
    //console.log(questionsArray);
    saveSurveyToLocalStorage();
    window.location = "#configureRoom";
}

function saveSurveyToLocalStorage() {
    answerTypesArray[answerTypesArray.length] = tempAnswerTypes;
    answerTypesArray.shift();
    console.log("answer types:" + JSON.stringify(answerTypesArray));
    console.log("answer choices:" + JSON.stringify(answerChoicesArray));
    console.log("questions:" + JSON.stringify(questionsArray));

    // create new Object to put survey attributes in
    var surveyQuestions = new Object();
    surveyQuestions.questions = questionsArray;
    surveyQuestions.answerTypes = answerTypesArray;
    surveyQuestions.answerChoices = answerChoicesArray;

    // turn survey Object into string we can save in localStorage
    surveyString = JSON.stringify(surveyQuestions);
    localStorage.setItem("surveyQuestions", surveyString);
}