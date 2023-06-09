const urlBase = 'https://www.rleinecker.xyz';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let contactId = -1;
let userName = "";
let avatar = 0;

const numAvatars = 14;

function doLogin() {
  let login = document.getElementById("loginName").value;
  let password = document.getElementById("password").value;

  document.getElementById("loginResult").innerHTML = "";

  let tmp = { login: login, password: password };
  let jsonPayload = JSON.stringify(tmp);

  let url = `/LAMPAPI/Login.${extension}`;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8;");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;
        console.log(jsonObject)
        
        if (!userId || userId < 1) {
          document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
          return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;
        userName = jsonObject.userName;
        avatar = jsonObject.avatar;

        saveCookie();

        window.location.href = `${urlBase}/contacts.html`;
      }
    };
    
    xhr.send(jsonPayload);
  }
  catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }

}

function doSignUp() {
  userId = 0;
  firstName = "";
  lastName = "";
  avatar = 0;
  userName = "";

  let signupFirstName = document.getElementById("signupFirstName").value;
  let signupLastName = document.getElementById("signupLastName").value;
  let signupEmail = document.getElementById("signupEmail").value;
  let signupPassword = document.getElementById("password").value;

  document.getElementById("signupResult").innerHTML = "";

  // Form validation
  let regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!signupPassword.match(regex))
  {
    document.getElementById("signupResult").innerHTML = "Password must be 8 characters and contain at least one letter and one number.";
    return;
  }

  let tmp = {
    login: signupEmail,
    password: signupPassword,
    firstName: signupFirstName,
    lastName: signupLastName,
    avatar: Math.floor(Math.random() * 13)
  };
  
  let jsonPayload = JSON.stringify(tmp);

  let url = `/LAMPAPI/SignUp.${extension}`;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8;");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);

        if (jsonObject.Error) {
          document.getElementById("signupResult").innerHTML = jsonObject.Error;
          return;
        }

        window.location.href = `${urlBase}/login.html`;
      }
    };
    xhr.send(jsonPayload);
  }
  catch (err) {
    document.getElementById("signupResult").innerHTML = err.message;
  }
}

function saveCookie() {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + (minutes * 60 * 1000));
  
  document.cookie = `firstName=${firstName},lastName=${lastName},userId=${userId},userName=${userName},avatar=${avatar};expires=${date.toGMTString()}`;
}

// Returns 1 if user is logged in
// Returns 0 if user is logged in
function readCookie() {
  userId = -1;
  let data = document.cookie;
  let splits = data.split(",");
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
    if (tokens[0] == "firstName") {
      firstName = tokens[1];
    }
    else if (tokens[0] == "lastName") {
      lastName = tokens[1];
    }
    else if (tokens[0] == "userId") {
      userId = parseInt(tokens[1].trim());
    }
    else if (tokens[0] == "userName") {
      userName = tokens[1];
    }
    else if (tokens[0] == "avatar") {
      avatar = parseInt(tokens[1].trim());
    }
  }

  if (document.getElementById("avatar")) document.getElementById("avatar").setAttribute("src", `images/${avatar}.png`);


  if (!userId || userId < 0) {
    return 0;
  }
  else {
    if (document.getElementById("title") != null)
    {
      document.getElementById("title").innerHTML = `${firstName}'s Contacts`;
    }
      return 1;
  }
}

function doLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "login.html";
}

function getContacts() {
    let data = document.cookie;
    let splits = data.split(",");
    let userId = "";
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    let tmp = {
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = `${urlBase}/LAMPAPI/GetContacts.${extension}`;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let jsonObject = JSON.parse(xhr.responseText);
            
            updateContactList(jsonObject, "replace");
        }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
      document.getElementById("contacts").innerHTML = this.response;

    }
}

function addContact() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let email = document.getElementById("email").value;
    let phoneNumber = document.getElementById("phoneNumber").value;

    // Validate form
    if (!validateInput(firstName, lastName, phoneNumber))
    {
      return;
    }

    document.getElementById("contactAddResult").innerHTML = "";

    let data = document.cookie;
    let splits = data.split(",");
    let userId = "";
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    let tmp = { 
        firstName: firstName,
        lastName: lastName,
	      userId: userId,
        email: email,
        phone: phoneNumber,
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = `${urlBase}/LAMPAPI/AddContact.${extension}`;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("contactAddResult").innerHTML = "Contact has been added";

            let jsonObject = JSON.parse(xhr.responseText);
    
            updateContactList([jsonObject], "append");
        }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("contactAddResult").innerText = err.message;
        return;
    }

  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phoneNumber").value = "";

  document.getElementById("addContact").className = "inputform";
}

function searchContact() {
  let srch = document.getElementById("searchText").value;
  document.getElementById("contactSearchResult").innerHTML = "";

  let tmp = { searchItem: srch, userId: userId };
  let jsonPayload = JSON.stringify(tmp);

  let url = `${urlBase}/LAMPAPI/SearchContacts.${extension}`;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
        let jsonObject = JSON.parse(xhr.responseText);

        updateContactList(jsonObject, "replace");

      }
    };
    xhr.send(jsonPayload);
  }
  catch (err) {
    document.getElementById("contactSearchResult").innerHTML = err.message;
  }
}

function cancelDelete(id) 
{
  let buttons = document.getElementById(`buttons-${id}`);

  document.getElementById(`buttons-${id}`).removeChild(document.getElementById(`cancel${id}`));

  let deleteButton = document.getElementById(`delete${id}`);
    deleteButton.innerText = "Delete";
    deleteButton.style.marginTop = "0px";
    deleteButton.style.maxWidth = "100px";
    deleteButton.style.alignSelf = "end";
    deleteButton.style.backgroundColor = "darkred";
    deleteButton.style.color = "#EBE1C7"
    deleteButton.setAttribute("onclick", `confirmDelete(${id});`);

}

function confirmDelete(id)
{
  let cancelButton = document.createElement('button');

  cancelButton.setAttribute("id", `cancel${id}`);

  let confirmButton = document.getElementById(`delete${id}`);

  cancelButton.style.backgroundColor = "black";
  cancelButton.style.color = "white";
  cancelButton.innerText = "Cancel";
  cancelButton.style.marginTop = "10px";
  cancelButton.setAttribute("onclick", `cancelDelete(${id});`);

  confirmButton.style.color = "black";
  confirmButton.style.backgroundColor = "rosybrown";
  confirmButton.style.border = "1px solid red";
  confirmButton.innerText = "Confirm";
  confirmButton.setAttribute("onclick", `deleteContact(${id});`)

  document.getElementById(`buttons-${id}`).appendChild(cancelButton);
}

// Takes in a parsed JSON object from API response
// Updates the contact list on contacts page
function updateContactList(jsonObject, action)
{
  if (action == "replace")
    document.getElementById("contactList").innerHTML = "";

  for (let i = 0; i < jsonObject.length; i++) {
    let contactItem = document.createElement('div');
    contactItem.setAttribute("id", jsonObject[i]["ID"]);
    contactItem.setAttribute("class", "contact");
    let contactDetails = document.createElement('div');
    contactDetails.setAttribute("class" , "contactDetails");

    let buttons = document.createElement('div');
    buttons.setAttribute("id", `buttons-${jsonObject[i]["ID"]}`);
    buttons.setAttribute("class" , "buttons");

    let contactDetails1 = document.createElement('p');
    let contactDetails2 = document.createElement('p');
    let contactDetails3 = document.createElement('p');
    let contactDetails4 = document.createElement('p');

    contactDetails1.innerHTML = jsonObject[i]["FirstName"];
    contactDetails1.setAttribute("id", `FirstName-${jsonObject[i]["ID"]}`);
    contactDetails2.innerHTML = jsonObject[i]["LastName"];
    contactDetails2.setAttribute("id", `LastName-${jsonObject[i]["ID"]}`);
    contactDetails3.innerHTML = jsonObject[i]["Email"];
    contactDetails3.setAttribute("id", `Email-${jsonObject[i]["ID"]}`);
    contactDetails4.innerHTML = jsonObject[i]["Phone"];
    contactDetails4.setAttribute("id", `Phone-${jsonObject[i]["ID"]}`);

    let deleteButton = document.createElement('button');
    deleteButton.setAttribute("id", `delete${jsonObject[i]["ID"]}`);
    deleteButton.innerText = "Delete";
    deleteButton.style.marginTop = "0px";
    deleteButton.style.maxWidth = "100px";
    deleteButton.style.alignSelf = "end";
    deleteButton.style.backgroundColor = "darkred";
    deleteButton.style.color = "#EBE1C7"

    let updateButton = document.createElement('button');
    updateButton.setAttribute("id", `edit${jsonObject[i]["ID"]}`);

    updateButton.innerText = "Edit";
    updateButton.style.marginTop = "0px";
    updateButton.style.marginBottom="10px";
    updateButton.style.maxWidth = "100px";
    updateButton.style.alignSelf = "end";
    
    deleteButton.setAttribute("onclick", `confirmDelete(${jsonObject[i]["ID"]});`);

    updateButton.setAttribute("onclick", `openUpdateUI(
      "${jsonObject[i]["FirstName"]}",
      "${jsonObject[i]["LastName"]}",
      "${jsonObject[i]["Email"]}",
      "${jsonObject[i]["Phone"]}",
      ${jsonObject[i]["ID"]})`);


    buttons.appendChild(updateButton);
    buttons.appendChild(deleteButton);


    contactDetails.appendChild(contactDetails1);
    contactDetails.appendChild(contactDetails2);
    contactDetails.appendChild(contactDetails3);
    contactDetails.appendChild(contactDetails4);

    contactItem.appendChild(contactDetails);

    contactItem.appendChild(buttons);
    document.getElementById("contactList").appendChild(contactItem);
  }
}

function showAddContact()
{
  if (document.getElementById("addContact").className == "inputform") {
    document.getElementById("addContact").className = "inputformvisible";
  } 
  else {
    document.getElementById("addContact").className = "inputform";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phoneNumber").value = "";
  }

  document.getElementById("editContact").className = "inputform";
}

// Makes the update UI visible after clicking "edit" on a contact
function openUpdateUI(firstName, lastName, email, phone, id)
{
  let edit = document.getElementById("editContact");

  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phoneNumber").value = "";

  if (edit.className == "inputform") {
    edit.className = "inputformvisible";
  } 
  else {
    if (id == contactId)
      edit.className = "inputform";
  }

  document.getElementById("editFirstName").value = firstName;
  document.getElementById("editLastName").value = lastName;
  document.getElementById("editEmail").value = email;
  document.getElementById("editPhoneNumber").value = phone;
  contactId = id;
  document.getElementById("contactUpdateResult").innerHTML = "";
  document.getElementById("addContact").className = "inputform";

}

function updateContact()
{
    let firstName = document.getElementById("editFirstName").value;
    let lastName = document.getElementById("editLastName").value;
    let email = document.getElementById("editEmail").value;
    let phoneNumber = document.getElementById("editPhoneNumber").value;

    // Validate form
    if (!validateInput(firstName, lastName, phoneNumber))
    {
      return;
    }

    document.getElementById("contactUpdateResult").innerHTML = "";

    let data = document.cookie;
    let splits = data.split(",");
    let userId = "";
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    let tmp = { 
        firstName: firstName,
        lastName: lastName,
	      userId: userId,
        email: email,
        phone: phoneNumber,
        id: contactId,
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = `${urlBase}/LAMPAPI/UpdateContact.${extension}`;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("contactUpdateResult").innerHTML = "Contact has been updated";
            let jsonObject = JSON.parse(xhr.responseText);
            let targetID = jsonObject.ID;

            document.getElementById(`FirstName-${targetID}`).innerHTML = jsonObject.updatedFirstName;
            document.getElementById(`LastName-${targetID}`).innerHTML = jsonObject.updatedLastName;
            document.getElementById(`Email-${targetID}`).innerHTML = jsonObject.updatedEmail;
            document.getElementById(`Phone-${targetID}`).innerHTML = jsonObject.updatedPhone;
        }
        };
        xhr.send(jsonPayload);
        // Close updateUI
        document.getElementById("editContact").style.display = "none";
    }
    catch (err) {
        document.getElementById("contactUpdateResult").innerHTML = err.message;
    }
}

function deleteContact(contactId)
{
  document.getElementById("contactUpdateResult").innerHTML = "";

  let data = document.cookie;
  let splits = data.split(",");
  let userId = "";
  for (var i = 0; i < splits.length; i++) {
      let thisOne = splits[i].trim();
      let tokens = thisOne.split("=");
      if (tokens[0] == "userId") {
          userId = parseInt(tokens[1].trim());
      }
  }

  let tmp = { 
      userId: userId,
      id: contactId,
  };
  let jsonPayload = JSON.stringify(tmp);

  let url = `${urlBase}/LAMPAPI/DeleteContact.${extension}`;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  try {
      xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          document.getElementById("contactUpdateResult").innerHTML = "Contact has been deleted";
      }
      };
      xhr.send(jsonPayload);
      // Optimistically remove item from contact list
      let contactItem = document.getElementById(contactId);
      contactItem.remove();
  }
  catch (err) {
      document.getElementById("contactUpdateResult").innerHTML = err.message;
  }
}

function toggleViewPassword()
{
  if (document.getElementById("password").getAttribute("type") == "password")
  {
    document.getElementById("icon-eye").setAttribute("src", "images/eye.svg");
    document.getElementById("password").setAttribute("type", "input");
  }
  else 
  {
    document.getElementById("password").setAttribute("type", "password");
    document.getElementById("icon-eye").setAttribute("src", "images/eye-blocked.svg");
  }
}

function getUserDetails()
{
  document.getElementById("firstName").innerHTML = firstName;
  document.getElementById("lastName").innerHTML = lastName;
  document.getElementById("login").innerHTML = userName;
  // document.getElementById("passwordHidden").innerHTML = "********";
  document.getElementById("avatar").setAttribute("src", `images/${avatar}.png`);
}

function openUpdateUserForm()
{
  document.getElementById("profile-form").style.display = "block";
  document.getElementById("editUsernameButton").style.display = "none";
  document.getElementById("editUserButton").style.display = "none";

  document.getElementById("signupFirstName").value = firstName;
  document.getElementById("signupLastName").value = lastName;
  document.getElementById("signupEmail").value = userName;
  // document.getElementById("password").value = "";
  document.getElementById("signupAvatar").setAttribute("src", `images/${avatar}.png`);
  document.getElementById("profile-details").style.display = "none";
}

function openUpdateUsernameForm()
{
  document.getElementById("username-form").style.display = "block";
  document.getElementById("editUsernameButton").style.display = "none";
  document.getElementById("editUserButton").style.display = "none";

  document.getElementById("signupFirstName").value = firstName;
  document.getElementById("signupLastName").value = lastName;
  document.getElementById("signupEmail").value = userName;
  // document.getElementById("password").value = "";
  document.getElementById("signupAvatar").setAttribute("src", `images/${avatar}.png`);
  document.getElementById("profile-details").style.display = "none";
}

function closeUpdateUserForm()
{
  document.getElementById("profile-form").style.display = "none";
  document.getElementById("editUserButton").style.display = "block";
  document.getElementById("editUserNameButton").style.display = "block";
  document.getElementById("profile-details").style.display = "block";
}

function closeUpdateUsernameForm()
{
  document.getElementById("username-form").style.display = "none";
  document.getElementById("editUserButton").style.display = "block";
  document.getElementById("editUserNameButton").style.display = "block";
  document.getElementById("profile-details").style.display = "block";
}

function doUpdateUser(type)
{
  let signupFirstName = "";
  let signupLastName = "";
  let signupEmail = "";
  let signupPassword = "";
  let signupAvatar = 0;

  readCookie();

  if (type == "password" && document.getElementById("password"))
  {
    signupPassword = document.getElementById("password").value;
    // Form validation
    let regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!signupPassword.match(regex))
    {
      document.getElementById("updateUserResult").innerHTML = "Password must be 8 characters and contain at least one letter and one number.";
      return;
    }
  }
  else if (type == "avatar")
  {
    signupAvatar = Math.floor(Math.random() * numAvatars);

    if (signupAvatar == 13)
    {
      document.getElementById("chaos").style.display = "block";
      document.getElementById("bird").style.display = "block";
      document.getElementById("bird4").style.display = "block";
      document.getElementById("palmtree").style.display = "block";
      let audio = document.createElement("audio");
      audio.setAttribute("autoplay", true);
      audio.setAttribute("src", "images/quack.mp3");
      document.querySelector("body").appendChild(audio);
      
      setTimeout(() => {
        let bird = document.createElement("img");
        bird.setAttribute("id", "bird2");
        bird.setAttribute("src", "images/bird.gif");
        document.querySelector("body").appendChild(bird);
      }, 1000);

      setTimeout(() => {
        // if (document.getElementById("explosion1")) document.getElementById("explosion1").remove();
        let explosion1 = document.createElement("img");
        explosion1.setAttribute("id", "explosion1");
        explosion1.setAttribute("src", "images/explosion.gif");
        document.querySelector("body").appendChild(explosion1);
      }, 3700)
      setTimeout(() => {
        document.getElementById("explosion1").style.display = "none";
        document.getElementById("bird2").style.display = "none";
      }, 4200)
    }
  }
  else if (type == "username")
  {
    signupEmail = document.getElementById("signupEmail").value;
  }
  else if (type == "name")
  {
    signupFirstName = document.getElementById("signupFirstName").value;
    signupLastName = document.getElementById("signupLastName").value;
  }

  let tmp = {
    login: signupEmail,
    firstName: signupFirstName,
    lastName: signupLastName,
    avatar: signupAvatar,
    password: signupPassword,
    id: userId
  };

  document.getElementById("updateUserResult").innerHTML = "";
  let jsonPayload = JSON.stringify(tmp);

  let url = `/LAMPAPI/UpdateUser.${extension}`;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8;");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        console.log(jsonObject)
        if (jsonObject.Error) {
          document.getElementById("updateUserResult").innerHTML = jsonObject.Error;
          return;
        }

        if (type == "name")
        {
          userId = jsonObject.userId;
          firstName = jsonObject.updatedFirstName;
          lastName = jsonObject.updatedLastName;
          saveCookie();
          window.location.href="profile.html"
        }
        else if (type == "username")
        {
          userId = jsonObject.userId;
          userName = jsonObject.updatedLogin;
          saveCookie();
          window.location.href="profile.html"
        }
        else if (type == "avatar")
        {
          avatar = jsonObject.updatedAvatar;
          saveCookie();
          readCookie();
        }
        else
        {
          window.location.href="profile.html"
        }

      }
    };
    xhr.send(jsonPayload);
  }
  catch (err) {
    document.getElementById("updateUserResult").innerHTML = err.message;
  }
}

function openPasswordChanger()
{
  document.getElementById("passwordChanger").style.display="block";
  document.getElementById("changePasswordButton").style.display="none";
}
function closePasswordChanger()
{
  document.getElementById("passwordChanger").style.display="none";
  document.getElementById("changePasswordButton").style.display="block";
}

function validateInput(firstName, lastName, phoneNumber)
{
  let phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
  if (!phoneNumber.match(phoneRegex))
  {
    document.getElementById("contactUpdateResult").innerHTML = "Please enter a valid phone number using the format ###-###-####.";
    document.getElementById("contactAddResult").innerHTML = "Please enter a valid phone number using the format ###-###-####.";
    return false;
  }

  // Prevent SQL injection
  let nameRegex = /^[A-Za-z]+$/;
  if (!firstName.match(nameRegex))
  {
    document.getElementById("contactUpdateResult").innerHTML = "Name must include only letters.";
    document.getElementById("contactAddResult").innerHTML = "Name must include only letters.";
    return false;
  }

  if (!lastName.match(nameRegex))
  {
    document.getElementById("contactUpdateResult").innerHTML = "Name must include only letters.";
    document.getElementById("contactAddResult").innerHTML = "Name must include only letters.";
    return false;
  }

  return true;
}