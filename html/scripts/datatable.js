$(document).ready(function () {
    $("#getdata").click(function () {
        alert("test");
        $.ajax({
            url: localStorage.getItem('url') + "api/contacts", success: function (result) {
                alert(result);
                console.log(result);
                $("#div1").html(result);
            }
        });
    });
});