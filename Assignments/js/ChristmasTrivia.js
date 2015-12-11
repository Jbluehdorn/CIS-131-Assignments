// JavaScript Document
var Categories = new Array();
GetTrivia();

//Holds the display image
var DispImage = new Image();
DispImage.src = "images/christmas/default.png";
DispImage.id = "TriviaImage";

var totalCorrect = 0;
var totalQuestions = 0;
var questionAnswered = false;

$(document).ready(function() {
	SetStartScreen();
});

/*==Functions==*/
//Loads the JSON file and parses the data into the array
function GetTrivia() {
	$.getJSON('json/Questions.json', function(data) {
		for(var i = 0; i < data.categories.length; i++) {
			Categories.push(new Category(data.categories[i].id, data.categories[i].name, data.categories[i].image, data.categories[i].description));
		}
		for(var i = 0; i < data.questions.length; i++) {
			var question = new Question(data.questions[i].question, data.questions[i].answers, data.questions[i].categoryId);
			for(var k = 0; k < Categories.length; k++) {
				if(question.categoryId === Categories[k].id) {
					Categories[k].questions.push(question);
				}
			}
		}
		console.log(Categories);
	});
}

//Loads the basic start screen
function SetStartScreen() {
	var board = $('#TriviaBoard');
	var menu = CreateMenu();
	var results = GetResults();
	
	var errorMessage = $('<div id="ErrorMessage">');
	errorMessage.append('*Please select an answer');
	
	board
		.append(menu)
		.append(DispImage)
		.append(errorMessage)
		.append(results);
}

function GetResults() {
	var results = $('<div id="Results">');
	results.append('Correct: ' + totalCorrect + '/' + totalQuestions);	
	return results;
}

//Builds the menu based on the array
function CreateMenu() {
	var menuHolder = $('<div id="menuDiv">');
	var menuHeader = $('<h5 id="menuHeader">');
	menuHeader.html('Select a category...');
	var menu = $('<ul>');
	for(var i = 0; i < Categories.length; i++){
		var element = $('<li>');
		$(element).append(Categories[i].name);	
		$(element).on('click', function() {
			var elements = $('#TriviaBoard li');
			for(var i = 0; i < elements.length; i++) {
				$(elements[i]).removeAttr('selected');
			}
			$(this).attr('selected', 'true');
			LoadTrivia(this);
		});
		$(menu).append(element);
	}
	menuHolder
		.append(menu)
		.append(menuHeader);
	return $(menuHolder);
}

//Loads the selcted trivia game
function LoadTrivia(selected) {
	var Trivia;
	for(var i = 0; i < Categories.length; i++) {
		if(Categories[i].name === $(selected).html()){
			Trivia = Categories[i];	
		}
	}
	
	$('#menuHeader').html(Trivia.description);
	$('#TriviaImage').replaceWith(Trivia.image);
	$('#TriviaBoard').append(CreateRandomQuestion(Trivia.questions));
}

// 1. Creates a Div
// 2. Picks a random question
// 3. Jumbles the order of the answers
// 4. Appends it all to the div
// 5. Returns the div
function CreateRandomQuestion(questions) {
	$('#questionDiv').remove();
	$('#ErrorMessage').hide();
	questionAnswered = false;
	var questionDiv = $('<div id="questionDiv">');
	
	var num = Math.floor(Math.random() * questions.length);
	var question = questions[num];
	var questionHeader = $('<h4>');
	questionHeader.append(question.question);
	
	var answers = new Array();
	var correctAnswer;
	//Randomizes the answers
	question.answers = shuffleArray(question.answers);
	
	//Builds objects based on the answers
	for(var i = 0; i < question.answers.length; i++) {
		if(question.answers[i] === question.correct) 
			correctAnswer = question.answers[i];
					
		var element = $('<div class="answer roundedCorners">');
		$(element).html(question.answers[i]);
		$(element).on('click', function() {
			if(!questionAnswered) {
				var answerObjs = $('.answer');
				for(var i = 0; i < answerObjs.length; i++) {
					$(answerObjs[i]).removeAttr('selected');
				}
				$(this).attr('selected', 'true');
			}
		});
		answers.push(element);
	}
	
	var answersUl = $('<ul id="answers">');
	for(var i = 0; i < answers.length; i++) {
		$(answersUl).append(answers[i]);
	}
	
	var ButtonDiv = $('<div id="Buttons">');
	
	var btnSubmit = $('<div class="btn btn-primary">');
	$(btnSubmit).on('click', function() {
		if(!questionAnswered)
			CheckAnswer(correctAnswer);
	});
	$(btnSubmit).append('Submit');
	
	var btnNewQuestion = $('<div class="btn btn-primary">');
	$(btnNewQuestion).on('click', function() {
		$('#TriviaBoard').append(CreateRandomQuestion(questions));
	});
	$(btnNewQuestion).append('New Question');
	
	$(ButtonDiv)
		.append(btnSubmit)
		.append(btnNewQuestion);
	
	
	//Appends the elements to the div
	$(questionDiv)
		.append(questionHeader)
		.append(answersUl)
		.append(ButtonDiv);
	
	return questionDiv;
}

//Checks if the answer is correct and updates fields accordingly
function CheckAnswer(CorrectAnswer) {
	var selected = $('.answer[selected]');
	if(!selected.length) {
		$('#ErrorMessage').show();
		return;
	}
	$('#ErrorMessage').hide();
			
	questionAnswered = true;
	totalQuestions++;
	var correct = selected.html() == CorrectAnswer;
	var answers = $('.answer');
	
	for(var i = 0; i < answers.length; i++) {
		if($(answers[i]).html() !== CorrectAnswer)
			$(answers[i]).fadeTo(400, 0.3);
	}
	
	if(correct) {
		totalCorrect++;
	} else {
		selected.attr('incorrect', 'true');
	}
	
	$('#Results').html(GetResults().html());
	
}

//Randomizes the array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

/*==Constructors==*/
function Category(id, name, image, description) {
	this.questions = new Array();
	this.id = id;
	this.name = name;
	this.image = new Image();
	this.image.src = image;
	this.image.id = 'TriviaImage';
	this.description = description;
}

function Question(question, answers, categoryId) {
	this.question = question;
	
	this.answers = new Array();
	for(var i = 0; i < answers.length; i++) {
		this.answers.push(answers[i].value);	
		if(answers[i].correct) {
			this.correct = answers[i].value;
		}
	}
	this.categoryId = categoryId;
}
