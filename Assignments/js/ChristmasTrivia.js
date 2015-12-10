// JavaScript Document
var Categories = new Array();
GetTrivia();
var DispImage = new Image();
DispImage.src = "images/christmas/default.png";
DispImage.id = "TriviaImage";

$(document).ready(function() {
	SetStartScreen();
});

/*==Functions==*/
//Loads the JSON file and parses the data into the array
function GetTrivia() {
	$.getJSON('json/Questions.json', function(data) {
		for(var i = 0; i < data.categories.length; i++) {
			Categories.push(new Category(data.categories[i].id, data.categories[i].name, data.categories[i].image));
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
	board.append(menu);
	board.append(DispImage);
}

//Builds the menu based on the array
function CreateMenu() {
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
	return $(menu);
}

//Loads the selcted trivia game
function LoadTrivia(selected) {
	var Trivia;
	for(var i = 0; i < Categories.length; i++) {
		if(Categories[i].name === $(selected).html()){
			Trivia = Categories[i];	
		}
	}
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
	var questionDiv = $('<div id="questionDiv">');
	
	var num = Math.floor(Math.random() * questions.length);
	var question = questions[num];
	var questionHeader = $('<h4>');
	questionHeader.append(question.question);
	
	var answers = new Array();
	var correctAnswer;
	question.answers = shuffleArray(question.answers);
	console.log(questions.answers);
	for(var i = 0; i < question.answers.length; i++) {
		if(question.answers[i] === question.correct) 
			correctAnswer = question.answers[i];
					
		var element = $('<div class="answer roundedCorners">');
		$(element).html(question.answers[i]);
		$(element).on('click', function() {
			var answerObjs = $('.answer');
			for(var i = 0; i < answerObjs.length; i++) {
				$(answerObjs[i]).removeAttr('selected');
			}
			$(this).attr('selected', 'true');
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

function CheckAnswer(correct) {
	var selected = $('.answer[selected]').html();
	alert(selected === correct ? 'yup' : 'nope');
}

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
function Category(id, name, image) {
	this.questions = new Array();
	this.id = id;
	this.name = name;
	this.image = new Image();
	this.image.src = image;
	this.image.id = 'TriviaImage';
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
