// Jordan Bluehdorn

//Parses the JSON
var contactString = JSON.stringify(contacts);
var contactList = JSON.parse(contactString);


$(document).ready(function() {
	PopulateList();
	$('#ContactList .ContactInfo').hide();
	$('#ContactList .contact').click(function() {
		$(this).children('h3').toggleClass('closeBg');
		$(this).children('.ContactInfo').slideToggle(700, 'linear');
	});
});

//Returns the contact's info
function ShowContact(contact) {
	var info = '';
	
	info += '<div class="contact">';
	info += '<h3>' + contact.FirstName + ' ' + contact.LastName + '</h3><br>';
	info += '<div class="ContactInfo">';
	info += '<img src="' + contact.imageSource + '" alt="' + contact.FirstName + ' ' + contact.LastName + '">';
	info += '<p>';
	info += '<strong>Contact Info:</strong><br>';
	info += 'Phone: ' + contact.PhoneNum + '<br>';
	info += 'Email: ' + contact.Email + '<br>';
	info += '</p>';
	info += '</div></div>';
	
	return info;
}

//Populates the address book
function PopulateList() {
	var div = $($('.contact')[0]).clone();
	for(var i = 0; i < contactList.length; i++){
		div.html(ShowContact(contactList[i]));
		$('#ContactList').append(div.html());
	}
}