$(document).ready(function () {

    if (!localStorage.username) {
        window.location.href = 'signin.html';
    }
    var username = localStorage.username.toUpperCase()
    $('#UserN').empty()
    $('#UserN').append(username.charAt(0))

    $("#DispatchDate").datetimepicker({
        timepicker: false,
        format: 'm-d-Y'
    });
    var d = new Date(), Allcust = [],
        today = moment(d).format('MM-DD-YYYY'),
        today = moment(d).format('MM-DD-YYYY'),
        tomorrow = moment(new Date()).add(1, 'days').format('MM-DD-YYYY')
    $("#DispatchDate").val(today);

    $("#DispDate").datetimepicker({
        timepicker: false,
        format: 'm-d-Y'
    })
    getCurrentDispatch(tomorrow);
    $("#DispDate").val(tomorrow);
    getDispatch(tomorrow);
    $("#DispDate").on('change', function () {
        //dateValidator();
        getDispatch($("#DispDate").val())
        //getCustomers()
        resetDisp()
    });
    dateValidator()

    function dateValidator() {
        /* if (today == $("#DispDate").val() || tomorrow == $("#DispDate").val()) {
            $(".dispBlock").prop('disabled', false);
            getCustomers();
        } else {
            $(".dispBlock").prop('disabled', true);
            $(".ddTT").prop('disabled', true);
        } */
    }
    function resetDisp() {
        $("#DJobName").empty()
        $("#DJobName").append('Job Name')
        $('#DCustomerName').empty()
        $('#DCustomerName').append('Customer / Broker')
        $('#nDCustomerName').empty()
        $('#nDCustomerName').append('Customer / Broker')
        $('#DCustomerId').val('')
        $('#DBRate').val('')
        $('#DispRate').val('')
        $('#DjobId').val('')
        $('#DjobLocation').val()
        $('#DjobType').val()
        $('#ttype').empty()
        $('#ttype').append('Truck Type')
        $('#ttype').prop('disabled', true)
        $('#nttypes').empty()
        $('#nttypes').append('Truck Type')
        $('#nttypes').prop('disabled', true)
    }
    $('#GetCustDisp').on('change', function () {
        custs = $("#GetCustDisp").val()
        getCustJobs(custs);
    })

    function getCustJobs(custName) {
        var name = {
            customer_name: custName
        }
        $("#Djob").empty();
        $(".Djob").empty();
        $.ajax({
            url: localStorage.getItem('url') + "job/cjobs",
            data: JSON.stringify(name),
            type: 'post',
            http2: true,
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                var dd = ''
                $("#Djob").empty()
                if (result.length == 0) {
                    dd = dd + '<a class="dropdown-item jobdd" id="newJob">New</a> '
                    $("#Djob").append(dd);
                    $('#jobDropdown').hide()
                    $('#jobNew').show()
                } else {
                    $('#jobDropdown').show()
                    $('#jobNew').hide()
                    $.each(result, function (key, val) {
                        $("#DCustomerId").empty();
                        $("#DCustomerId").val(val.customer_id);
                        $("#DCustomerId").addClass('b-success');
                        $("#nDCustomerId").empty();
                        $("#nDCustomerId").val(val);
                        $("#nDCustomerId").addClass('b-success');
                        $("#DJobName").empty();
                        $("#nDJobName").empty();
                        $("#DjobId").empty();
                        $("#DjobLocation").empty();
                        $("#DjobType").empty();
                        $("#DBRate").empty();
                        $("#DJobName").append('Job Name')
                        $("#nDJobName").append('Job Name')
                        $(".ddTT").prop('disabled', true);
                        $("#Djob").append(dd);
                        $(".Djob").append(dd);
                    })
                }
            }
        })
    }
    $('#nCustDropDown').on('click', '.custdd', function () {
        $("#nDCustomerName").empty();
        $("#nDCustomerName").append($(this).attr('id'));
        $("#nDCustomerName").removeClass('white');
        $("#nDCustomerName").addClass('b-success');
        getCustJobs($(this).attr('id'));
    })
    $('.Djob').on('click', '.jobdd', function () {
        $("#nDJobName").empty();
        $("#nDJobName").append($(this).attr('id'));
        $("#nDJobName").removeClass('white');
        $("#nDJobName").addClass('b-success');
        getjobDetails($(this).attr('id'))
    })
    $('#Djob').on('click', '.jobdd', function () {
        $("#DJobName").empty();
        $("#DJobName").append($(this).attr('id'));
        $("#DJobName").removeClass('white');
        $("#DJobName").addClass('b-success');
        getjobDetails($(this).attr('id'))
    })
    var billRate = [], payRate = []
    function getjobDetails(jname) {
        var dispDate = $('#DispDate').val()
        var weeknumb = moment(dispDate).weekday(), brate, jtype
        console.log(weeknumb)
        var name = {
            job_name: jname,
            weeknumb: weeknumb
        }
        $.ajax({
            url: localStorage.getItem('url') + "job/jjobs",
            data: JSON.stringify(name),
            type: 'post',
            http2: true,
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                $.each(result.jDetails, function (k, val) {
                    if (k == 'job_id') {
                        $("#DjobId").val(val);
                        $("#DjobId").addClass('b-success');
                        $("#nDjobId").val(val);
                        $("#nDjobId").addClass('b-success');
                    } else if (k == 'job_location') {
                        $("#DjobLocation").val(val);
                        $("#loca").val(val)
                        $("#DjobLocation").addClass('b-success');
                    } else if (k == 'job_type') {
                        $("#DjobType").val(val);
                        $("#DjobType").addClass('b-success');
                        $("#nDjobType").val(val);
                        $("#nDjobType").addClass('b-success');
                        jtype = val
                    }
                })
                if (result.rate) {
                    billRate = result.rate.bRate
                    payRate = result.rate.pRate
                } else {
                    alert('Please select job type in job configure page.')
                }
                $(".ddTT").prop('disabled', false);
            }
        })
    }

    $(".ttype").click(function () {
        var ttype = $(this).attr('value');
        selectTruck(ttype)
    });
    $('#FtTruckType').keypress(function () {
        var ttype = $('#FtTruckType').val();
        selectTruck(ttype)
    })
    function selectTruck(ttype) {
        $("#ttype").empty();
        $("#ttype").append(ttype);
        $("#nttypes").empty();
        $("#nttypes").append(ttype);
        $("#sDriver").empty();
        $("#sDriver").append('Driver')
        $("#nsDriver").empty();
        $("#nsDriver").append('Driver')
        var brate, prate
        if (ttype == 'Super-Dump') {
            brate = billRate.superdump
            prate = payRate.superdump
        } else if (ttype == 'End-Dump') {
            brate = billRate.enddump
            prate = payRate.enddump
        } else if (ttype == 'Double-Bottom') {
            brate = billRate.doublebottom
            prate = payRate.doublebottom
        } else if (ttype == 'Semi-Bottom') {
            brate = billRate.semibuttom
            prate = payRate.semibuttom
        } else if (ttype == '10-wheeler') {
            brate = billRate.tenwheeler
            prate = payRate.tenwheeler
        } else if (ttype == 'Highside') {
            brate = billRate.highside
            prate = payRate.highside
        } else if (ttype == 'Flatbed') {
            brate = billRate.flatbed
            prate = payRate.flatbed
        } else if (ttype == 'Transfer') {
            brate = billRate.transfer
            prate = payRate.transfer
        }
        if (brate == '') {
            alert('There is no bill rate configured')
        } if (prate == '') {
            alert('There is no pay rate configured')
        }
        $('#DBRate').val(brate)
        $('#DispRate').val(prate)
        var type = {
            tt: ttype
        }
        $.ajax({
            url: localStorage.getItem('url') + "dri/Alldrivers",
            data: JSON.stringify(type),
            type: 'get',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                $("#drivers").empty();
                $("#ndrivers").empty();
                $("#truckid").empty();
                for (var i = 0; i < result.res.length; i++) {
                    var driver, truckid;
                    dri = result.res[i].ICdriver_name;
                    tru = result.res[i].ICdriver_id;
                    // NoOfTrucks = result[i].NoOfTrucks
                    var btn = '<a class="dropdown-item dritru" href="#" data-driver ="' + dri + '" data-truck="' + tru + '" value = "' + dri + '">' + dri + '</a>'
                    $("#drivers").append(btn)
                    $("#ndrivers").append(btn)
                }

            }
        })
    }

    $('#drivers').on('click', '.dritru', function () {
        var ttype = $(this).attr('value');
        $("#sDriver").empty();
        $("#sDriver").append(ttype);
        $(".add-rows").prop('disabled', false);
        var dri = $(this).attr('data-driver')
        getBrokerFee(dri)
    })
    $('#ndrivers').on('click', '.dritru', function () {
        var ttype = $(this).attr('value');
        $("#nsDriver").empty();
        $("#nsDriver").append(ttype);
        $(".add-rows").prop('disabled', false);
        var dri = $(this).attr('data-driver')
        getBrokerFee(dri)

    })

    $("#DispTime").datetimepicker({
        datepicker: false,
        format: 'H:i'
    });

    $("#pre5").click(function () {
        var d = moment($("#DispDate").val(), 'MM-DD-YYYY');
        var dp = d.add('days', -5);
        dp = moment(dp).format('MM-DD-YYYY');
        $("#DispDate").val(dp);
        //$(".dispBlock").prop('disabled', true);
        $(".ddTT").prop('disabled', true);
        dateValidator();
        resetDisp()
        getDispatch(dp);
    })
    $("#yest").click(function () {
        var d = moment($("#DispDate").val(), 'MM-DD-YYYY');
        var dp = d.add('days', -1);
        dp = moment(dp).format('MM-DD-YYYY');
        $("#DispDate").val(dp);
        //$(".dispBlock").prop('disabled', true);
        $(".ddTT").prop('disabled', true);
        dateValidator();
        resetDisp()
        getDispatch(dp);
    })
    $("#tomm").click(function () {
        var d = moment($("#DispDate").val(), 'MM-DD-YYYY');
        var dp = d.add('days', 1);
        dp = moment(dp).format('MM-DD-YYYY');
        $("#DispDate").val(dp);
        //$(".dispBlock").prop('disabled', true);
        $(".ddTT").prop('disabled', true);
        dateValidator();
        resetDisp()
        getDispatch(dp);
    })
    $("#nex5").click(function () {
        var d = moment($("#DispDate").val(), 'MM-DD-YYYY');
        var dp = d.add('days', 5);
        dp = moment(dp).format('MM-DD-YYYY');
        $("#DispDate").val(dp);
        //$(".dispBlock").prop('disabled', true);
        $(".ddTT").prop('disabled', true);
        dateValidator();
        resetDisp()
        getDispatch(dp);
    })

    var dispatchTable = $("#dispatchTable").DataTable({
        dom: "<'row'<'col-md-6'f><'col-md-6'<'pull-right'B>>rti<'pull-right'p>",
        buttons: [
            'excel', 'pdf', 'print'
        ]
    });

    $(".add-rows").click(function () {
        var dritru = $("#sDriver").text();
        dritru = dritru.split(' - ');
        var newDispatch = {
            custId: $("#DCustomerId").val(),
            custName: $('#DCustomerName').text(),
            jobId: $('#DjobId').val(),
            jobName: $("#DJobName").text(),
            jobLoc: $("#DjobLocation").val(),
            jobType: $('#DjobType').val(),
            status: 'Accepted',
            notes: $("#DispNotes").val(),
            DispDate: $("#DispDate").val(),
            Time: $('#DispTime').val(),
            dispMaterial: $('#DispMaterial').val(),
            Fright_Bill: '',
            Truck: dritru[1],
            Driver: dritru[0],
            Rate: $("#DispRate").val(),
            Truck_Type: $("#ttype").text(),
            locA: $("#loca").val(),
            locB: $("#locb").val(),
            billRate: $('#DBRate').val()
        }
        addnewDispatch(newDispatch, dritru[0], dritru[1])
    })


    function addnewDispatch(newDispatch, driName, Truck) {
        console.log(newDispatch);
        $.ajax({
            url: localStorage.getItem('url') + "disp/newdispatch",
            data: JSON.stringify(newDispatch),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                var driverstat = updateDriverStat(driName, Truck, 'Accepted');
                console.log(driverstat);
                var c = parseInt($("#dispCount").text()) + 1
                $("#dispCount").empty();
                $("#dispCount").append(c);
                console.log(result);
                /*  dispatchTable.row.add( [
                     $('#DCustomerName').text(),
                     $('#DjobId').val(),
                     $('#DjobType').val(),
                     $('#ttype').text(),
                     $('#DispTime').val(),
                     $('#DispRate').val(),
                     dritru[0],
                     dritru[1],
                     '',
                     'Assigned',
                     $('#DispNotes').val(),
             ] ).draw( false ); */
                getDispatch($("#DispDate").val());
            }
        })

    }

    function updateDriverStat(Dname, truckID, status) {
        var reqData = {
            driver: Dname,
            truId: truckID,
            status: status
        }
        var stat
        $.ajax({
            url: localStorage.getItem('url') + "dri/dristatupdate",
            data: JSON.stringify(reqData),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.ok == 1 && result.nModified == 1) {
                    $('#ttype').empty()
                    $('#ttype').append('Truck Type')
                    $('#sDriver').empty()
                    $('#sDriver').append('Driver')
                    $('#drivers').empty()
                    $(".add-rows").prop('disabled', false);
                } else {
                    $('#ttype').empty()
                    $('#ttype').append('Truck Type')
                    $('#sDriver').empty()
                    $('#sDriver').append('Driver')
                    $('#drivers').empty()
                    //alert('Not Added to Dispatch Try again!! ')
                    $(".add-rows").prop('disabled', false);
                }
                return result.nModified;
            }
        })

    }

    function getCurrentDispatch(today) {
        var dates = {
            date: today
        }
        $.ajax({
            url: localStorage.getItem('url') + "disp/getDispatch",
            data: JSON.stringify(dates),
            type: 'post',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                var totaltrucks = 0;
                $("#dispJobs").empty();

                $.each(result, function (key, val) {
                    var i, j, l, m;
                    $.each(val, function (k, val) {
                        if (k == 'value') {
                            totaltrucks = parseInt(totaltrucks) + val.length;
                            $("#dispCount").empty();
                            $("#dispCount").append(totaltrucks);
                        } else if (k == 'customer_id') {
                            i = val;
                        } else if (k == 'customer_name') {
                            j = val;
                        } else if (k == 'job_id') {
                            l = val;
                        } else if (k == 'job_name') {
                            m = val;
                        }
                    })
                    var li = '<li class="list-group-item dark-white box-shadow-z0 b">' + i + ' / ' + j + ' / ' + l + ' / ' + m + '</li>';
                    $("#dispJobs").append(li);
                    var tr = '<td>' + j + '</td><td>' + l + '</td><td>' + m + '</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>'
                })
            }
        });
    }

    var thisDisp = [];

    function getDispatch(fordate) {
        var dates = {
            date: fordate
        }
        $.ajax({
            url: localStorage.getItem('url') + "disp/getDispatch",
            data: JSON.stringify(dates),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                thisDisp = result;
                // console.log(thisDisp)
                dispatchTable.clear().draw();
                $.each(result, function (key, val) {
                    dispatchTable.row.add([
                        parseInt(val._id.substr(val._id.length - 3), 16),
                        val.customer_name,
                        val.job_id,
                        val.job_name,
                        val.job_type,
                        val.Truck_Type,
                        val.Time,
                        val.Rate,
                        val.Driver || '',
                        val.Truck_id || '',
                        val.Fright_bill || val.Fright_bill || ''
                    ]).draw(false);
                })

            }
        });
    }


    $(".deleteRow").click(function () {
        dispatchTable.row($(this).parents('tr')).remove().draw();
    });

    var ftStat = false;

    $('#dispatchTable tbody').on('click', 'tr', function () {
        dispatchTable.$('tr.light-blue-500').removeClass('light-blue-500');
        $(this).addClass('light-blue-500');
        var row = dispatchTable.row(this).data();
        console.log(row);
        clearform()
        $('#waningDiv').hide();
        $('#ftbWarning').hide()
        $('#DispUpdate').show()
        var drivers = [], index;
        getRates(row[1], $("#DispDate").val(), row[4])
        getBrokerFee(row[8])
        //fetching index of this dispatch in thisDisp array
        $.each(thisDisp, function (key, val) {
            $.each(val, function (k, v) {
                if (k == '_id') {
                    if (row[0] == parseInt(v.substr(v.length - 3), 16)) {
                        index = key
                    }
                }
            })
        })

        $('#EDStatus').removeClass('white');
        $('#EDStatus').removeClass('primary');
        $('#EDStatus').removeClass('success');
        $('#EDStatus').removeClass('danger');
        if (row[8] == '' || row[8] == 'Select Driver') {
            $('.ftDetails').hide()
            $('#edDriver').empty()
            $('#edDriver').append('Select Driver')
            $("#edDriIn").hide();
            $("#edDriN").show();
            $("#EDtid").val('');
            $("#edDri").empty();
            $("#EDtid").prop('disabled', false);
            var type = {
                tt: row[4]
            }
            $("#edDrivers").empty();
            ftStat = true;
            $("#EDfb").prop('disabled', false);
            $('#EDStatus').prop('disabled', false);
            $('#EDfbButton').empty()
            $('#EDfb').val('')
            $('#EDfb').show()
            $('#EDfbButton').hide()
            $.ajax({
                url: localStorage.getItem('url') + "dri/Alldrivers",
                data: JSON.stringify(type),
                type: 'get',
                dataType: 'json',
                contentType: 'application/json',
                beforeSend: function (xhr) {
                    $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
                },
                success: function (result) {
                    $.unblockUI();
                    drivers = result.res;
                    $.each(result.res, function (key, val) {
                        var btn;
                        btn = '<a class="dropdown-item eddritru" data-truckID="' + val.ICdriver_id + '" id = "' + val.ICdriver_name + '">' + val.ICdriver_name + '</a>'
                        $("#edDrivers").append(btn)
                    })

                }
            })
        } else {
            $('.ftDetails').show()
            $("#edDriver").val('');
            // var dri = '<input type="text" id = "edDriIn" class="form-control col-md-1" value = "' + row[7] + '">';
            $("#edDriver").val(row[8]);
            $("#EDtid").empty();
            $("#EDtid").val(row[9]);
            if (row[10] == '') {
                ftStat = true;
                $("#EDfb").prop('disabled', false);
                $('#EDStatus').prop('disabled', false);
                $('#EDfbButton').empty()
                $('#EDfb').val('')
                $('#EDfb').show()
                $('#EDfbButton').hide()

            } else {
                $('#EDfb').val(row[10]);
                $("#EDfb").prop('disabled', true);
                $('#EDStatus').prop('disabled', true);
                getFtBill($('#EDfb').val())
            }
        }
        $('#EDStatus').empty();
        $('#DispUpdate').show()
        if (thisDisp[index].status == 'New') {
            $("#EDfb").prop('disabled', false);
            $('#EDStatus').addClass('white');
            $('#EDStatus').removeClass('warning');
            $('#EDStatus').removeClass('success');
            $('#EDStatus').removeClass('danger');
            $("#CanDisp").show();
            $('#EDStatus').append('New');
        } else if (thisDisp[index].status == 'Assigned') {
            $("#EDfb").prop('disabled', false);
            $('#EDStatus').addClass('warning');
            $('#EDStatus').removeClass('success');
            $('#EDStatus').removeClass('danger');
            $("#CanDisp").show();
            $('#EDStatus').append('Assigned');
        } else if (thisDisp[index].status == 'Accepted') {
            $('#EDStatus').addClass('success');
            $('#EDStatus').removeClass('warning');
            $('#EDStatus').removeClass('danger');
            $("#CanDisp").hide();
            $('#EDStatus').append('Accepted');
        } else if (thisDisp[index].status == 'Cancel') {
            $("#EDfb").prop('disabled', false);
            $('#EDStatus').addClass('danger');
            $('#EDStatus').removeClass('warning');
            $('#EDStatus').removeClass('success');
            $("#CanDisp").hide();
            $('#EDStatus').append('Cancel');
            $('.ftDetails').hide()
            $('#DispUpdate').hide()
        }
        $("#EDispID").val(row[0])
        $('#EDcustname').val(row[1]);
        $('#EDjobid').val(row[2]);
        $('#EDjobtype').val(row[3]);
        $('#EDtt').val(row[4]);
        $('#EDtime').val(row[5]);
        $('#EDrate').val(row[6]);
        $('#locA').empty();
        $('#locB').empty();
        $('#material').empty();
        $('#material').val(thisDisp[index].material);
        $('#locA').val(thisDisp[index].locA);
        $('#locB').val(thisDisp[index].locB);
        $('#EDnotes').val(row[11]);
        $('#editDisp').modal('show');
    });

    $("#pointSwap").click(function () {
        var a = $("#loca").val();
        var b = $("#locb").val();
        $("#loca").empty()
        $("#locb").empty()
        $("#loca").val(b)
        $("#locb").val(a)
    })

    $(".edstat").click(function () {
        var stat = $(this).attr('value')
        dispStat(stat)
    })
    function dispStat(stat) {
        if (stat == 'New') {
            $('#EDStatus').addClass('white');
            $('#EDStatus').removeClass('warning');
            $('#EDStatus').removeClass('success');
            $('#EDStatus').removeClass('danger');
            $('#CanDisp').show();
        } else if (stat == 'Assigned') {
            $('#EDStatus').addClass('warning');
            $('#EDStatus').removeClass('success');
            $('#EDStatus').removeClass('danger');
            $('#CanDisp').show();
        } else if (stat == 'Accepted') {
            $('#EDStatus').addClass('success');
            $('#EDStatus').removeClass('warning');
            $('#EDStatus').removeClass('danger');
            $('#CanDisp').hide();
        } else if (stat == 'Cancel') {
            $('#EDStatus').addClass('danger');
            $('#EDStatus').removeClass('warning');
            $('#EDStatus').removeClass('success');
            $('#CanDisp').show();
        }
        $('#EDStatus').empty();
        $('#EDStatus').append(stat);
    }

    $("#edDrivers").on('click', '.eddritru', function () {
        $("#edDriver").empty();
        $("#edDriver").append($(this).attr('id'))
        $('#EDtid').empty();
        $("#EDtid").val($(this).attr("data-truckID"))
        dispStat('Accepted')
    })

    $('#AllDispatchTbody').on('click', 'edit', function () {
        alert($(this).parents('tr'));
    })
    var notes = false;
    $('#EDnotes').on('change', function () {
        notes = true
    })

    $("#CanDisp").click(function () {
        console.log(notes);
        $('#waningDiv').hide();
        if (!notes) {
            $('#waningDiv').show();
            $('#warning').empty();
            $('#warning').append('please Update the notes above');
        } else {
            var dispdata = {
                jid: $('#EDjobid').val(),
                jtype: $('#EDjobtype').val(),
                jtt: $('#EDtt').val(),
                jtime: $('#EDtime').val(),
                jrate: $('#EDrate').val(),
                dstatus: 'Cancel',
                dnotes: $("#EDnotes").val(),
                dri: $("#edDriIn").val(),
                truId: $('#EDtid').val()
            }
            var dri = $("#edDriIn").val();
            console.log(dispdata)
            $.ajax({
                url: localStorage.getItem('url') + "disp/updateDispStat",
                data: JSON.stringify(dispdata),
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
                beforeSend: function (xhr) {
                    $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
                },
                success: function (result) {
                    $.unblockUI();
                    console.log(result)
                    if (result.nModified === 1) {
                        updateDriverStat(dri, 'Available', today)
                        getDispatch($("#DispDate").val());
                    }
                }
            })
            $("#editDisp").modal('hide');
        }
    })
    $('.autoCompleteDri').click(function () {
        var AllDri = JSON.parse(localStorage.getItem('Drivers'))
        $("#edDriver").autocomplete({
            source: AllDri
        });
    });
    $("#DispUpdate").click(function () {
        if ($('#edDriver').val() == '') {
            alert('please Select Driver')
            return
        }
        var id = $("#EDispID").val(), fullId
        $.each(thisDisp, function (key, val) {
            var v = val._id
            var i = parseInt(v.substr(v.length - 3), 16)
            if (id == i) {
                fullId = v
            }
        })
        var dri
        if ($('#edDriver').val() == 'Driver' || $('#edDriver').val() == '') {
            dri = ''
        } else {
            dri = $('#edDriver').val()
        }
        var dispData = {
            id: fullId,
            job_id: $('#EDjobid').val(),
            tt: $('#EDtt').val(),
            EDtime: $('#EDtime').val(),
            driver: dri,
            truck_id: $('#EDtid').val(),
            Fbill: $('#EDfb').val(),
            status: $('#EDStatus').text(),
            notes: $('#EDnotes').val(),
            dispDate: moment($("#DispDate").val()).format('MM/DD/YYYY')
        }

        var Fbill = $('#EDfb').val()
        $.ajax({
            url: localStorage.getItem('url') + "disp/dispUpdate",
            data: JSON.stringify(dispData),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.nModified == 1) {
                    if (Fbill && ftStat) {
                        addFtBill(dispData);
                    }
                    $('#editDisp').modal('hide');
                    getDispatch($("#DispDate").val());
                } else if (result.ok == 1) {
                    if ($('#EDfb').val() != '') {
                        saveFtBill(dispData)
                    }
                    $('#editDisp').modal('hide');
                }
            }
        })
    })


    function addFtBill(dispData) {
        var id = dispData.id, index;

        $.each(thisDisp, function (key, val) {
            if (id == val._id) {
                index = key
            }
        })
        var dri = $('#edDriver').val().trim() || ''
        console.log(dri)
        if (dri == undefined || dri == '') {
            alert('Error in saving driver info try again')
            return
        }
        var truckID = ''
        truckID = thisDisp[index].Truck_id || ''
        truckID = truckID.split('-')
        var newFtBill = {
            custId: thisDisp[index].customer_id,
            custName: thisDisp[index].customer_name,
            jobId: thisDisp[index].job_id,
            jobName: thisDisp[index].job_name,
            jobLoc: thisDisp[index].job_location,
            jobType: thisDisp[index].job_type,
            status: 'Created',
            notes: thisDisp[index].notes,
            Date: moment($('#DispDate').val(), 'MM-DD-YYYY'),
            Time: thisDisp[index].Time,
            Fright_Bill: $('#EDfb').val(),
            billRate: thisDisp[index].billRate,
            Truck_id: thisDisp[index].Truck_id,
            Driver: dri,
            DriverId: truckID[0],
            Rate: thisDisp[index].Rate,
            Truck_Type: thisDisp[index].Truck_Type,
            locA: thisDisp[index].locA,
            locB: thisDisp[index].locB
        }
        console.log(newFtBill);

        $.ajax({
            url: localStorage.getItem('url') + "ftb/ftBillAdd",
            data: JSON.stringify(newFtBill),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                console.log(result);
                if (result.msg == 'success') {
                    ftStat = false;
                    if ($('#btotal').val()) {
                        saveFtBill(newFtBill)
                    }
                }
                saveDriverPay(newFtBill)
            }
        })

    }



    function getFtBill(ftBill, date) {
        $('.invDetails').hide()
        var billId = { bill: ftBill } || { bill: $("#billId").val() }, i = 0
        $.ajax({
            url: localStorage.getItem('url') + "ftb/getFtBill",
            data: JSON.stringify(billId),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                console.log(result);
                if (result.length > 1) {
                    $.each(result, function (key, val) {
                        if (moment(val.date).format('MM-DD-YYYY') == date) {
                            i = key
                        }
                    })
                }
                $(".tag_id").val(result[i].Fright_Bill)
                $(".customer_id").val(result[i].customer_id)
                $(".customer_name").val(result[i].customer_name)
                $(".job_id").val(result[i].job_id)
                $(".job_name").val(result[i].job_name)
                $(".job_type").val(result[i].job_type)
                //$("#DriverId").val(result[i].)
                $(".DriverName").val(result[i].Driver)
                $('.DriverId').val(result[i].driver_id)
                $(".Truck_id").val(result[i].Truck_id)
                $(".Truck_name").val(result[i].Truck_Type)
                $(".DisNotes").val(result[i].notes)
                $(".locA").val(result[i].LocA)
                $(".locB").val(result[i].LocB)
                $(".FTDispTime").val(result[i].Time)
                $(".JobLoc").val(result[i].job_location)
                $(".FTDispDate").val(moment(result[i].date).format('MM-DD-YYYY'))
                $('.invoiced').prop('disabled', false);
                $('.bdumpfee').val(result[i].dumpFee)
                $('.bStandBy').val(result[i].stTime)
                $('.bMaterial').val(result[i].mFee)
                if (result[i].Driver == 'Ours') {

                }
                if (result[i].status == 'Entered') {
                    getbillingInfo(result[i]);
                    viewbillingInfo(result[i])
                } else if (result[i].status == 'Invoiced' || result[i].status == 'Preview' || result[i].status == 'Paid' || result[i].status == 'P-Paid') {
                    $(".invoiced").prop('disabled', true);
                    $('.invIds').empty()
                    $('.invDate').empty()
                    $('.invIds').append(result[i].invId)
                    $('.invDate').append(moment(result[i].invDate).format('MM-DD-YYYY'))
                    getbillingInfo(result[i]);
                    viewbillingInfo(result[i])
                    $('.invDetails').show()
                } else {
                    getRates(result[i].job_id, result[i].date, result[i].Truck_Type)
                    getBrokerFee(result[i].Driver)
                }
                ValidateTotal()

            }
        })
    }

    function getRates(jId, dispDate, ttype) {
        if (jId == '' || dispDate == '' || ttype == '') {
            return
        }
        var weeknumb = moment(dispDate).weekday()
        var name = {
            job_id: jId,
            weeknumb: weeknumb,
            ttype: ttype
        }
        $.ajax({
            url: localStorage.getItem('url') + "job/jjobs1",
            data: JSON.stringify(name),
            type: 'post',
            http2: true,
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                console.log(result)
                $('#BHRate').val(result.bHr)
                $('#BLRate').val(result.bLoad)
                $('#BTRate').val(result.bTon)
                $('#PHRate').val(result.pHr)
                $('#PLRate').val(result.pLoad)
                $('#PTRate').val(result.pTon)
                $('.BHRate').val(result.bHr)
                $('.BLRate').val(result.bLoad)
                $('.BTRate').val(result.bTon)
                $('.PHRate').val(result.pHr)
                $('.PLRate').val(result.pLoad)
                $('.PTRate').val(result.pTon)
                $('#nPHRate').val(result.pHr)
                $('#nPLRate').val(result.pLoad)
                $('#nPTRate').val(result.pTon)

            }
        })
    }
    $("#AllDriFtbills").change(function () {
        getBrokerFee($("#AllDriFtbills").val())
    })

    function getBrokerFee(driver) {
        if (driver == '') {
            $('#FeePercent').val('')
            $('#nFeePercent').val('')
            $('#nPHRate').val('')
            $('#nPLRate').val('')
            $('#nPTRate').val('')
            return true
        }
        var data = {
            dname: driver
        }
        $.ajax({
            url: localStorage.getItem('url') + "dri/driFee",
            data: JSON.stringify(data),
            type: 'post',
            http2: true,
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                $('#FeePercent').empty()
                if (result.msg == 'Our') {
                    var hr = result.Fee[0].payHr,
                        per = result.Fee[0].payPer + '%'
                    $('.PHRate').val(hr)
                    $('.PLRate').val(per)
                    $('.PTRate').val(per)
                    $('#PHRate').val(hr)
                    $('#PLRate').val(per)
                    $('#PTRate').val(per)
                    $('#nPHRate').val(hr)
                    $('#nPLRate').val(per)
                    $('#nPTRate').val(per)
                    $('#nFeePercent').val(0)
                } else {
                    $('#FeePercent').val(result.Fee.BrokerFee)
                    $('#nFeePercent').val(result.Fee.BrokerFee)
                    $('#nPHRate').val('')
                    $('#nPLRate').val('')
                    $('#nPTRate').val('')
                    var x = $('#ptotal').val()
                    var x = $('#nptotal').val()
                    var y = x / result.Fee.BrokerFee
                    $('#pNetTot').val(x - y)
                    $('#npNetTot').val(x - y)
                    getRates($('#nDjobId').val(), $('#FTDispDate').val(), $('#nttypes').text())
                }
                ValidateTotal()
            }
        })
    }

    function saveFtBill(dispData) {
        var dri = $('#edDriver').val().trim() || ''
        console.log(dri)
        if (dri == undefined || dri == '') {
            alert('Error in saving driver info try again')
            return
        }
        var now = new Date();
        var ftData = {
            tagid: $('#EDfb').val(),
            date: moment($('#DispDate').val(), 'MM-DD-YYYY'),
            Driver: dri,
            customer_name: $('#EDcustname').val(),
            updated: localStorage.username,
            updatedTime: now,
            status: 'Entered',
            BHQty: $('#BHQty').val(),
            BHRate: $('#BHRate').val(),
            BHTotal: $('#BHTotal').val(),
            BLQty: $('#BLQty').val(),
            BLRate: $('#BLRate').val(),
            BLTotal: $('#BLTotal').val(),
            BTQty: $('#BTQty').val(),
            BTRate: $('#BTRate').val(),
            BTTotal: $('#BTTotal').val(),
            BTollQty: $('#BTollQty').val(),
            BTollRate: $('#BTollRate').val(),
            BTollTotal: $('#BTollTotal').val(),
            BDFQty: $('#BDFQty').val(),
            BDFRate: $('#BDFRate').val(),
            BDFTotal: $('#BDFTotal').val(),
            BSTQty: $('#BSTQty').val(),
            BSTRate: $('#BSTRate').val(),
            BSTTotal: $('#BSTTotal').val(),
            BMQty: $('#BMQty').val(),
            BMRate: $('#BMRate').val(),
            BMTax: $('#BMTax').val(),
            BMTotal: $('#BMTotal').val(),
            btotal: $('#btotal').val(),
            PHQty: $('#PHQty').val(), PHRate: $('#PHRate').val(), PHTotal: $('#PHTotal').val(),
            PLQty: $('#PLQty').val(), PLRate: $('#PLRate').val(), PLTotal: $('#PLTotal').val(),
            PTQty: $('#PTQty').val(), PTRate: $('#PTRate').val(), PTTotal: $('#PTTotal').val(),
            PTollQty: $('#PTollQty').val(), PTollRate: $('#PTollRate').val(), PTollTotal: $('#PTollTotal').val(),
            PDFQty: $('#PDFQty').val(), PDFRate: $('#PDFRate').val(), PDFTotal: $('#PDFTotal').val(),
            PSTQty: $('#PSTQty').val(), PSTRate: $('#PSTRate').val(), PSTTotal: $('#PSTTotal').val(),
            PBRFeeRate: $('#FeePercent').val(), PBRFee: $('#BrokerFee').val(),
            ptotal: $('#ptotal').val(), pNetTotal: $('#pNetTot').val()
        }
        $.ajax({
            url: localStorage.getItem('url') + "ftb/updateFtBill",
            data: JSON.stringify(ftData),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.ok == 1) {
                    saveDriverPay(dispData)
                    clearform()
                } else {
                    alert('Fright Bill Details Not Updateed Please Try again!!')
                }
            }
        })

    }

    $('#BHQty,#BHRate').change(function () {
        $('#PHQty').val($('#BHQty').val())
        $('#BHTotal').val($('#BHQty').val() * $('#BHRate').val())
        $('#PHTotal').val($('#PHQty').val() * $('#PHRate').val())
        bTotal()
        pTotal()
    })
    $('#BLQty,#BLRate').change(function () {
        $('#PLQty').val($('#BLQty').val())
        $('#BLTotal').val($('#BLQty').val() * $('#BLRate').val())
        $('#PLTotal').val($('#PLQty').val() * $('#PLRate').val())
        var rate = $('#PLRate').val()
        if (rate.includes('%')) {
            rate = parseInt(rate.slice(0, -1)) / 100
            $('#PLTotal').val($('#BLTotal').val() * rate)
        }
        bTotal()
        pTotal()
    })
    $('#BTQty,#BTRate').change(function () {
        var rate = $('#PTRate').val()
        $('#PTQty').val($('#BTQty').val())
        $('#BTTotal').val($('#BTQty').val() * $('#BTRate').val())
        $('#PTTotal').val($('#PTQty').val() * $('#PTRate').val())
        if (rate.includes('%')) {
            rate = parseInt(rate.slice(0, -1)) / 100
            $('#PTTotal').val($('#BTTotal').val() * rate)
        }
        bTotal()
        pTotal()
    })
    $('#BTollQty,#BTollRate').change(function () {
        $('#PTollQty').val($('#BTollQty').val())
        $('#PTollRate').val($('#BTollRate').val())
        $('#BTollTotal').val($('#BTollQty').val() * $('#BTollRate').val())
        $('#PTollTotal').val($('#PTollQty').val() * $('#PTollRate').val())
        bTotal()
        pTotal()
    })
    $('#BDFQty,#BDFRate').change(function () {
        $('#BDFTotal').val($('#BDFQty').val() * $('#BDFRate').val())
        bTotal()
    })
    $('#BSTQty,#BSTRate').change(function () {
        $('#BSTTotal').val($('#BSTQty').val() * $('#BSTRate').val())
        bTotal()
    })
    $('#BMQty,#BMRate,#BMTax').change(function () {
        var i = $('#BMQty').val() * $('#BMRate').val();
        $('#BMTotal').val(parseFloat(i + (i * (parseFloat($('#BMTax').val()) / 100))))
        bTotal()
    })

    function bTotal() {
        var a = parseFloat($('#BHTotal').val()) || 0,
            b = parseFloat($('#BLTotal').val()) || 0,
            c = parseFloat($('#BTTotal').val()) || 0,
            d = parseFloat($('#BTollTotal').val()) || 0,
            e = parseFloat($('#BDFTotal').val()) || 0,
            f = parseFloat($('#BSTTotal').val()) || 0,
            g = parseFloat($('#BMTotal').val()) || 0
        var t = a + b + c + d + e + f + g
        $('#btotal').val(t.toFixed(2))
        ValidateTotal()
    }
    $('#PHQty,#PHRate').change(function () {
        var temp = $('#PHQty').val() * $('#PHRate').val()
        $('#PHTotal').val(temp.toFixed(2))
        pTotal()
    })
    $('#PLQty,#PLRate').change(function () {
        var temp = $('#PLQty').val() * $('#PLRate').val()
        $('#PLTotal').val(temp.toFixed(2))
        var rate = $('#PLRate').val()
        if (rate.includes('%')) {
            rate = parseInt(rate.slice(0, -1)) / 100
            var temp = $('#BLTotal').val() * rate
            $('#PLTotal').val(temp.toFixed(2))
        }

        pTotal()
    })
    $('#PTQty,#PTRate').change(function () {
        $('#PTTotal').val($('#PTQty').val() * $('#PTRate').val())
        var rate = $('#PTRate').val()
        if (rate.includes('%')) {
            rate = parseInt(rate.slice(0, -1)) / 100
            var temp = $('#BTTotal').val() * rate
            $('#PTTotal').val(temp.toFixed(2))
        }
        pTotal()
    })
    $('#PTollQty,#PTollRate').change(function () {
        var temp = $('#PTollQty').val() * $('#PTollRate').val()
        $('#PTollTotal').val(temp.toFixed(2))
        pTotal()
    })
    $('#PDFQty,#PDFRate').change(function () {
        var temp = $('#PDFQty').val() * $('#PDFRate').val()
        $('#PDFTotal').val(temp.toFixed(2))
        pTotal()
    })
    $('#PSTQty,#PSTRate').change(function () {
        var temp = $('#PSTQty').val() * $('#PSTRate').val()
        $('#PSTTotal').val(temp.toFixed(2))
        pTotal()
    })
    $('#PMQty,#PMRate,#PMTax').change(function () {
        var temp = parseFloat($('#PMQty').val() * $('#PMRate').val()) + parseFloat($('#PMTax').val())
        $('#PMTotal').val(temp.toFixed(2))
        pTotal()
    })
    $('#FeePercent').change(function () {
        pTotal()
    })

    function pTotal() {
        var h = parseFloat($('#FeePercent').val())
        var a = parseFloat($('#PHTotal').val()) || 0,
            b = parseFloat($('#PLTotal').val()) || 0,
            c = parseFloat($('#PTTotal').val()) || 0,
            d = parseFloat($('#PTollTotal').val()) || 0,
            e = parseFloat($('#PDFTotal').val()) || 0,
            f = parseFloat($('#PSTTotal').val()) || 0,
            g = parseFloat($('#PMTotal').val()) || 0, y

        x = a + b + c + d + e + f + g
        $('#ptotal').val(x.toFixed(2))
        if (!h) {
            y = 0
        } else {
            h = h / 100
            y = (a + b + c) * h
            y = y.toFixed(2)
        }
        $('#BrokerFee').val(y)
        var i = x - y
        $('#pNetTot').val(i.toFixed(2))
        ValidateTotal()
    }

    function ValidateTotal() {

        var bill = parseFloat($('#btotal').val()), pay = parseFloat($('#pNetTot').val())
        if (pay > bill) {
            alert('Pay amount is more than Bill. Please verify again');
            $('#btotal').addClass('error')
            $('#pNetTot').addClass('error')
            $('#icon').removeClass('fa-arrow-up')
            $('#icon').addClass('fa-arrow-down')
            $('#MarVal').empty()
            var p = (pay / bill)
            var p1 = p.toString()
            var persent = p1.substr(0, 4), d = pay - bill,
                tot = '$ ' + d + ' - ' + persent
            $('#MarVal').append(tot)
            $('.alerts').addClass('text-danger')
            $('.alerts').removeClass('text-success')
        } else {
            $('#btotal').removeClass('error')
            $('#pNetTot').removeClass('error')
            $('#btotal').addClass('b-success')
            $('#pNetTot').addClass('b-success')
            $('.icon').addClass('fa-arrow-up')
            $('.icon').removeClass('fa-arrow-down')
            $('#MarVal').empty()
            $('.alerts').addClass('text-success')
            $('.alerts').removeClass('text-danger')
            var p = (bill / pay)
            var p1 = p.toString()
            var persent = p1.substr(0, 4), d = bill - pay,
                tot = '$ ' + d + ' ( ' + persent + '% )'
            $('#MarVal').append(tot)
        }

    }
    function saveDriverPay(newFtBill) {
        var now = new Date(), id = newFtBill.id, index;

        $.each(thisDisp, function (key, val) {
            $.each(val, function (k, v) {
                if (k == '_id') {
                    if (id == v) {
                        index = key
                    }
                }
            })
        })
        var dri = $('#edDriver').val().trim() || ''
        console.log(dri)
        if (dri == undefined || dri == '') {
            alert('Error in saving driver info try again')
            return
        }
        var Apayable = {
            tagDate: moment($('#DispDate').val(), 'MM-DD-YYYY'),
            driver: dri,
            driverId: $('#EDtid').val(),
            BHRate: $('#BHRate').val(), BLRate: $('#BLRate').val(), BTRate: $('#BTRate').val(),
            PHQty: $('#PHQty').val(), PHRate: $('#PHRate').val(), PHTotal: $('#PHTotal').val(),
            PLQty: $('#PLQty').val(), PLRate: $('#PLRate').val(), PLTotal: $('#PLTotal').val(),
            PTQty: $('#PTQty').val(), PTRate: $('#PTRate').val(), PTTotal: $('#PTTotal').val(),
            PTollQty: $('#PTollQty').val(), PTollRate: $('#PTollRate').val(), PTollTotal: $('#PTollTotal').val(),
            PDFQty: $('#PDFQty').val(), PDFRate: $('#PDFRate').val(), PDFTotal: $('#PDFTotal').val(),
            PSTQty: $('#PSTQty').val(), PSTRate: $('#PSTRate').val(), PSTTotal: $('#PSTTotal').val(),
            PBRFeeRate: $('#FeePercent').val(), PBRFee: $('#BrokerFee').val(),
            ptotal: $('#ptotal').val(), pNetTotal: $('#pNetTot').val(),
            updated: localStorage.username,
            updatedTime: now,
            status: 'Created',
            tagid: newFtBill.Fright_Bill || thisDisp[index].Fright_bill,
            customer_id: newFtBill.custId || thisDisp[index].customer_id,
            custName: newFtBill.custName || thisDisp[index].customer_name,
            jobId: newFtBill.jobId || thisDisp[index].job_id,
            jobName: newFtBill.jobName || thisDisp[index].job_name,
            jobType: newFtBill.jobType || thisDisp[index].job_type,
        }
        $.ajax({
            url: localStorage.getItem('url') + "dri/addBillDriver",
            data: JSON.stringify(Apayable),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                console.log(result)
                if (result.msg == 'success') {
                    alert('bill added Successfully')
                } else {
                    alert('error in adding Payables. Please Try again')
                }
            }
        }).fail(function () {
            $.unblockUI();
            alert("error");
        })
    }

    function getbillingInfo(data) {
        $('#BHQty').val(data.BHQty)
        $('#BHRate').val(data.BHRate)
        $('#BHTotal').val(data.BHTotal)
        $('#BLQty').val(data.BLQty)
        $('#BLRate').val(data.BLRate)
        $('#BLTotal').val(data.BLTotal)
        $('#BTQty').val(data.BTQty)
        $('#BTRate').val(data.BTRate)
        $('#BTTotal').val(data.BTTotal)
        $('#BTollQty').val(data.BTollQty)
        $('#BTollRate').val(data.BTollRate)
        $('#BTollTotal').val(data.BTollTotal)
        $('#BDFQty').val(data.BDFQty)
        $('#BDFRate').val(data.BDFRate)
        $('#BDFTotal').val(data.BDFTotal)
        $('#BSTQty').val(data.BSTQty)
        $('#BSTRate').val(data.BSTRate)
        $('#BSTTotal').val(data.BSTTotal)
        $('#BMQty').val(data.BMQty)
        $('#BMRate').val(data.BMRate)
        $('#BMTax').val(data.BMTax)
        $('#BMTotal').val(data.BMTotal)
        $('#PHQty').val(data.PHQty)
        $('#PHRate').val(data.PHRate)
        $('#PHTotal').val(data.PHTotal)
        $('#PLQty').val(data.PLQty)
        $('#PLRate').val(data.PLRate)
        $('#PLTotal').val(data.PLTotal)
        $('#PTQty').val(data.PTQty)
        $('#PTRate').val(data.PTRate)
        $('#PTTotal').val(data.PTTotal)
        $('#PTollQty').val(data.PTollQty)
        $('#PTollRate').val(data.PTollRate)
        $('#PTollTotal').val(data.PTollTotal)
        $('#PDFQty').val(data.PDFQty)
        $('#PDFRate').val(data.PDFRate)
        $('#PDFTotal').val(data.PDFTotal)
        $('#PSTQty').val(data.PSTQty)
        $('#PSTRate').val(data.PSTRate)
        $('#PSTTotal').val(data.PSTTotal)
        $('#FeePercent').val(data.PBRFeeRate)
        $('#BrokerFee').val(data.PBRFee)
        $('#updatedBy').empty()
        $('#updatedBy').append(data.updateBy)
        $('#btotal').val(data.bTotal)
        $('#ptotal').val(data.pTotal)
        $('#pNetTot').val(data.pNetTotal)
        var dd = moment(data.updatedDate).format('MM-DD-YYYY hh:mm A');
        $('#updatedDate').empty()
        $('#updatedDate').append(dd)
    }

    function viewbillingInfo(data) {
        $('.BHQty').val(data.BHQty)
        $('.BHRate').val(data.BHRate)
        $('.BHTotal').val(data.BHTotal)
        $('.BLQty').val(data.BLQty)
        $('.BLRate').val(data.BLRate)
        $('.BLTotal').val(data.BLTotal)
        $('.BTQty').val(data.BTQty)
        $('.BTRate').val(data.BTRate)
        $('.BTTotal').val(data.BTTotal)
        $('.BTollQty').val(data.BTollQty)
        $('.BTollRate').val(data.BTollRate)
        $('.BTollTotal').val(data.BTollTotal)
        $('.BDFQty').val(data.BDFQty)
        $('.BDFRate').val(data.BDFRate)
        $('.BDFTotal').val(data.BDFTotal)
        $('.BSTQty').val(data.BSTQty)
        $('.BSTRate').val(data.BSTRate)
        $('.BSTTotal').val(data.BSTTotal)
        $('.BMQty').val(data.BMQty)
        $('.BMRate').val(data.BMRate)
        $('.BMTax').val(data.BMTax)
        $('.BMTotal').val(data.BMTotal)
        $('.PHQty').val(data.PHQty)
        $('.PHRate').val(data.PHRate)
        $('.PHTotal').val(data.PHTotal)
        $('.PLQty').val(data.PLQty)
        $('.PLRate').val(data.PLRate)
        $('.PLTotal').val(data.PLTotal)
        $('.PTQty').val(data.PTQty)
        $('.PTRate').val(data.PTRate)
        $('.PTTotal').val(data.PTTotal)
        $('.PTollQty').val(data.PTollQty)
        $('.PTollRate').val(data.PTollRate)
        $('.PTollTotal').val(data.PTollTotal)
        $('.PDFQty').val(data.PDFQty)
        $('.PDFRate').val(data.PDFRate)
        $('.PDFTotal').val(data.PDFTotal)
        $('.PSTQty').val(data.PSTQty)
        $('.PSTRate').val(data.PSTRate)
        $('.PSTTotal').val(data.PSTTotal)
        $('.FeePercent').val(data.PBRFeeRate)
        $('.BrokerFee').val(data.PBRFee)
        $('.updatedBy').empty()
        $('.updatedBy').append(data.updateBy)
        $('.btotal').val(data.bTotal)
        $('.ptotal').val(data.pTotal)
        $('.pNetTot').val(data.pNetTotal)
        var dd = moment(data.updatedDate).format('MM-DD-YYYY hh:mm A');
        $('.updatedDate').empty()
        $('.updatedDate').append(dd)
    }

    var idate = moment().weekday(0);

    $("#invdate").val(moment(idate).format('MM-DD-YYYY'));

    $('#invdate').datetimepicker({
        onGenerate: function (ct) {
            $(this).find('.xdsoft_date.xdsoft_weekend')
                .addClass('xdsoft_disabled');
        },
        weekend: ['01.01.2014', '02.01.2014', '03.01.2014', '04.01.2014', '05.01.2014', '06.01.2014'],
        timepicker: false,
        format: 'm-d-Y'
    });
    function clearform() {
        $('.ccfrm').empty()
        $('.ccfrm').val('')
    }

    $("ol").on("click", "span.viewTag", function () {
        //alert($(this).attr('id'))
        clearform();
        $('.tag_id').append($(this).attr('id'))
        getFtBill($(this).attr('id'), $(this).attr('data-date'))
        $('#FtBillShow').modal('show');

    })

    /* function viewFtBill() {
        $('#EDfbButton').empty()
        $('#EDfbButton').append($('#EDfb').val())
        $('#EDfb').hide()
        $('#EDfbButton').show()
     
    }
    $('#EDfbButton').click(function () {
        $('#editDisp').modal('hide')
        $('#Dispatchs').hide()
        $('#Bills').show()
        clearform()
        getFtBill($('#EDfbButton').text())
    }) */


    $('#EDfb').change(function () {
        var FtBill = {
            bill: $('#EDfb').val()
        }

        $.ajax({
            url: localStorage.getItem('url') + "ftb/uniqueFTB",
            data: JSON.stringify(FtBill),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (res) {
                if (res.length == 0) {
                    $('#ftbWarning').hide()
                    $('#DispUpdate').show()
                } else {
                    $("#editDisp").modal('hide')
                    var ftbs = ''
                    for (var i = 0; i < res.length; i++) {
                        ftbs += ' <pre><span> FT Bill: </span>' +
                            '<span id = "' + res[i].Fright_Bill + '"class="viewTag text-primary" data-date="' + moment(res[i].date).format('MM-DD-YYYY') + '" >' + res[i].Fright_Bill + '</span>' +
                            '<span>, Cutsome Name: ' + res[i].customer_name + '</span>' +
                            '<span>, Date: ' + moment(res[i].date).format('MM-DD-YYYY') + '</span></pre>'
                    }
                    $('#Ftbills').empty()
                    $('#Ftbills').append(ftbs);
                    //$('div').attr('data-info', '222');
                    //$("#UniqFtbClose").atr(data-ftb)
                    $('#UniqFtb').modal('show')
                }
            }
        })
    })
    $("div").on("click", "span.viewTag", function () {
        $('#UniqFtb').modal('hide')
        clearform();
        getFtBill($(this).attr('id'), $(this).attr('data-date'))
        $('#FtBillShow').modal('show');

    })

    $('#UniqFtbClose').click(function () {
        $('#UniqFtb').modal('hide')
        $('#ftbWarning').show()
        $('#DispUpdate').hide()
        $('#editDisp').modal('show');
    })

    $('#DispDelete').click(function () {
        $('#DeleteDisp').modal('show')
    })

    $('#DelDisp').click(function () {
        var id = $("#EDispID").val(), fullId
        $.each(thisDisp, function (key, val) {
            $.each(val, function (k, v) {
                if (k == '_id') {
                    if (id == v.substr(v.length - 4)) {
                        fullId = v
                    }
                }
            })
        })
        var dispData = {
            id: fullId,
        }
        $.ajax({
            url: localStorage.getItem('url') + "disp/dispDelete",
            data: JSON.stringify(dispData),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.msg == 'Success') {
                    $('#DeleteDisp').modal('hide')
                    $('#editDisp').modal('hide')
                    getDispatch($("#DispDate").val());
                    alert('Dispatch Deleted Successfull')
                }
            }
        })
    })



});