var TakeSurveyView = function () {
    

	this.initialize = function() {
		// div wrapper for view, used to attach events
		this.$el = $('<div/>');

    getDocsWithQuery("wwystest", "tests_dev", JSON.stringify({"activeFlag":"true"})).
        then(
          function(tests) {
            var activeTest = tests[0];
            console.log("num tests:" + tests.length);
            console.log("test:" + JSON.stringify(activeTest));
            console.log("questions:" + activeTest.surveyQuestions.questions);
            console.log("answer types:" + activeTest.surveyQuestions.answerTypes);
            console.log("answer choices:" + activeTest.surveyQuestions.answerChoices);
            
            // populate question and answers into html here.
          }
        );

    // todo: fetch survey from active test, populate questions

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

var counter = 1; // adds the number to the questions
var limit = 3; // controls the number of questions

function addInput(divName){
     if (counter == limit)  {
          alert("You have reached the limit of adding " + counter + " inputs");
     }
     else {
          var newdiv = document.createElement('div');
          newdiv.innerHTML = "<br>"+"Question " + (counter + 1) + " <br><input type='text' name='myInputs[]'>";
          document.getElementById(divName).appendChild(newdiv);
          counter++;
     }
}

var firstQuest = true
var answerBool  = false;
var counterQuestion = 0;

function addAllInputs(divName, inputType, questionBool){
     var newdiv = document.createElement('div');


     if (questionBool == true){
          
          // Ensures that no question is added without an answer option
          if(firstQuest == true || answerBool == true){
               newdiv.innerHTML = "<br>(" + (counterQuestion + 1) + ") " + "<input type='text' name='myInputs[]'>";
               counterQuestion++;
               firstQuest = false;
               answerBool = false;
          }
          // Sends an alert if a question is tried to be made and doesn't have an answer option
          else {
               alert("please add a way to answer the question");
          }
     }

     else{
          switch(inputType) {
               case 'text':
                    newdiv.innerHTML = "<br>" + "<input type='text' name='myInputs[]'>";
                    break;
               case 'radio':
                    newdiv.innerHTML = "<br>" + "<input type='radio' name='myRadioButtons[]'>" + "<input text='text'>";
                    break;
               case 'checkbox':
                    newdiv.innerHTML = "<br>" + "<input type='checkbox' name='myCheckBoxes[]'>" + "<input text='text'>";
                    break;
               case 'textarea':
                 newdiv.innerHTML = "<br>" + "<textarea name='myTextAreas[]'>type here...</textarea>";
                    break;
               }
               answerBool = true;
          }

     // Disables the answer button unless there has been a question

     if(questionBool == true){
          answer.disabled=false;
     }

     document.getElementById(divName).appendChild(newdiv);
}