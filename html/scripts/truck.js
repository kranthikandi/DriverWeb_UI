$(document).ready(function () {


    $.ajax({
        url: localStorage.getItem('url') + "tru/trucks",
        beforeSend: function (xhr) {
            $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
        },
        success: function (result) {
            $.unblockUI();
            $("#d_tbody").empty();
            $.each(result, function (key, val) {
                var dId, dName, tt, dstatus;
                $.each(val, function (k, vals) {

                    if (k == "truck_number") {
                        dId = vals;
                    } else if (k == 'truck_type') {
                        dName = vals;
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
                var assig = '<div class="dropdown inline"><button class="btn btn-info dropdown-toggle" data-toggle="dropdown">'
                    + dstatus + ' </button>'
                    + '<div class="dropdown-menu pull-right">'
                    + ' <a class="dropdown-item" href="#">Available</a>'
                    + '  <a class="dropdown-item" href="#">Assigned</a>'
                    + '  <a class="dropdown-item" href="#">inactive</a>'
                    + '</div>';
                var inactive = '<div class="dropdown inline"><button class="btn btn-danger dropdown-toggle" data-toggle="dropdown">'
                    + dstatus + ' </button>'
                    + '<div class="dropdown-menu pull-right">'
                    + ' <a class="dropdown-item" href="#">Available</a>'
                    + '  <a class="dropdown-item" href="#">Assigned</a>'
                    + '  <a class="dropdown-item" href="#">inactive</a>'
                    + '</div>';
                var statusbtn;
                if (dstatus == 'available') {
                    statusbtn = avail
                } else if (dstatus == 'assigned') {
                    statusbtn = assig
                } else if (dstatus == 'inactive') {
                    statusbtn = inactive
                }
                var row = "<tr><td>" + dId + "</td><td>" + dName + "</td><td>" + statusbtn + "</td></tr>";
                $("#d_tbody").append(row);
            });
            $("#driver_table").DataTable();
        }
    });


});