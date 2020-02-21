$(document).ready(function () {

    if (!localStorage.username) {
        window.location.href = 'signin.html';
    }

    $(".smallButton").click(function () {
        $(".smallButton").hide()
        window.location.href = 'driver.html';
    });

    var username = localStorage.username, MaxId = 100
    $('#UserN').empty()
    $('#UserN').append(username.charAt(0))

    var driTable = $("#driver_table").DataTable();
    var DriFtBills = $("#ICDriverFtbTable").DataTable();
    var DriStmts = $("#ICDriverStmtTable").DataTable();

    getAllDrivers()
    function getAllDrivers() {
        $('#AllDrivers').show()
        $('#Driver').hide()
        $.ajax({
            url: localStorage.getItem('url') + "dri/drivers",
            type: 'get',
            http2: true,
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.length == 0) {
                    MaxId = 100
                    return
                }
                driTable.clear().draw();
                $.each(result, function (key, val) {
                    MaxId = parseInt(val.ICdriver_id) + 1
                    var status
                    if (val.status == 'Active') {
                        status = '<button class="md-btn md-flat m-b-sm w-xs text-success">' + val.status + '</button>'
                    } else if (val.status == 'Hold') {
                        status = '<button class="md-btn md-flat m-b-sm w-xs text-warning">' + val.status + '</button>'
                    } else if (val.status == 'Archive') {
                        status = '<button class="md-btn md-flat m-b-sm w-xs text-danger">' + val.status + '</button>'
                    }
                    driTable.row.add([
                        val.ICdriver_id, val.ICdriver_name, val.NoOfTrucks, status
                    ]).draw(false);
                });
            }
        });
    }

    $('#NewDriver').click(function () {
        $('.ccfrm').empty()
        $('.ccfrm').val('')
        $('#ICDTrucksBody').empty()
        $('#IcDriverId').val(MaxId)
        $('#AllDrivers').hide()
        $('#Driver').show()
        $('#saveDriver').show()
        $('#updateDriver').hide()

    })

    $(".ttype").click(function () {
        var ttype = $(this).attr('value');
        $("#ttype").empty();
        $("#ttype").append(ttype);
    });
    $('.eStatusthis').click(function () {
        $(".ThisEStatus").empty()
        if ($(this).attr('id') == 'Active') {
            $('.ThisEStatus').addClass('btn-success')
            $('.ThisEStatus').removeClass('btn-warning')
            $('.ThisEStatus').removeClass('btn-danger')
        } else if ($(this).attr('id') == 'Hold') {
            $('.ThisEStatus').removeClass('btn-success')
            $('.ThisEStatus').addClass('btn-warning')
            $('.ThisEStatus').removeClass('btn-danger')
        } else if ($(this).attr('id') == 'Archive') {
            $('.ThisEStatus').removeClass('btn-success')
            $('.ThisEStatus').removeClass('btn-warning')
            $('.ThisEStatus').addClass('btn-danger')
        }
        $(".ThisEStatus").append($(this).attr('id'))
    })

    $("#add-row").click(function () {
        var TruckID = $('#IcDriverId').val() + '-' + $("#ICTruckID").val();
        var tt = $("#ttype").text();
        var TruckDri = $("#ICTDri").val() || '--';
        var trow = '';
        trow = trow + "<tr><td>" + TruckID + "</td><td>" + tt + "</td><td>" + TruckDri + "</td><td>Available</td></tr>";
        $("#ICDTrucksBody").append(trow);
    });

    $("#lExp").datetimepicker({
        timepicker: false,
        format: 'm-d-Y'
    })
    $("#InsExp").datetimepicker({
        timepicker: false,
        format: 'm-d-Y'
    })

    $("#ICDCancel").click(function () {
        getAllDrivers()
    })

    $("#saveDriver").click(function () {

        if (!$("#IcDriverName").val() || !$("#NoOfTrucks").val() || !$('#BrokerFee').val()) {
            $("#IcDriverName").addClass('bdr-danger')
            $("#NoOfTrucks").addClass('bdr-danger')
            $('#BrokerFee').addClass('bdr-danger')
            alert('* fields are required field !!')
            return
        }
        var driver = {
            driver_id: $("#IcDriverId").val(),
            driver_name: $("#IcDriverName").val(),
            NoOfTrucks: $("#NoOfTrucks").val(),
            status: "Active",
            address: $("#address").val(),
            city: $("#city").val(),
            Zip: $("#zip").val(),
            //Trucks: $("#address").val(),
            ssn: $("#ssn").val(),
            taxId: $("#taxid").val(),
            Ins_provider: $("#InsPro").val(),
            Ins_Id: $("#InsID").val(),
            Ins_Exp: $("#InsExp").val(),
            Dl_Id: $("#Lid").val(),
            Dl_Exp: $("#lExp").val(),
            BrokerFee: $('#BrokerFee').val(),
            TrailerFee: $('#TrailerFee').val()
        }

        $.ajax({
            url: localStorage.getItem('url') + "dri/driver",
            data: JSON.stringify(driver),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.msg == "success") {
                    alert("Driver added successfully");
                    getAllDrivers()
                } else {
                    alert(result.msg);
                    console.log(result.msg);
                }
            }
        });
    });

    $("#IcDriverName").change(function () {
        $("#IcDriverName").removeClass('bdr-danger')
    })
    $("#NoOfTrucks").change(function () {
        $("#NoOfTrucks").removeClass('bdr-danger')
    })
    $("#BrokerFee ").change(function () {
        $('#BrokerFee').removeClass('bdr-danger')
    })
    $("#TrailerFee ").change(function () {
        $('#TrailerFee').removeClass('bdr-danger')
    })


    $('#updateDriver').click(function () {
        var b = $("#ICDriversTrucks"),
            d = $(b).find("tbody"), f = ['TruckID', 'TruckType', 'Driver', 'Status', 'ICid', 'ICName'], g = []
        $.each($(d).find("tr"), function (a, b) {
            for (var c = {}, d = 0; d < f.length; d++) {
                c[f[d]] = $(this).find("td").eq(d).text();
                if (f[d] == 'ICid') {
                    c[f[d]] = $("#IcDriverId").val()
                } else if (f[d] == 'ICName') {
                    c[f[d]] = $("#IcDriverName").val()
                }
            }
            g.push(c)
        });
        var data = {
            driver_id: $("#IcDriverId").val(),
            driver_name: $("#IcDriverName").val(),
            address: $("#address").val(),
            status: $('.ThisEStatus').text(),
            city: $("#city").val(),
            Zip: $("#zip").val(),
            ssn: $("#ssn").val(),
            Trucks: g,
            taxId: $("#taxid").val(),
            Ins_provider: $("#InsPro").val(),
            Ins_Id: $("#InsID").val(),
            Ins_Exp: $("#InsExp").val(),
            Dl_Id: $("#Lid").val(),
            Dl_Exp: $("#lExp").val(),
            NoOfTrucks: $("#NoOfTrucks").val(),
            BrokerFee: $('#BrokerFee').val(),
            TrailerFee: $('#TrailerFee').val()

        }
        $.ajax({
            url: localStorage.getItem('url') + "dri/updatedriver",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.msg == "success") {
                    alert("Updated Driver");
                    getAllDrivers()
                } else {
                    alert('Something went Wrong Please Try again');
                    console.log(result.msg);
                }
            }
        });
    })

    $('#driver_table tbody').on('click', 'tr', function () {
        $(".smallButton").show()
        driTable.$('tr.light-blue-500').removeClass('light-blue-500');
        $(this).addClass('light-blue-500');
        var row = driTable.row(this).data();
        var data = {
            driver_name: row[1]
        }
        $.ajax({
            url: localStorage.getItem('url') + "dri/driverDetails",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                showDriverDetails(result)
            }
        })
        $.ajax({
            url: localStorage.getItem('url') + "ftb/DriFTBDetails",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (DriFtbills) {
                DriFtBills.clear().draw(); var net, gross, id
                $.each(DriFtbills, function (key, val) {
                    if (val.status == 'Created') {
                        net = 0, gross = 0
                        id = '<span class = "btn-xs text-info">' + val.status + '</span>'
                    } else if (val.status == 'Paid') {
                        id = '<span class = "btn-xs  text-success">' + val.status + '</span>'
                    } else if (val.status == 'P-Paid') {
                        id = '<span class = "btn-xs text-warning">' + val.status + '</span>'
                    } else if (val.status == 'Entered') {
                        id = '<span class = "btn-xs text-primary">' + val.status + '</span>'
                    } else if (val.status == 'Preview') {
                        id = '<span class = "btn-xs text-primary">' + val.status + '</span>'
                    } else {
                        id = '<span class = "btn-xs text-lime-400">' + val.status + '</span>'
                    }
                    DriFtBills.row.add([
                        val.Fright_Bill, moment(val.date).format('MM-DD-YYYY'), val.job_id, val.pTotal || net, val.pNetTotal || gross, id
                    ]).draw(false);
                });
            }
        })
        $.ajax({
            url: localStorage.getItem('url') + "dri/driStatements",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (DriStmt) {
                DriStmts.clear().draw();
                $.each(DriStmt, function (key, val) {
                    DriStmts.row.add([
                        val.statementId, moment(val.date).format('MM-DD-YYYY'), val.check, val.Total
                    ]).draw(false);
                });
            }
        })

    })
    function showDriverDetails(data) {
        $('#AllDrivers').hide()
        $('#Driver').show()
        $('#saveDriver').hide()
        $('#updateDriver').show()
        $('.ccfrm').empty()
        $('.ccfrm').val('')
        $("#IcDriverId").val(data.ICdriver_id)
        $("#IcDriverName").val(data.ICdriver_name)
        $("#NoOfTrucks").val(data.NoOfTrucks)
        $('.ThisEStatus').append(data.status)
        $("#address").val(data.address)
        $("#city").val(data.city)
        $("#zip").val(data.zip)
        $("#ssn").val(data.ssn)
        $("#taxid").val(data.taxId)
        $("#BrokerFee").val(data.BrokerFee)
        $("#TrailerFee").val(data.TrailerFee)
        $("#InsPro").val(data.Ins_provider)
        $("#InsID").val(data.Ins_Id)
        if (data.Ins_Exp) {
            $("#InsExp").val(moment(data.Ins_Exp).format('MM-DD-YYYY'))
        } else {
            $("#InsExp").empty()
        }
        if (data.Dl_Exp) {
            $("#lExp").val(moment(data.Dl_Exp).format('MM-DD-YYYY'))
        } else {
            $("#lExp").empty()
        }
        $("#Lid").val(data.Dl_Id)
        $('#ICDTrucksBody').empty()
        for (var i = 0; i < data.trucks.length; i++) {
            var row = '<tr><td>' + data.trucks[i].TruckID + '</td><td>' + data.trucks[i].TruckType + '</td><td>' + data.trucks[i].Driver + '</td><td>' + data.trucks[i].Status + '</td></tr>'
            $('#ICDTrucksBody').append(row)
        }
    }


});