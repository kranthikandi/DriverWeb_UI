$(document).ready(function () {

    $("#signin").click(function () {
        $("#password").removeClass('bdr-danger');
        $("#email").removeClass('bdr-danger');

        var Username = $("#email").val();
        var Password = $("#password").val();
        if (Username == null || Username == "") {
            $("#email").addClass('bdr-danger');
            alert("Username field  cannot be empty");
            return;
        }
        if (Password == null || Password == "") {
            $("#password").addClass('bdr-danger');
            alert("Password field cannot be empty");
            return;
        }

        var userpass = $("#password").val();
        var signinDetails = {
            email: $("#email").val(),
            password: $("#password").val(),
            status: "active"
        }
        $.ajax({
            url: localStorage.getItem('url') + "user/signin",
            data: JSON.stringify(signinDetails),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                console.log(result);
                if (result.length > 0) {
                    var dbPassword = result[0].password;
                    if (userpass == dbPassword) {
                        localStorage.setItem('username', result[0].user_name);
                        localStorage.setItem('email', result[0].email);
                        window.location.href = 'customer.html';
                    }
                    else {
                        alert('UserId and Password mismatch');
                    }
                } else {
                    alert("You  don't have Account!! Please Sign up");
                }
            }
        });
    });
    $("#signup").click(function () {
        $("#userName").removeClass('bdr-danger');
        $("#email").removeClass('bdr-danger');
        $("#password").removeClass('bdr-danger');


        var Username = $("#userName").val();
        var Email = $("#email").val();
        var Password = $("#password").val();
        if (Username == null || Username == "") {
            $("#userName").addClass('bdr-danger');
            alert("User Name field cannot be empty");
            return;
        }
        if (Email == null || Email == "") {
            $("#email").addClass('bdr-danger');
            alert("Email field  cannot be empty");
            return;
        }
        else if (IsEmail(Email) == false) {
            alert("Please enter a valid Email address");
            return;
        }
        if (Password == null || Password == "") {
            $("#password").addClass('bdr-danger');
            alert("Password field cannot be empty");
            return;
        }

        var signUpDetails = {
            username: $("#userName").val(),
            email: $("#email").val(),
            password: $("#password").val(),
            status: "active"
        }
        $.ajax({
            url: localStorage.getItem('url') + "user/signup",
            data: JSON.stringify(signUpDetails),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                console.log(result);
                alert('Your account Created successfully!! Redirecting to Login Page');
                window.location.href = 'signin.html';
            }
        });

        localStorage.setItem("username", result.username);
    });

    function IsEmail(Email) {
        //var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([.com,.in,.org,.uk,.us]{2,4})+$/;
        if (!regex.test(Email)) {
            return false;
        }
    }

});
