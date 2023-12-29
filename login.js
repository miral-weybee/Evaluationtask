$(window).on("hashchange", function () {
	if (location.hash.slice(1) == "signup") {
		$(".page").addClass("extend");
		$("#login").removeClass("active");
		$("#signup").addClass("active");
	} else {
		$(".page").removeClass("extend");
		$("#login").addClass("active");
		$("#signup").removeClass("active");
	}
});
$(window).trigger("hashchange");

$("#loginform").submit(function(e){
    e.preventDefault();
	var name = document.getElementById("logName").value;
	var password = document.getElementById("logPassword").value;

	if (name == "" || password == "") {
		document.getElementById("errorMsg").innerHTML = "Please fill the required fields"
		return false;
	}

    else {
        
        const username = $('#logName').val();
        const password = $('#logPassword').val();

        const formData = {
            Username: username,
            Password: password
        };

        $.ajax({
            type: 'POST',
            url: 'https://localhost:7042/api/login/login',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                const token = response.token;
                localStorage.setItem('token', token);
                location.href = '/Evaluationtask/party.html'
          },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    }
})

$("#signupform").submit(function (e) {
    e.preventDefault();
    var mail = document.getElementById("signEmail").value;
	var password = document.getElementById("signPassword").value;

	if (mail == "" || password == "") {
		document.getElementById("errorMsg").innerHTML = "Please fill the required fields"
		return false;
	}
	else {
        const username = $('#signEmail').val();
        const password = $('#signPassword').val();

        const formData = {
            Username: username,
            Password: password
        };

        $.ajax({
            type: 'POST',
            url: 'https://localhost:7042/api/login/register',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
               alert("User Registered successfully..");
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
		location.href = "/Evaluationtask/index.html";
	}
})


