$(document).ready(function () {

    if (!localStorage.username) {
        window.location.href = 'signin.html';
    }
    var username = localStorage.username
    var DispProgress = false
    $('#UserN').empty()
    $('#UserN').append(username.charAt(0))
    var level = '0', cid, totalJobs, jobId, thisJobDetails, dispatchArray = [], MaxId = 1000,
        EDDrivers = [], SDDrivers = [], DBDrivers = [], TenWDrivers = [], flatbed = [], d = new Date(),
        //console.log(localStorage.username);
        today = moment(d).format('MM-DD-YYYY'), allCusts,
        custtab = $("#driver_table").DataTable({
            scrollY: '100vh',
            scrollCollapse: true,
            paging: false
        });
    getAllCust()
    function getAllCust() {
        $.ajax({
            url: localStorage.getItem('url') + "cust/customers",
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.length <= 0) {
                    MaxId = 1000
                    return
                }
                allCusts = result
                $("#d_tbody").empty();
                custtab.clear().draw()
                $.each(result, function (key, val) {
                    MaxId = parseInt(val.customer_id) + 1
                    var stat = ''
                    if (val.status == 'Active') {
                        stat = '<span class=" md-flat  w-xs text-success">' + val.status + '</span>'
                    } else if (val.status == 'Inactive') {
                        stat = '<span class=" md-flat  w-xs text-danger">' + val.status + '</span>'
                    }
                    custtab.row.add([
                        '<a class="thisCust" style="text-decoration-line: underline" id=' + val.customer_id + '>' + val.customer_id + '</a>',
                        val.customer_name,
                        val.customer_location,
                        stat,
                        '<a class="editCust md-flat  w-xs text-primary" id=' + val.customer_id + '><i class="fa fa-edit"></i> Edit</a>'
                    ]).draw(false);
                })
            }
        }).fail(function () {
            alert("error");
        })
    }

    $('#driver_table tbody').on('click', 'tr', function (e) {
        var row = custtab.row(this).data(), id, cName, clocation, CPhone, cmail, status
        $.each(allCusts, function (key, val) {
            if (val.customer_name == row[1]) {
                id = val.customer_id
                cName = val.customer_name
                clocation = val.customer_location
                CPhone = val.phone
                cmail = val.email
                status = val.status
            }
        })

        if ($(e.target).is(".thisCust")) {
            cid = id
            custID(id, cName);
        } else if ($(e.target).is(".editCust")) {
            editCustID(id, cName, clocation, CPhone, cmail, status);
        }
    })


    $('.cStat').click(function () {
        $('#cStat').empty()
        $('#cStat').append($(this).attr('id'))
    })
    function getThisDisp() {
        var data = {
            jobid: $('#job-id').text(),
            dispDte: $('#cDispDate').val()
        }
        $.ajax({
            url: localStorage.getItem('url') + "disp/jobDateDisp",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                var CDispatchTable = $('#CDispatchTable').DataTable()
                CDispatchTable.clear().draw();
                $.each(result, function (key, val) {
                    var dri = val.Driver || '',
                        tru = val.Truck_id || '',
                        fri = val.Fright_bill || '',
                        notes = val.notes || '',
                        id = val._id
                    id = id.substr(id.length - 4)
                    CDispatchTable.row.add([
                        id,
                        val.Time,
                        val.Truck_Type,
                        val.Rate,
                        dri,
                        tru,
                        fri,
                        val.status,
                        notes
                    ]).draw(false);
                })
            }
        })

    }

    $('#NewCust').click(function () {
        $("#customerId").val('')
        $('#m-a-a').modal('show')
    })

    $(".NoSpecialChar").change(function () {
        var str = $(this).val()
        if (/^[a-zA-Z0-9- ]*$/.test(str) == false) {
            alert('Your search string contains illegal characters.');
            $(".NoSpecialChar").val('')
            $(".NoSpecialChar").empty()
        }
    })

    $("#saveCustomer").click(function () {
        var custName = $("#customerName").val()
        var customer = {
            customer_id: $("#customerId").val(),
            customer_name: custName.toUpperCase(),
            customer_location: $("#clocation").val(),
            cust_phone: $('#cPhone').val(),
            cust_email: $('#cEmail').val(),
            status: "Active"
        }
        $.ajax({
            url: localStorage.getItem('url') + "cust/customer",
            data: JSON.stringify(customer),
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
                    var newAr = newArCust(customer);
                    getAllCust()
                } else {
                    alert('Something went wrong. Please try again!!');
                    console.log(result.msg);
                }
            }
        });
    });
    $("#updateCustomer").click(function () {
        var customer = {
            customer_id: $("#eCustomerId").val(),
            customer_name: $("#eCustomerName").val(),
            customer_location: $("#eClocation").val(),
            cust_phone: $('#eCPhone').val(),
            cust_email: $('#eCEmail').val(),
            status: $('#cStat').text()
        }
        $.ajax({
            url: localStorage.getItem('url') + "cust/updateCust",
            data: JSON.stringify(customer),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.msg == "success") {
                    console.log('Customer upadted successfully');
                    location.reload();
                } else {
                    alert('Something went wrong. Please try again!!');
                    console.log(result.msg);
                }
            }
        });
    });
    function newArCust(data) {
        var d = new Date()
        var data2 = {
            totalInv: 0,
            recentCheck: '',
            invDetails: [],
            updatedBy: localStorage.username,
            updatedDate: d,
            paymentDetails: [],
            totalRev: 0,
            Due: 0
        }
        var customer = Object.assign(data, data2);
        $.ajax({
            url: localStorage.getItem('url') + "cust/newAR",
            data: JSON.stringify(customer),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result == 'success') {
                    location.reload();
                } else {
                    return 'failed'
                }
            }
        })
    }

    $('#cancelJob').click(function () {
        level1_0()
    })

    $("#customerCrumb, .customerCrumb").click(function () {
        // $("#customerBox").show();
        // $("#job_table").empty();
        // var headcrumb = '<li class="breadcrumb-item"><a id="customerCrumb" class="customerCrumb" >All Customers</a></li>';
        // $("#headercrumb").empty();
        // $("#headercrumb").append(headcrumb);
    });

    $(".smallButton").click(function () {
        level1_0();
    });
    function editCustID(custId, cName, clocation, CPhone, cmail, status) {
        //alert("in custId==="+custId);
        $("#eCustomerId").val(custId);
        $('#m-a-b').modal('show');
        // $("#eCustomerName").val(custId);
        $("#eCustomerName").val(cName);
        $("#eCEmail").val(cmail);
        $("#eCPhone").val(CPhone);
        $("#eClocation").val(clocation);
        $('#cStat').empty()
        $('#cStat').append(status)
    }

    function custID(custId, cName) {
        $("#customerBox").hide();
        $("#jobBox").show();
        $("#Jobs").hide();
        var cName = cName.toString().toUpperCase();
        $("#customerCrumb").empty();
        $("#customerCrumb").append(cName);
        var headcrumb = '<li class="breadcrumb-item"><a id="customerCrumb" class="customerCrumb" >' + cName + '</a></li>';
        var jobcrumb = '<li class="breadcrumb-item"><a href="#" id="jobCrumb">All Jobs</a></li>';
        $("#headercrumb").append(jobcrumb);
        $("#customer_id").val(custId);
        $("#customer_name").val(cName);
        jobId = custId + "-" + 1;
        $("#job_id").val(jobId);
        $("#dispatchData").hide();
        $("#configData").show();


        var customerId = {
            customer_id: custId
        }
        $.ajax({
            url: localStorage.getItem('url') + "job/custjobs",
            data: JSON.stringify(customerId),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.length == 0) {
                    $(".noJobs").show();

                } else {

                    // calculating job id
                    totalJobs = result.length;
                    var totalJob = totalJobs + 1;
                    jobId = cid + "-" + totalJob;
                    $("#job_id").val(jobId);
                    $("#customer_id").val(custId);
                    $("#customer_name").val(cName);
                    // $("#job_tbody").empty(); 
                    var tableName = cName.replace(/ /gi, "_") + '_table';
                    tableName = tableName.replace(/[^\w\s]/gi, '') + '_table';

                    var jobtable = '<table id="' + tableName + '" class="table table-striped b-t"></table>';
                    $("#jobTableDiv").empty();
                    $("#jobTableDiv").append(jobtable);
                    //jobTable.destroy();
                    var appendhash = '#' + tableName;
                    var jobTable = $(appendhash).DataTable({
                        "columns": [
                            { title: "Job Id" },
                            { title: "Job Name" },
                            { title: "Job Location" },
                            { title: "Start Date" },
                            { title: "Status" }
                        ],
                        scrollY: '100vh',
                        scrollCollapse: true,
                        paging: false
                    });
                    $.each(result, function (key, val) {
                        var jId, jLocation, jName, sdate, dstatus;
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
                        var avail = '<span class=" md-flat  w-xs text-success">Active</span>'
                        var inactive = '<span class=" md-flat  w-xs text-danger">In-Active</span>'
                        var statusbtn;
                        if (dstatus == 'running') {
                            statusbtn = avail
                        } else if (dstatus == 'closed') {
                            statusbtn = inactive
                        }
                        var row = "<tr><td id='clickJob' class = 'JobDetails_" + jId + "'>" + jId + "</td><td>" + jName + "</td><td>" + jLocation + "</td><td>" + sdate + "</td><td>" + statusbtn + "</td></tr>";
                        jobTable.row.add($(row)[0]).draw();
                        //$("#job_tbody").append(row);
                        //rowidbol=true;
                        //$("#job_table").DataTable();
                        $(".JobDetails_" + jId + "").click(function () {
                            $('#updateJob').show()
                            $('#saveJob').hide()
                            jobDetails(jId);
                        });
                    });
                }
            }

        });
    }

    function jobDetails(jId) {

        var Jobid = {
            job_id: jId
        }

        $("#dispatchData").show();
        $("#configData").hide();
        dispatchInfo(jId);
        $.ajax({
            url: localStorage.getItem('url') + "job/jobdetails",
            data: JSON.stringify(Jobid),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                getThisInvoices(Jobid)
                thisJobDetails = result
                //console.log(result);
                $("#jobBox").hide();
                $("#Jobs").show();
                clearjobform();
                $('#_id-jobid').append(result[0]._id)
                $("#customer_id").val(result[0].customer_id);
                $("#cust-id").append(result[0].customer_id)
                $("#customer_name").val(result[0].customer_name.toString().toUpperCase());
                $("#cust-name").append(result[0].customer_name.toString().toUpperCase())
                $("#job_id").val(result[0].job_id);
                $("#job-id").append(result[0].job_id);
                $("#job_name").val(result[0].job_name.toString().toUpperCase());
                $("#job-name").append(result[0].job_name.toString().toUpperCase());
                $("#startDate").val(result[0].start_date);
                $("#job_location").val(result[0].job_location);
                $("#job-loc").append(result[0].job_location);
                $("#loca").val(result[0].job_location);
                $("#typebutton").append(result[0].job_type);
                $("#job-type").append(result[0].job_type);
                $("#DBweek").val(result[0].weekday.doublebottom);
                $("#DBSat").val(result[0].Sat.doublebottom);
                $("#DBSun").val(result[0].Sun.doublebottom);
                $("#DBton").val(result[0].ton.doublebottom);
                $("#DBload").val(result[0].load.doublebottom);
                $("#SBweek").val(result[0].weekday.semibuttom);
                $("#SBSat").val(result[0].Sat.semibuttom);
                $("#SBSun").val(result[0].Sun.semibuttom);
                $("#SBton").val(result[0].ton.semibuttom);
                $("#SBload").val(result[0].load.semibuttom);
                $("#EDweek").val(result[0].weekday.enddump);
                $("#EDSat").val(result[0].Sat.enddump);
                $("#EDSun").val(result[0].Sun.enddump);
                $("#EDton").val(result[0].ton.enddump);
                $("#EDload").val(result[0].load.enddump);
                $("#SDweek").val(result[0].weekday.superdump);
                $("#SDSat").val(result[0].Sat.superdump);
                $("#SDSun").val(result[0].Sun.superdump);
                $("#SDton").val(result[0].ton.superdump);
                $("#SDload").val(result[0].load.superdump);
                $("#SDpHour").val(result[0].PayRateHr.superdump);
                $("#SDpton").val(result[0].PayRateTon.superdump);
                $("#SDpload").val(result[0].PayRateLoad.superdump);
                $("#TWweek").val(result[0].weekday.tenwheeler);
                $("#TWSat").val(result[0].Sat.tenwheeler);
                $("#TWSun").val(result[0].Sun.tenwheeler);
                $("#TWton").val(result[0].ton.tenwheeler);
                $("#TWload").val(result[0].load.tenwheeler);
                $("#Fweek").val(result[0].weekday.flatbed);
                $("#FSat").val(result[0].Sat.flatbed);
                $("#FSun").val(result[0].Sun.flatbed);
                $("#Fton").val(result[0].ton.flatbed);
                $("#Fload").val(result[0].load.flatbed);
                $("#DBpHour").val(result[0].PayRateHr.doublebottom);
                $("#SBpHour").val(result[0].PayRateHr.semibuttom);
                $("#EDpHour").val(result[0].PayRateHr.enddump);
                $("#TWpHour").val(result[0].PayRateHr.tenwheeler);
                $("#FpHour").val(result[0].PayRateHr.flatbed);
                $("#DBpTon").val(result[0].PayRateTon.doublebottom);
                $("#SBpton").val(result[0].PayRateTon.semibuttom);
                $("#EDpton").val(result[0].PayRateTon.enddump);
                $("#TWpton").val(result[0].PayRateTon.tenwheeler);
                $("#Fpton").val(result[0].PayRateTon.flatbed);
                $("#DBpload").val(result[0].PayRateLoad.doublebottom);
                $("#SBpload").val(result[0].PayRateLoad.semibuttom);
                $("#EDpload").val(result[0].PayRateLoad.enddump);
                $("#TWpload").val(result[0].PayRateLoad.tenwheeler);
                $("#Fpload").val(result[0].PayRateLoad.flatbed);
                $("#HSweek").val(result[0].weekday.highside);
                $("#HSSat").val(result[0].Sat.highside);
                $("#HSSun").val(result[0].Sun.highside);
                $("#HSton").val(result[0].ton.highside);
                $("#HSload").val(result[0].load.highside);
                $("#HSpHour").val(result[0].PayRateHr.highside);
                $("#HSpton").val(result[0].PayRateTon.highside);
                $("#HSpload").val(result[0].PayRateLoad.highside);
                $("#Tweek").val(result[0].weekday.transfer);
                $("#TSat").val(result[0].Sat.transfer);
                $("#TSun").val(result[0].Sun.transfer);
                $("#Tton").val(result[0].ton.transfer);
                $("#Tload").val(result[0].load.transfer);
                $("#TpHour").val(result[0].PayRateHr.transfer);
                $("#Tpton").val(result[0].PayRateTon.transfer);
                $("#Tpload").val(result[0].PayRateLoad.transfer);
            }
        });

    }
    var jobInvDataTable = $('#jobsInvoices').DataTable()

    function getThisInvoices(jobId) {
        var data = jobId
        $.ajax({
            url: localStorage.getItem('url') + "inv/jobInvoices",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                jobInvDataTable.clear().draw();
                $.each(result, function (key, val) {
                    var id = ''
                    if (val.status == 'Archived') {
                        id = '<span class = "text-warning">' + val.invId + '</span>'
                    } else {
                        id = val.invId
                    }
                    if (val.status == 'Archived') {
                        id = '<span class = "btn danger">' + val.status + '</span>'
                    } else if (val.status == 'Paid') {
                        id = '<span class = "btn  success">' + val.status + '</span>'
                    } else if (val.status == 'P-Paid') {
                        id = '<span class = "btn warning">' + val.status + '</span>'
                    } else if (val.status == 'Created') {
                        id = '<span class = "btn info">' + val.status + '</span>'
                    } else if (val.status == 'Preview') {
                        id = '<span class = "btn primary">' + val.status + '</span>'
                    } else {
                        id = '<span class = "btn lime-400">' + val.status + '</span>'
                    }
                    jobInvDataTable.row.add([
                        val.invId || '<span id="previewId" data-id="' + val._id + '" > --</span> ',
                        moment(val.InvDate).format('MM-DD-YYYY'),
                        val.customer_name,
                        '$ ' + val.Total,
                        val.totalTag,
                        id
                    ]).draw(false);
                })
            }
        })
    }

    function getRate() {
        //thisJobDetails
        var type = $('#ttype').text(),
            thisDate = moment($('#cDispDate').val(), 'MM-DD-YYYY'),
            day = thisDate.isoWeekday(), rate
        console.log(type);

        if (thisJobDetails[0].job_type == 'hourly') {
            $.each(thisJobDetails[0].PayRateHr, function (key, val) {
                if (key.charAt(0).toLowerCase() == type.charAt(0).toLowerCase()) {
                    $('#Custprate').val(val);
                }
            })
            if (day == 6) {
                $.each(thisJobDetails[0].Sat, function (key, val) {
                    if (key.charAt(0).toLowerCase() == type.charAt(0).toLowerCase()) {
                        $('#bRate').val(val);
                    }
                })
            } else if (day == 7) {
                $.each(thisJobDetails[0].Sun, function (key, val) {
                    if (key.charAt(0).toLowerCase() == type.charAt(0).toLowerCase()) {
                        $('#bRate').val(val);
                    }
                })
            } else {
                $.each(thisJobDetails[0].weekday, function (key, val) {
                    if (key.charAt(0).toLowerCase() == type.charAt(0).toLowerCase()) {
                        $('#bRate').val(val);
                    }
                })
            }
        } else if (thisJobDetails[0].job_type == 'ton') {
            $.each(thisJobDetails[0].PayRateTon, function (key, val) {
                if (key.charAt(0).toLowerCase() == type.charAt(0).toLowerCase()) {
                    $('#Custprate').val(val);
                }
            })
            $.each(thisJobDetails[0].ton, function (key, val) {
                if (key.charAt(0).toLowerCase() == type.charAt(0).toLowerCase()) {
                    $('#bRate').val(val);
                }
            })
        } else if (thisJobDetails[0].job_type == 'load') {
            $.each(thisJobDetails[0].PayRateLoad, function (key, val) {
                if (key.charAt(0).toLowerCase() == type.charAt(0).toLowerCase()) {
                    $('#Custprate').val(val);
                }
            })
            $.each(thisJobDetails[0].load, function (key, val) {
                if (key.charAt(0).toLowerCase() == type.charAt(0).toLowerCase()) {
                    $('#bRate').val(val);
                }
            })
        }
    }
    var invDetails
    $('#jobsInvoices tbody').on('click', 'tr', function () {

        var row = jobInvDataTable.row(this).data();
        if (!row || row[0].includes('warning')) {
            jobInvDataTable.$('tr.red-600').removeClass('red-600');
            $(this).addClass('red-600');
            return false
        }
        jobInvDataTable.$('tr.light-blue-500').removeClass('light-blue-500');
        $(this).addClass('light-blue-500');

        $('#QTYTotal').empty();
        $('.invForm').empty();
        $('.invForm').append('');
        $('#InvoiceModal').modal('show')
        var data = {
            invId: row[0]
        }
        $.ajax({
            url: localStorage.getItem('url') + "inv/invid",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                invDetails = result
                $.each(result, function (key, val) {
                    if (row[0] == val.invId) {
                        $('#invId').append(val.invId)
                        $('#invDate').append(moment(val.InvDate).format('MM-DD-YYYY'))
                        job_location = val.job_location.split(',')
                        $('#custName').append(val.customer_name)
                        $('#add1').append(job_location[0])
                        $('#add2').append(job_location[1])
                        $('#phone').append(val.phone)
                        $('#email').append(val.email)
                        for (var i = 0; i < val.totalTag; i++) {
                            var tr = '<tr><td>' + moment(val.details[i].date).format('MM-DD-YYYY') + '</td>' +
                                '<td>' + val.details[i].ftb + '</td>' +
                                '<td>' + val.details[i].qty + '</td>' +
                                '<td> $ ' + val.details[i].total + '</td></tr>'
                            $('#QTYTotal').append(tr)
                        }
                        var tr = '<tr><td></td><td></td><td><strong>Total</strong></td><td> <strong> $ ' + val.Total + '</strong></td></tr>'
                        $('#QTYTotal').append(tr)
                    }
                })
            }
        })
    })

    $('#archiveInv').click(function () {
        var data = {
            invId: $('#invId').text(),
            updatedBy: localStorage.username,
            updatedDate: new Date()
        }
        $.ajax({
            url: localStorage.getItem('url') + "inv/invArch",
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
                    level1_0()
                    alert('Invoice Deleted successfully! ')
                    $('#InvoiceModal').modal('hide')
                } else {
                    console.log(result);
                }
            }
        })

    })

    function clearjobform() {

        $(".job-form").val('');
        $(".job-form").empty();
        $("#reqDispatch").empty();
        $("#typebutton").empty();
        $("#job-id").empty();
        $("#job-name").empty();
        $("#job-loc").empty();
        $("#cust-id").empty();
        $("#cust-name").empty();
        $("#job-type").empty();
        $('#_id-jobid').empty();
    }

    function level1_0() {
        //show all customers
        $("#customerBox").show();
        $("#jobBox").hide();
        var headcrumb = '<li class="breadcrumb-item"><a id="customerCrumb" class="customerCrumb" >All Customers</a></li>';
        $("#headercrumb").empty();
        $("#headercrumb").append(headcrumb);
        $("#jobTableDiv").empty();
        $("#Jobs").hide();
        $(".noJobs").hide();
    }
    function level1_1() {
        //new customer page
    }
    function level1_2() {
        //old customer page
    }
    function level2_0() {
        //all jobs of the customer
    }
    function level2_1() {
        //new job 
    }
    function level2_2() {
        //job details of the customer
    }

    $("#edit").click(function () {
        $(".newJob").prop('disabled', false);
    });

    $("#update").click(function () {
        $(".newJob").prop('disabled', true);
    });

    // Job Functionality 
    $("#newJob").click(function () {
        $("#customerBox").hide();
        $("#jobBox").hide();
        $("#Jobs").show();
        clearjobform();
        $("#job_id").empty();
        $("#job_name").empty();
        $("#job_location").empty();
        $("#startDate").datetimepicker({
            timepicker: false,
            format: 'm-d-Y',
            minDate: 0
        });
        $('#updateJob').hide()
        $('#saveJob').show()
    });

    var jobtype;
    $(".jobtype").click(function () {
        jobtype = $(this).attr('value');
        $("#typebutton").empty();
        $("#typebutton").append(jobtype);
    });

    $(".ttype").click(function () {
        var ttype = $(this).attr('value');
        $("#ttype").empty();
        $("#ttype").append(ttype);
        getRate()
    });



    $(".deleteRow").click(function () {
        $("table tbody").find('input[name="record"]').each(function () {
            if ($(this).is(":checked")) {
                $(this).parents("tr").remove();
            }
        });
    });

    $("#saveJob").click(function () {
        if ($("#job_name").val() == '' || jobtype == undefined) {
            alert('Please enter all the mandatory fields')
            return
        }
        var job = {
            customer_id: cid,
            customer_name: $("#customerCrumb").text(),
            job_id: $("#job_id").val(),
            job_name: $("#job_name").val(),
            start_date: $("#startDate").val(),
            job_location: $("#job_location").val(),
            job_type: jobtype,
            PayRateHr: {
                doublebottom: $("#DBpHour").val(),
                semibuttom: $("#SBpHour").val(),
                enddump: $("#EDpHour").val(),
                tenwheeler: $("#TWpHour").val(),
                flatbed: $("#FpHour").val(),
                superdump: $("#SDpHour").val(),
                highside: $("#HSpHour").val(),
                transfer: $("#TpHour").val(),
            },
            PayRateTon: {
                doublebottom: $("#DBpTon").val(),
                semibuttom: $("#SBpton").val(),
                enddump: $("#EDpton").val(),
                tenwheeler: $("#TWpton").val(),
                flatbed: $("#Fpton").val(),
                superdump: $("#sDpton").val(),
                highside: $("#HSpton").val(),
                transfer: $("#Tpton").val(),
            },
            PayRateLoad: {
                doublebottom: $("#DBpload").val(),
                semibuttom: $("#SBpload").val(),
                enddump: $("#EDpload").val(),
                tenwheeler: $("#TWpload").val(),
                flatbed: $("#Fpload").val(),
                superdump: $("#SDpload").val(),
                highside: $("#HSpload").val(),
                transfer: $("#TpHour").val(),
            },
            weekday: {
                doublebottom: $("#DBweek").val(),
                semibuttom: $("#SBweek").val(),
                enddump: $("#EDweek").val(),
                tenwheeler: $("#TWweek").val(),
                flatbed: $("#Fweek").val(),
                superdump: $("#SDweek").val(),
                highside: $("#HSweek").val(),
                transfer: $("#Tweek").val(),
            },
            sat: {
                doublebottom: $("#DBSat").val(),
                semibuttom: $("#SBSat").val(),
                enddump: $("#EDSat").val(),
                tenwheeler: $("#TWSat").val(),
                flatbed: $("#FSat").val(),
                superdump: $("#SDSat").val(),
                highside: $("#HSSat").val(),
                transfer: $("#TSat").val(),
            },
            sun: {
                doublebottom: $("#DBSun").val(),
                semibuttom: $("#SBSun").val(),
                enddump: $("#EDSun").val(),
                tenwheeler: $("#TWSun").val(),
                flatbed: $("#FSun").val(),
                superdump: $("#SDSun").val(),
                highside: $("#HSSun").val(),
                transfer: $("#TSun").val(),
            },
            ton: {
                doublebottom: $("#DBton").val(),
                semibuttom: $("#SBton").val(),
                enddump: $("#EDton").val(),
                tenwheeler: $("#TWton").val(),
                flatbed: $("#Fton").val(),
                superdump: $("#SDton").val(),
                highside: $("#HSton").val(),
                transfer: $("#Tton").val(),
            },
            load: {
                doublebottom: $("#DBload").val(),
                semibuttom: $("#SBload").val(),
                enddump: $("#EDload").val(),
                tenwheeler: $("#TWload").val(),
                flatbed: $("#Fload").val(),
                superdump: $("#SDload").val(),
                highside: $("#HSload").val(),
                transfer: $("#Tload").val(),
            },
            notes: $("#notes").val(),
            status: "running"
        }
        $.ajax({
            url: localStorage.getItem('url') + "job/newjob",
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
                    $("#success-msg").append("New Job created.")
                    alert("job created");
                    level1_0();
                    $("#job-success").alert()
                } else {
                    alert(result.msg);
                    console.log(result.msg);
                }
            }
        });
    });

    $('#updateJob').click(function () {
        var jobtype = $('#typebutton').text()
        if ($("#job_name").val() == '') {
            alert('Please enter Job Name')
            return
        } else if (jobtype == '' || jobtype == undefined) {
            alert('Please select Job Jype')
            return
        } else if ($('#job_id').val() == '') {
            alert('Please enter Job ID')
            return
        }

        var job = {
            customer_id: cid,
            customer_name: $("#customerCrumb").text(),
            _id: $('#_id-jobid').text(),
            job_id: $("#job_id").val(),
            job_name: $("#job_name").val(),
            start_date: $("#startDate").val(),
            job_location: $("#job_location").val(),
            job_type: jobtype,
            PayRateHr: {
                doublebottom: $("#DBpHour").val(),
                semibuttom: $("#SBpHour").val(),
                enddump: $("#EDpHour").val(),
                tenwheeler: $("#TWpHour").val(),
                flatbed: $("#FpHour").val(),
                superdump: $("#SDpHour").val(),
                highside: $("#HSpHour").val(),
                transfer: $("#TpHour").val(),
            },
            PayRateTon: {
                doublebottom: $("#DBpTon").val(),
                semibuttom: $("#SBpton").val(),
                enddump: $("#EDpton").val(),
                tenwheeler: $("#TWpton").val(),
                flatbed: $("#Fpton").val(),
                superdump: $("#sDpton").val(),
                highside: $("#HSpton").val(),
                transfer: $("#Tpton").val(),
            },
            PayRateLoad: {
                doublebottom: $("#DBpload").val(),
                semibuttom: $("#SBpload").val(),
                enddump: $("#EDpload").val(),
                tenwheeler: $("#TWpload").val(),
                flatbed: $("#Fpload").val(),
                superdump: $("#SDpload").val(),
                highside: $("#HSpload").val(),
                transfer: $("#TpHour").val(),
            },
            weekday: {
                doublebottom: $("#DBweek").val(),
                semibuttom: $("#SBweek").val(),
                enddump: $("#EDweek").val(),
                tenwheeler: $("#TWweek").val(),
                flatbed: $("#Fweek").val(),
                superdump: $("#SDweek").val(),
                highside: $("#HSweek").val(),
                transfer: $("#Tweek").val(),
            },
            sat: {
                doublebottom: $("#DBSat").val(),
                semibuttom: $("#SBSat").val(),
                enddump: $("#EDSat").val(),
                tenwheeler: $("#TWSat").val(),
                flatbed: $("#FSat").val(),
                superdump: $("#SDSat").val(),
                highside: $("#HSSat").val(),
                transfer: $("#TSat").val(),
            },
            sun: {
                doublebottom: $("#DBSun").val(),
                semibuttom: $("#SBSun").val(),
                enddump: $("#EDSun").val(),
                tenwheeler: $("#TWSun").val(),
                flatbed: $("#FSun").val(),
                superdump: $("#SDSun").val(),
                highside: $("#HSSun").val(),
                transfer: $("#TSun").val(),
            },
            ton: {
                doublebottom: $("#DBton").val(),
                semibuttom: $("#SBton").val(),
                enddump: $("#EDton").val(),
                tenwheeler: $("#TWton").val(),
                flatbed: $("#Fton").val(),
                superdump: $("#SDton").val(),
                highside: $("#HSton").val(),
                transfer: $("#Tton").val(),
            },
            load: {
                doublebottom: $("#DBload").val(),
                semibuttom: $("#SBload").val(),
                enddump: $("#EDload").val(),
                tenwheeler: $("#TWload").val(),
                flatbed: $("#Fload").val(),
                superdump: $("#SDload").val(),
                highside: $("#HSload").val(),
                transfer: $("#Tload").val(),
            },
            notes: $("#notes").val(),
            status: "running"
        }
        $.ajax({
            url: localStorage.getItem('url') + "job/UpdateJob",
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
                    alert("Updated Job Successfully");
                    level1_0();
                } else {
                    alert('Unable to update the Job please try again');
                    console.log(result.msg);
                }
            }
        });
    });
    function newArCust(data) {
        var d = new Date()
        var data2 = {
            totalInv: 0,
            recentCheck: '',
            invDetails: [],
            updatedBy: localStorage.username,
            updatedDate: d,
            paymentDetails: [],
            totalRev: 0,
            Due: 0
        }
        var customer = Object.assign(data, data2);
        $.ajax({
            url: localStorage.getItem('url') + "cust/newAR",
            data: JSON.stringify(customer),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result == 'success') {
                    return 'success'
                } else {
                    return 'failed'
                }
            }
        })
    }

    $('#cancelJob').click(function () {
        level1_0()
    })

    $("#customerCrumb, .customerCrumb").click(function () {
        // $("#customerBox").show();
        // $("#job_table").empty();
        // var headcrumb = '<li class="breadcrumb-item"><a id="customerCrumb" class="customerCrumb" >All Customers</a></li>';
        // $("#headercrumb").empty();
        // $("#headercrumb").append(headcrumb);
    });

    $("#config").click(function () {
        $("#configData").show();
        $("#dispatchData").hide();
        $("#jobsData").hide();
    });
    $("#dispatch").click(function () {
        $("#configData").hide();
        $("#dispatchData").show();
        $("#jobsData").hide();
    });
    $("#jobs").click(function () {
        $("#configData").hide();
        $("#dispatchData").hide();
        $("#jobsData").show();
    });

    $("#time").datetimepicker({
        datepicker: false,
        format: 'H:i'
    });



    $("#cDispDate").datetimepicker({
        timepicker: false,
        format: 'm-d-Y'
    })
    var tomorrow = moment(new Date()).add(1, 'days').format('MM-DD-YYYY');
    $("#cDispDate").val(tomorrow, 'MM-DD-YYYY');

    $("#cDispDate").change(function () {
        dateValidator()
        $('#ttype').empty()
        $('#ttype').append('Truck Type')
        $('#rate').empty()
    });
    dateValidator()

    function dateValidator() {
        var jid = $('#job-id').text()
        dispatchInfo(jid);
        var val = $("#cDispDate").val();
        var duration = moment(today).diff(moment(val), 'days');
        /* if (duration <= 0) {
            $(".addDisp").prop('disabled', false);
        } else {
            $(".addDisp").prop('disabled', true);
        } */
    }


    $("#cpre5").click(function () {
        var d = moment($("#cDispDate").val(), 'MM-DD-YYYY');
        var dp = d.add('days', -5);
        dp = moment(dp).format('MM-DD-YYYY');
        $("#cDispDate").val(dp);
        dateValidator();
        dispatchInfo($("#job-id").text())
    })
    $("#cyest").click(function () {
        var d = moment($("#cDispDate").val(), 'MM-DD-YYYY');
        var dp = d.add('days', -1);
        dp = moment(dp).format('MM-DD-YYYY');
        $("#cDispDate").val(dp);
        dateValidator();
        dispatchInfo($("#job-id").text())
    })
    $("#ctomm").click(function () {
        var d = moment($("#cDispDate").val(), 'MM-DD-YYYY');
        var dp = d.add('days', 1);
        dp = moment(dp).format('MM-DD-YYYY');
        $("#cDispDate").val(dp);
        dateValidator();
        dispatchInfo($("#job-id").text())
    })
    $("#cnex5").click(function () {
        var d = moment($("#cDispDate").val(), 'MM-DD-YYYY');
        var dp = d.add('days', 5);
        dp = moment(dp).format('MM-DD-YYYY');
        $("#cDispDate").val(dp);
        dateValidator();
        dispatchInfo($("#job-id").text())
    })


    /* $("#addToDispatch").click(function () {
        var dispatch = makeJsonFromDispatchTable('CDispatchTable');
        var strDisp = JSON.stringify(dispatch);
        console.log(strDisp);
        //var assigDriver = dispatch[0].value;
        //console.log(assigDriver);
        var drivers = [];
        $.each(dispatch, function (key, val) {
            $.each(val, function (k, val) {
                if (k == "Driver") {
                    drivers.push(val);
                }
            })
        })
        var i = $("#cust-id").text(),
            j = $("#cust-name").text(),
            k = $("#job-id").text(),
            l = $("#job-name").text();
        var li = '<li class="list-group-item dark-white box-shadow-z0 b">' + i + '/ ' + j + ' / ' + k + ' / ' + l + '</li>';
        $("#dispJobs").append(li);
        var count = $("#dispCount").text() || 0
        count = parseInt(count) + dispatch.length;
        $("#dispCount").empty();
        $("#dispCount").append(count);
 
        // insert into db with wait status
        $.ajax({
            url: localStorage.getItem('url') + "disp/newManydispatch",
            data: strDisp,
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (result) {
                console.log(result);
                if (result.msg == "success") {
                    for (var i = 0; i < drivers.length; i++) {
                        AssignDrivers(drivers[i]);
                    }
 
                    alert("Dispatch Scheduled");
                    //level1_0();
                } else {
                    alert(result.msg);
                    console.log(result.msg);
                }
            }
        });
    }); */

    function AssignDrivers(drivers) {

        var dri = {
            driver: drivers,
            status: 'Assigned',
            date: moment($('#cDispDate').val())
        }
        console.log(dri);
        $.ajax({
            url: localStorage.getItem('url') + "dri/dristatupdate",
            data: JSON.stringify(dri),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                console.log(result);
            }
        })
    }

    function dispatchInfo(jId) {
        var jobid = {
            job_id: jId,
            dispDate: moment($('#cDispDate').val()).format('MM-D-YYYY')
        }
        $.ajax({
            url: localStorage.getItem('url') + "disp/dispatchW",
            data: JSON.stringify(jobid),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.length > 0) {
                    /* $('#updateDispatch').show()
                    $('#addToDispatch').hide() */
                    //console.log(result);
                    var increment = 0;
                    var DispatchW = $("#CDispatchTable").DataTable()
                    DispatchW.clear().draw();
                    $.each(result, function (key, val) {
                        //increment = parseInt(increment) + 1;
                        var time, truckType, rate, driver = '', truck = '', status, notes = '',
                            fid = val._id
                        fid = fid.substring(0)
                        var id = fid.substring(22)
                        id = parseInt(id, 16)
                        /* $.each(val, function (k, val) {
                            if (k == '_id') {
                                _id = val
                                id = val.substr(val.length - 4)
                                id = parseInt(id, 16)
                            } else if (k == "Time") {
                                time = val;
                            } else if (k == "Truck_Type") {
                                truckType = val;
                            } else if (k == "Rate") {
                                rate = val;
                            } else if (k == "Driver") {
                                if (val == "") {
                                    driver = "";
                                } else {
                                    driver = val;
                                }
                            } else if (k == "Truck_id") {
                                if (val == "") {
                                    truck = "";
                                } else {
                                    truck = val;
                                }
                            } else if (k == 'status') {
                                if (val == 'New') {
                                    status = '<td id = "status_' + increment + '"class = "btn btn-fw white">New</td>'
                                } else if (val == 'Assigned') {
                                    status = '<td id = "status_' + increment + '" class = "btn btn-fw primary">Assigned</td>'
                                } else if (val == 'Accepted') {
                                    status = '<td id = "status_' + increment + '" class = "btn btn-fw success">Assigned</td>'
                                } else if (val == 'Canceled') {
                                    status = '<td id = "status_' + increment + '" class = "btn btn-fw danger">Assigned</td>'
                                }
                            } else if (k == 'notes') {
                                notes = val;
                            }

                        }); */
                        if (val.status == 'New') {
                            status = '<span id = "status_' + key + '"class = "white">New</span>'
                        } else if (val.status == 'Assigned') {
                            status = '<span id = "status_' + key + '" class = "text-primary">Assigned</span>'
                        } else if (val.status == 'Accepted') {
                            status = '<span id = "status_' + key + '" class = "text-success">Assigned</span>'
                        } else if (val.status == 'Canceled') {
                            status = '<span id = "status_' + key + '" class = "text-danger">Assigned</span>'
                        }
                        DispatchW.row.add([
                            id,
                            val.Time,
                            val.Truck_Type,
                            val.Rate,
                            val.Driver || "<button id= 'assigDriver_" + key + "' class='assigDriver adddri md-btn md-fab m-b-sm white' data-fullid='" + fid + "' data-truck-type= '" + truckType + "'><i class='fa fa-plus'></i></button>",
                            val.Truck_id || "<span id= 'assigtruck_" + key + "'></span>",
                            val.Fright_bill || ' ',
                            status || '',
                            val.notes || ''
                        ]).draw(false);
                        /*  var row = "<tr><td>" + id + "</td><td>" + time + "</td><td>" + truckType + "</td><td>" + rate + "</td>" +
                             "<td id= 'assigDriver_" + increment + "' class='assigDriver btn btn-fw btn-primary' data-fullid='" + _id + "' data-truck-type= '" + truckType + "'>" + driver + "<i class='fa fa-plus'></i></td>" +
                             "<td id= 'assigtruck_" + increment + "'>" + truck + "</td><td></td>" + status + "<td>" + notes + "</td></tr>";
                         $("#Dispatchw").append(row); */
                    });
                } else {
                    /* $('#updateDispatch').hide()
                    $('#addToDispatch').show() */
                    $("#Dispatchw").empty();
                }
            }
        });
    }

    /* $('#updateDispatch').click(function () {
        var dispatch = makeJsonFromDispatchTable('CDispatchTable');
        var strDisp = JSON.stringify(dispatch);
        console.log(strDisp)
        $.ajax({
            url: localStorage.getItem('url') + "disp/UpdateManyDispatch",
            data: strDisp,
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (result) {
                if (result.ok == 1) {
                    alert('Dispatch updated')
                    //level1_0()
                } else {
                    alert('Some of the records not updated')
                }
            }
        })
    }) */

    /* $(".add-row").click(function () {
        var ttype = $("#ttype").text();
        var time = $("#time").val()
        var rate = $("#Custprate").val();
        var qty = $("#qty").val() || 1
        var repeat = $('#Reap').val() || 0
        var status = 'New';
        var notes = '';
        var date = moment($('#cDispDate').val()).format('MM/DD/YYYY')
        if (ttype == 'Truck Type' || time == '' || rate == '') {
            alert('please select all the options')
            return false
        }
        var trow = '';
        var rowCount = $('#CDispatchTable tr').length;
        var t = moment(date + " " + time)
        t = moment(t).format('MM/DD/YYYY hh:mm')
        if (!rowCount) {
            $("#Dispatchw").empty()
        }
        for (var i = 1; i <= qty; i++) {
            trow = trow + "<tr><td>" + moment(t).format('hh:mm') + "</td><td id='ttype_'" + i + ">" + ttype + "</td><td>" + rate +
                '</td><td id = "assigDriver_' + rowCount + '"class = "assigDriver" data-truck-type= "' + ttype + '" ></td><td id = "assigtruck_' + rowCount + '"></td><td id="frightBill"></td><td id = "status_' + rowCount + '" class = "btn btn-fw white">' + status + '</td><td>' + notes + '</td></tr>';
            t = moment(t).add('minutes', repeat)
            rowCount++;
        }
        $("#Dispatchw").append(trow);
    }); */

    $(".add-row").click(function () {
        var ttype = $("#ttype").text(),
            time = $("#time").val(),
            rate = $("#Custprate").val(),
            date = moment($('#cDispDate').val()).format('MM/DD/YYYY')
        if (ttype == 'Truck Type' || time == '' || rate == '') {
            alert('please select all the options')
            return false
        }
        DispProgress = true
        var qty = $("#qty").val() || 1,
            repeat = $('#Reap').val() || 0,
            dispTime = [],
            t = moment(date + " " + time)
        t = moment(t).format('MM/DD/YYYY hh:mm')
        var jid = $("#job-id").text()
        for (var i = 1; i <= qty; i++) {
            dispTime.push(moment(t).format('hh:mm'))
            t = moment(t).add('minutes', repeat)
        }
        var newDispatch = {
            custId: $("#cust-id").text(),
            custName: $("#cust-name").text(),
            jobId: $("#job-id").text(),
            jobName: $("#job-name").text(),
            jobLoc: $("#job-loc").text(),
            jobType: $("#job-type").text(),
            status: 'New',
            DispDate: $("#cDispDate").val(),
            locA: $("#loca").val(),
            locB: $("#locb").val(),
            billRate: $('#bRate').val(),
            dispMaterial: $('#material').val(),
            Time: dispTime,
            Rate: $('#Custprate').val(),
            Truck_Type: $('#ttype').text()
        }
        console.log(newDispatch)
        $.ajax({
            url: localStorage.getItem('url') + "disp/newCustdispatch",
            data: JSON.stringify(newDispatch),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                console.log(result);
                if (result.msg == "success") {

                } else {
                    alert('one of the dispatch is not created.')
                    console.log(result.msg);
                }
                dispatchInfo(jid)
            }
        });

    })


    getEDDrivers()
    getSDDrivers()
    getDBDrivers()
    getTenWrivers()
    getFlatBed()
    $('#cancel').click(function () {
        level1_0()
    })
    function getEDDrivers() {
        $.ajax({
            url: localStorage.getItem('url') + "dri/EDDrivers",
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                EDDrivers = result;
            }
        })
    }
    function getSDDrivers() {
        $.ajax({
            url: localStorage.getItem('url') + "dri/SDDrivers",
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                SDDrivers = result;
            }
        })
    }
    function getDBDrivers() {
        $.ajax({
            url: localStorage.getItem('url') + "dri/DBDrivers",
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                DBDrivers = result;
            }
        })
    }
    function getTenWrivers() {
        $.ajax({
            url: localStorage.getItem('url') + "dri/TenWDrivers",
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                TenWDrivers = result;
            }
        })
    }
    function getFlatBed() {
        $.ajax({
            url: localStorage.getItem('url') + "dri/Flatbed",
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                flatbed = result;
            }
        })
    }


    $('#Dispatchw').on('click', '.assigDriver', function () {
        var ttype = $(this).data("truck-type"),
            fullId = $(this).data("fullid"),
            val = $(this).text()
        if (val != '') {
            return
        }
        getAllDrivers(ttype, fullId, val)
        /* var ttype = $(this).data("truck-type"),
            fullId = $(this).data("fullid"),
            val = $(this).text()
        if (val != '') {
            return
        }
        var drivers;
        if (ttype == 'End-Dump') {
            getEDDrivers()
            drivers = EDDrivers;
        } else if (ttype == "Super-Dump") {
            getSDDrivers()
            drivers = SDDrivers;
        } else if (ttype == 'Double-Bottom') {
            getDBDrivers()
            drivers = DBDrivers;
        } else if (ttype == '10-wheeler') {
            getTenWrivers()
            drivers = TenWDrivers;
        } else if (ttype == 'Flatbed') {
            getFlatBed()
            drivers = flatbed;
        } */
        //availDrivers(drivers, fullId);

    });

    // functionality to see only available drivers 
    /* function availDrivers(drivers, fullId) {
        $("#EDDrivers").empty();
        $.each(drivers, function (key, val) {
            var driver, truckid;
            driver = val.TName;
            truckid = val.truckID;
     
            var row = "<tr><td class='seleDriver_" + truckid + "' data-row-num='" + key + "' data-index='" + fullId + "'>" + driver + "</td><td>" + truckid + "</td></tr>";
     
            $("#EDDrivers").append(row);
     
            $(".seleDriver_" + truckid).click(function () {
                updateDisp(fullId, driver, truckid)
                var index = $(".seleDriver_" + truckid + "").data("index");
                var rownum = index.split("_");
                $("#" + index).empty();
                $("#" + index).append(driver);
                $("assigDriver_" + index).empty();
                $("#assigtruck_" + rownum[1]).empty();
                $("#assigtruck_" + rownum[1]).append(truckid);
                $('#status_' + rownum[1]).empty();
                $('#status_' + rownum[1]).removeClass('white');
                $('#status_' + rownum[1]).addClass('success')
                $('#status_' + rownum[1]).append('Accepted');
                $(".seleDriver_" + truckid).addClass('red')
                $('#EDDriver').modal('hide');
            });
     
        });
        $('#Drivers').DataTable()
     
        $('#EDDriver').modal('show');
        //$('#editDisp').modal("show"); 
    } */

    function getAllDrivers(ttype, fullId, val) {

        $.ajax({
            url: localStorage.getItem('url') + "dri/Alldrivers",
            type: 'get',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                $("#EDDrivers").empty();
                for (var i = 0; i < result.res.length; i++) {
                    var driver, truckid;
                    driver = result.res[i].ICdriver_name;
                    truckid = result.res[i].ICdriver_id;
                    NoOfTrucks = result.res[i].NoOfTrucks
                    var row = "<tr><td class='thisDriver seleDriver_" + truckid + "' data-driver='" + driver + "'data-truId='" + truckid + "' data-row-num='" + i + "' data-ids='" + fullId + "'>" + driver + "</td>" +
                        "<td class='thisDriver seleDriver_" + truckid + "' data-driver='" + driver + "'data-truId='" + truckid + "' data-row-num='" + i + "' data-ids='" + fullId + "'>" + truckid + "</td>" +
                        "<td class='thisDriver seleDriver_" + truckid + "' data-driver='" + driver + "'data-truId='" + truckid + "' data-row-num='" + i + "' data-ids='" + fullId + "'>" + NoOfTrucks + "</td></tr>"
                    $("#EDDrivers").append(row);

                }
            }
        })
        $('#EDDriver').modal('show');
    }

    /* $(".seleDriver_" + truckid).click(function () {
        var index = $(".seleDriver_" + truckid + "").data("index");
        var rownum = index.split("_");
        $("#" + index).empty();
        $("#" + index).append(driver);
        $("assigDriver_" + index).empty();
        $("#assigtruck_" + rownum[1]).empty();
        $("#assigtruck_" + rownum[1]).append(truckid);
        $('#status_' + rownum[1]).empty();
        $('#status_' + rownum[1]).removeClass('white');
        $('#status_' + rownum[1]).addClass('success')
        $('#status_' + rownum[1]).append('Accepted');
        $(".seleDriver_" + truckid).addClass('red')
        $('#EDDriver').modal('hide');
        updateDisp(fullId, driver, truckid)
    }); */

    $('#EDDrivers').on('click', '.thisDriver', function () {
        var truid = $(this).data("truid"),
            driver = $(this).data("driver"),
            fullId = $(this).data("ids")
        updateDisp(fullId, driver, truid)
        $('#EDDriver').modal('hide');
    })


    function updateDisp(fullId, driver, truckid) {
        var dispData = {
            id: fullId,
            driver: driver,
            truck_id: truckid,
        }
        var jid = $("#job-id").text()
        $.ajax({
            url: localStorage.getItem('url') + "disp/cdispUpdate",
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
                    updateDriverStat(driver, truckid, 'Accepted', fullId)
                    dispatchInfo(jid)
                }
            }
        })
    }
    function updateDriverStat(Dname, truckID, status, fullId) {
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
                    getEDDrivers()
                    getSDDrivers()
                    getDBDrivers()
                    getTenWrivers()
                    getFlatBed()
                }
            }
        })
    }

});