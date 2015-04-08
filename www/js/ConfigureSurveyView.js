var ConfigureSurveyView = function () {
    

	this.initialize = function() {
		  // div wrapper for view, used to attach events
		  this.$el = $('<div/>');
 
      // enable show/hide dashboard
      this.$el.on('click', '#menu-toggle', 
          function(e) {
              console.log("test");
              e.preventDefault();
              $("#wrapper", this.$el).toggleClass("toggled");
          });

      this.$el.on('click', '#question', 
          function ()
          {
              addAllInputsHelper('dynamicInputs', 'text', true);
          });

      this.$el.on('click', '#answer', 
          function()
          {
              addAllInputs('dynamicInputs', document.myForm.inputSelect.value, false);
          });

      this.$el.on('click', "#finish", 
          function ()
          {
              saveSurvey();
          });

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
          }
          // Sends an alert if a question is tried to be made and doesn't have an answer option
          else {
              alert("please add a way to answer the question");
          }
    }

    else {
        switch(inputType) {
            case 'text':
                newdiv.innerHTML = "</br>" + "<input type='text' id='q" 
                + counterQuestion + "a" + countAnswers + "'>";

                tempAnswerTypes[tempAnswerTypes.length] = "text";
                countAnswers++;
                break;
            case 'radio':
                newdiv.innerHTML = "</br>" + "<input type='radio' >" 
                + "<input text='text' id='q" + counterQuestion + "a" + countAnswers + "'>";

                tempAnswerTypes[tempAnswerTypes.length] = "radio";
                countAnswers++;
                break;
            case 'checkbox':
                newdiv.innerHTML = "</br>" + "<input type='checkbox' >" 
                + "<input text='text' id='q" + counterQuestion + "a" + countAnswers + "'>";

                tempAnswerTypes[tempAnswerTypes.length] = "checkbox";
                countAnswers++;
                break;
            case 'textarea':
                newdiv.innerHTML = "</br>" + "<textarea id='q" + counterQuestion 
                + "a" + countAnswers + "'>type here...</textarea>";

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