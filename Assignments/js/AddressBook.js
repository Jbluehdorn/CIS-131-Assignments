// Jordan Bluehdorn
// This creates AddressBook objects to be used

var defaultImg = new Image();
defaultImg.src = 'images/StarWars/OIdRepublicLogo.png';

function Contact(fname, lname, phone, email, image) {
	this.FirstName = fname;
	this.LastName = lname;
	this.PhoneNum = phone;
	this.Email = email;
	this.img = new Image();
	this.img.src = image;
	this.Show = ShowContact(this);
}

//Returns html with the contact's information
function ShowContact(contact) {
	var info = '';
	
	info += '<img src="' + contact.img.src + '" alt="' + contact.FirstName + ' ' + contact.LastName + '">';
	info += '<p>';
	info += '<strong>Contact Info:</strong><br>';
	info += contact.FirstName + ' ' + contact.LastName + '<br>';
	info += 'Phone: ' + contact.PhoneNum + '<br>';
	info += 'Email: ' + contact.Email + '<br>';
	info += '</p>';
	
	return info;
}

//Creates an array of contacts
var contacts = new Array();

contacts[0] = new Contact('Anakin', 'Skywalker', '(315)555-8659', 'Anny@theDarkSide.net', 'images/StarWars/AnakinSkywalker.png');
contacts[1] = new Contact('Ashoka', 'Tano', '(315)555-1337', 'ATano@j3d1zr00lz.gov', 'images/StarWars/AshokaTano.png');
contacts[2] = new Contact('Boba', 'Fett', '(597)555-4420', 'FettB@bountyhunters.com', 'images/StarWars/BobaFett.png');
contacts[3] = new Contact('Dexter', 'Jettster', '(317)555-9673', 'Dex@Dexsdiner.com', 'images/StarWars/DexterJettster.png');
contacts[4] = new Contact('Ki-Adi', 'Mundi', '(8FC)555-9898', 'MundiK@JediTemple.gov', 'images/StarWars/KiAdiMundi.png');

//Changes the displayed contact
function ChangeContact(val) {
	var space = document.getElementById('ContactInfo');
	
	if(val.value == -1)
		space.innerHTML = '<img src="' + defaultImg.src+ '" alt="Old Republic Logo">';
	else
		space.innerHTML = contacts[val.value].Show;
		
	$(space).hide().slideDown(1000);
}

//Populates the dropdown
function PopulateDropdown () {
	var list = document.getElementById('ContactDropdown');
	
	for(var i = 0; i < contacts.length; i++) {
		list.innerHTML += '<option value="' + i + '">' + contacts[i].FirstName + ' ' + contacts[i].LastName + '</option>'; 
	}
}

$(document).ready(function() {
	ChangeContact({value: -1}); 
	PopulateDropdown()
});