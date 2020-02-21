$(document).ready(function () {

    //truck button action 
    $("#tucksbutton").click(function () {
        $("#trucks").addClass('active');
        $("#trailers").removeClass('active');
    });
    $("#trailerbutton").click(function () {
        $("#trailers").addClass('active');
        $("#trucks").removeClass('active');
    });

    $('#saveTruck').click(function () {
        var details = {
            truck_number: $('#truck_number').val(),
            truck_type: $('#truck_type').val(),
            milage: $('#milage').val(),
            days_on_field: "0",
            status: "active"
        }
        $.ajax({
            url: localStorage.getItem('url') + "fle/newtruck",
            data: JSON.stringify(details),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.msg == "success") {
                    //alert("contact added successfully");
                    location.reload();
                } else {
                    //alert(result.msg);
                    console.log(result.msg);
                }
            }
        });
    });

    $('#saveTrailer').click(function () {
        var details = {
            trailer_number: $('#trailer_number').val(),
            last_used: "",
            days_on_field: "",
            status: "active"
        }
        $.ajax({
            url: localStorage.getItem('url') + "fle/newtrailer",
            data: JSON.stringify(details),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.msg == "success") {
                    //alert("contact added successfully");
                    location.reload();
                } else {
                    //alert(result.msg);
                    console.log(result.msg);
                }
            }
        });
    });
    $.ajax({
        url: localStorage.getItem('url') + "fle/trucks",
        beforeSend: function (xhr) {
            $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
        },
        success: function (result) {
            $.unblockUI();

            $("#truck_tbody").empty();
            $.each(result, function (key, val) {
                var truck_number, Truck_Type, Last_serviced, Milage, Days_on_Fileld, dstatus;
                $.each(val, function (k, vals) {
                    if (k == "truck_number") {
                        truck_number = vals;
                    } else if (k == 'truck_type') {
                        Truck_Type = vals;
                    } else if (k == "last_serviced") {
                        Last_serviced = vals;
                    } else if (k == "milage") {
                        Milage = vals;
                    } else if (k == "days_on_Fileld") {
                        Days_on_Fileld = vals;
                    } else if (k == 'status') {
                        dstatus = vals;
                    } else {

                    }
                });
                var avail = '<div class="dropdown inline"><button class="btn btn-success dropdown-toggle" data-toggle="dropdown">'
                    + dstatus + ' </button>'
                    + '<div class="dropdown-menu pull-right">'
                    + ' <a class="dropdown-item" href="#">Available</a>'
                    + '  <a class="dropdown-item" href="#">Assigned</a>'
                    + '  <a class="dropdown-item" href="#">in-progress</a>'
                    + '</div>';
                var inactive = '<div class="dropdown inline"><button class="btn btn-danger dropdown-toggle" data-toggle="dropdown">'
                    + dstatus + ' </button>'
                    + '<div class="dropdown-menu pull-right">'
                    + ' <a class="dropdown-item" href="#">Available</a>'
                    + '  <a class="dropdown-item" href="#">Assigned</a>'
                    + '  <a class="dropdown-item" href="#">inactive</a>'
                    + '</div>';
                var statusbtn;
                if (dstatus == 'active') {
                    statusbtn = avail
                } else if (dstatus == 'services') {
                    statusbtn = inactive
                }
                var row = "<tr class='newpage'><td>" + truck_number + "</td><td>" +
                    Truck_Type + "</td><td>" +
                    Last_serviced + "</td><td>" +
                    Milage + "</td><td>" +
                    Days_on_Fileld + "</td><td>" + statusbtn + "</td></tr>";
                $("#truck_tbody").append(row);
            });

            $("#truck_table").DataTable();
        }
    });

    $.ajax({
        url: localStorage.getItem('url') + "fle/trailers",
        beforeSend: function (xhr) {
            $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
        },
        success: function (result) {
            $.unblockUI();

            $("#trailer_tbody").empty();
            $.each(result, function (key, val) {
                var trailer_number, last_used, Days_on_Fileld, dstatus;
                $.each(val, function (k, vals) {
                    if (k == "trailer_number") {
                        trailer_number = vals;
                    } else if (k == 'last_used') {
                        last_used = vals;
                    } else if (k == "days_on_field") {
                        Days_on_Fileld = vals;
                    } else if (k == 'status') {
                        dstatus = vals;
                    } else {

                    }
                });
                var avail = '<div class="dropdown inline"><button class="btn btn-success dropdown-toggle" data-toggle="dropdown">'
                    + dstatus + ' </button>'
                    + '<div class="dropdown-menu pull-right">'
                    + ' <a class="dropdown-item" href="#">Available</a>'
                    + '  <a class="dropdown-item" href="#">Assigned</a>'
                    + '  <a class="dropdown-item" href="#">in-progress</a>'
                    + '</div>';
                var inactive = '<div class="dropdown inline"><button class="btn btn-danger dropdown-toggle" data-toggle="dropdown">'
                    + dstatus + ' </button>'
                    + '<div class="dropdown-menu pull-right">'
                    + ' <a class="dropdown-item" href="#">Available</a>'
                    + '  <a class="dropdown-item" href="#">Assigned</a>'
                    + '  <a class="dropdown-item" href="#">inactive</a>'
                    + '</div>';
                var statusbtn;
                if (dstatus == 'active') {
                    statusbtn = avail
                } else if (dstatus == 'services') {
                    statusbtn = inactive
                }
                var row = "<tr class='newpage'><td>" + trailer_number + "</td><td>" +
                    last_used + "</td><td>" +
                    Days_on_Fileld + "</td><td>" + statusbtn + "</td></tr>";
                $("#trailer_tbody").append(row);
            });

            $("#trailer_table").DataTable();
        }
    });




});