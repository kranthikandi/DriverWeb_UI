$(document).ready(function () {


    $.ajax({
        url: localStorage.getItem('url') + "job/jobs",
        beforeSend: function (xhr) {
            $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
        },
        success: function (result) {
            $.unblockUI();
            $("#d_tbody").empty();
            $.each(result, function (key, val) {
                var cId, cName, jId, jLocation, jName, sdate, dstatus;
                $.each(val, function (k, vals) {
                    if (k == "job_id") {
                        jId = vals;
                    } else if (k == 'job_location') {
                        jLocation = vals;
                    } else if (k == "job_name") {
                        jName = vals;
                    } else if (k == 'start_date') {
                        sdate = vals;
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
                if (dstatus == 'running') {
                    statusbtn = avail
                } else if (dstatus == 'closed') {
                    statusbtn = inactive
                }
                var row = "<tr><td>" + jId + "</td><td>" + jName + "</td><td>" + jLocation + "</td><td>" + sdate + "</td><td>" + statusbtn + "</td></tr>";
                $("#d_tbody").append(row);
            });
            $("#driver_table").DataTable();
        }
    });

    $("#saveJob").click(function () {

        var job = {
            customer_name: $("#customerCrumb").text(),
            customer_id: $("#cid").text(),
            job_name: $("#job_name").val(),
            job_location: $("#job_location").val(),
            start_date: $("#startDate").val(),
            status: "running"
        }
        $.ajax({
            url: localStorage.getItem('url') + "job/job",
            data: JSON.stringify(job),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.msg == "success") {
                    alert("contact added successfully");
                    location.reload();
                } else {
                    alert(result.msg);
                    console.log(result.msg);
                }
            }
        })
    });


});