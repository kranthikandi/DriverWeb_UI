$(document).ready(function () {

    $('#ContactForm').click(function () {
        var email = $('#email').val()
        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        if ($('#name').val() == '') {
            alert('Please enter your name')
            return
        } else if (!validateEmail(email)) {
            alert('please enter valid email')
            return
        } else if ($('#message').val() == '') {
            alert('please enter Message')
            return
        }
        var data = {
            time: new Date(),
            name: $('#name').val(),
            email: $('#email').val(),
            message: $('#message').val()
        }
        $.ajax({
            url: "http://54.67.34.66:3000/contact/ccForm",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.msg == 'success') {
                    alert('Thank you!! we will get in touch with you')
                }
            }
        })
    })

    function validations() {

    }
})