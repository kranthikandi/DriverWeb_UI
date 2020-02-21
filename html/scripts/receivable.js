$(document).ready(function () {

    if (!localStorage.username) {
        window.location.href = 'signin.html';
    }
    var username = localStorage.username.toUpperCase()
    var arByTag = false;
    $('#UserN').empty()
    $('#UserN').append(username.charAt(0))

    var receivableTab = $('#RecTab').DataTable({
        scrollY: '100vh',
        scrollCollapse: true,
        paging: false
    })
    getAllInvoice()
    var AllARDetails, invs = {}, thisInvs = []
    function getAllInvoice() {
        $.ajax({
            url: localStorage.getItem('url') + "cust/getAllAR",
            type: 'get',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                AllARDetails = result
                $('#invTabBody').empty();

                receivableTab.clear().draw()
                $.each(AllARDetails, function (key, val) {
                    var TotalRev = 0, paid = 0, recentCheck
                    $.each(val.invDetails, function (k, v) {
                        TotalRev = TotalRev + val.invDetails[k].invTotal
                    })
                    $.each(val.paymentDetails, function (k, v) {
                        paid = parseInt(paid) + parseInt(val.paymentDetails[k].amt) || 0
                    })
                    if (val.recentCheck) {
                        recentCheck = moment(val.recentCheck).format('MM-DD-YYYY h:m A')
                    } else {
                        recentCheck = '<span class="text-danger">--</span>'
                    }

                    receivableTab.row.add([
                        val.customer_id,
                        val.customer_name,
                        val.totalInv,
                        recentCheck,
                        val.Due,
                        val.TotalRev
                    ]).draw(false);
                })

            }
        })
    }
    var invtab = $('#invs').DataTable()
    var tagTab = $('#tags').DataTable()
    $('#RecTab tbody').on('click', 'tr', function () {
        receivableTab.$('tr.light-blue-500').removeClass('light-blue-500');
        $(this).addClass('light-blue-500');
        var row = receivableTab.row(this).data();
        clear()
        $('#custID').val(row[0])
        $('#custName').val(row[1])
        $('#balance').val(row[4])
        var today = new Date()
        $('#checkDate').datetimepicker({
            timepicker: false,
            format: 'm-d-Y'
        })
        $('#checkDate').val(moment(today).format('MM-DD-YYYY'))
        var cheTab = $('#checks').DataTable()
        cheTab.clear().draw()
        getCustInv(row[0])
        getCustinvedTags(row[0])
        $.each(AllARDetails, function (key, val) {
            if (val.customer_id == row[0]) {
                cheTab.clear().draw()
                $.each(val.paymentDetails, function (k, v) {
                    cheTab.row.add([
                        v.CheckNo,
                        '$ ' + v.amt,
                        moment(v.checkDate).format('MM-DD-YYYY')
                    ]).draw(false);
                })

            }
        })
        $('#checkAmt').removeClass('success')
        $('#SelectSum').removeClass('success')
        $('#checkAmt').removeClass('warning')
        $('#SelectSum').removeClass('warning')
        $('#CheckInfo').modal('show');
    })

    function getCustInv(custid) {
        var invDetails
        var data = {
            custId: custid,
        }
        $.ajax({
            url: localStorage.getItem('url') + "inv/getCustInv",
            type: 'post',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                var invdata = result
                inbox = '<div class="input-group m-b"><span class="input-group-addon"><input type="checkbox" class="setPaid has-value"></span> <input type="text" class="comments form-control" placeholder=""> </div>'
                invtab.clear().draw()
                $.each(invdata, function (key, val) {
                    var invtotal
                    if (val.status == 'P-Paid') {
                        invtab.row.add([
                            val.invId,
                            '<span class = "invtot">$ ' + val.balance + '</span>',
                            moment(val.InvDate).format('MM-DD-YYYY'),
                            '<input id="paidInAmt" type="number" class="paidInAmt form-control " placeholder=""></input>',
                            inbox
                        ]).draw(false);
                    } else if (val.status == 'Created') {
                        invtab.row.add([
                            val.invId,
                            '<span class = "invtot">$ ' + val.Total + '</span>',
                            moment(val.InvDate).format('MM-DD-YYYY'),
                            '<input id="paidInAmt" type="number" class="paidInAmt form-control " placeholder=""></input>',
                            inbox
                        ]).draw(false);
                    }
                })
            }
        })
    }
    function getCustinvedTags(custid) {
        var invDetails
        var data = {
            custId: custid,
        }
        $.ajax({
            url: localStorage.getItem('url') + "ftb/getCustTagsInved",
            type: 'post',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                var invdata = result
                inbox = '<div class="input-group m-b"><span class="input-group-addon"><input type="checkbox" class="setPaid has-value"></span> <input type="text" class="comments form-control" placeholder=""> </div>'
                tagTab.clear().draw()
                $.each(invdata, function (key, val) {
                    var bal
                    if (val.balance > 0) {
                        bal = '<span class = "invtot">$ ' + val.balance + '</span>'
                    } else {
                        bal = '<span class = "invtot">$ ' + val.bTotal + '</span>'
                    }
                    tagTab.row.add([
                        val.Fright_Bill,
                        bal,
                        moment(val.date).format('MM-DD-YYYY'),
                        '<input id="paidInAmt" type="number" class="paidInAmt form-control " placeholder=""></input>',
                        inbox
                    ]).draw(false);
                })
            }
        })
    }

    var selectedSum = []
    $('#SelectSum').append(selectedSum)
    // $('#invs tbody').on('click', 'tr', function () {
    //     if ($(this).hasClass('light-blue-500')) {
    //         $(this).removeClass('light-blue-500');
    //     } else {
    //         $(this).addClass('light-blue-500');
    //     }
    // })

    $('#checkAmt').on('change', function () {
        if ($('#SelectSum').val() == $('#checkAmt').val() && $('#checkAmt').val() > 0 && $('#SelectSum').val() > 0) {
            $('#checkAmt').addClass('success')
            $('#checkAmt').removeClass('warning')
            $('#SelectSum').addClass('success')
            $('#SelectSum').removeClass('warning')
            $('#ARUpdate').prop('disabled', false)
        } else {
            $('#checkAmt').addClass('warning')
            $('#checkAmt').removeClass('success')
            $('#SelectSum').addClass('warning')
            $('#SelectSum').removeClass('success')
            $('#ARUpdate').prop('disabled', true)
        }
    })
    // $('#invs tbody').on('click', 'tr', function () {
    //     if ($(this).hasClass('light-blue-500')) {
    //         $(this).removeClass('light-blue-500')
    //     } else {
    //         $(this).addClass('light-blue-500')
    //     }
    // })

    $('#invs tbody').on('change', '.paidInAmt', function () {
        var tr = $(this).closest("tr");
        var rowindex = tr.index();

        var thisAmt = parseInt($(this).val())
        if (!thisAmt) {
            $(this).removeClass('light-blue-500');
            thisAmt = 0
        } else {
            $(this).addClass('light-blue-500');
        }
        selectedSum[rowindex] = parseInt(thisAmt)
        var thistot = 0
        for (var i = 0; i < selectedSum.length; i++) {
            if (selectedSum[i]) {
                thistot = thistot + selectedSum[i]
            } else {
                thistot = 0
            }
        }
        //selectedSum.push(thisAmt)
        //thistot = thistot + thisAmt
        $('#SelectSum').empty()
        $('#SelectSum').val(thistot)
        if (thistot == $('#checkAmt').val() && thistot > 0) {
            $('#checkAmt').addClass('success')
            $('#checkAmt').removeClass('warning')
            $('#SelectSum').addClass('success')
            $('#SelectSum').removeClass('warning')
            $('#ARUpdate').prop('disabled', false)
        } else {
            $('#checkAmt').addClass('warning')
            $('#checkAmt').removeClass('success')
            $('#SelectSum').addClass('warning')
            $('#SelectSum').removeClass('success')
            $('#ARUpdate').prop('disabled', true)
        }
    })

    $('#tags tbody').on('change', '.paidInAmt', function () {
        var tr = $(this).closest("tr");
        var rowindex = tr.index();

        var thisAmt = parseFloat($(this).val())
        if (!thisAmt) {
            $(this).removeClass('light-blue-500');
            thisAmt = 0
        } else {
            $(this).addClass('light-blue-500');
        }
        selectedSum[rowindex] = parseFloat(thisAmt)
        var thistot = 0
        for (var i = 0; i < selectedSum.length; i++) {
            if (selectedSum[i]) {
                thistot = thistot + selectedSum[i]
                arByTag = true
            } else {
                thistot = 0
            }
        }
        //selectedSum.push(thisAmt)
        //thistot = thistot + thisAmt
        $('#SelectSum').empty()
        $('#SelectSum').val(thistot)
        if (thistot == $('#checkAmt').val() && thistot > 0) {
            $('#checkAmt').addClass('success')
            $('#checkAmt').removeClass('warning')
            $('#SelectSum').addClass('success')
            $('#SelectSum').removeClass('warning')
            $('#ARUpdate').prop('disabled', false)
        } else {
            $('#checkAmt').addClass('warning')
            $('#checkAmt').removeClass('success')
            $('#SelectSum').addClass('warning')
            $('#SelectSum').removeClass('success')
            $('#ARUpdate').prop('disabled', true)
        }
    })

    function clear() {
        $('.clear').val('')
        $('.clear').empty()
    }



    $('#ARUpdate').click(function () {
        console.log(selectedSum)
        var g
        if (arByTag) {
            g = getTableValues('tags')
            if (g.length == 0) {
                return
            }
            updateArTags(g)
            return
        } else {
            g = getTableValues('invs')
        }
        console.log(g)
        if (g.length == 0) {
            return
        }
        if ($('#Check').val() != '' && $('#checkAmt').val() != '' && $('#checkDate').val() != '') {
            var today = new Date(), amt = parseFloat($('#checkAmt').val())
            var data = {
                customer_id: $('#custID').val(),
                paymentDetails: {
                    CheckNo: $('#Check').val(),
                    amt: amt.toFixed(2),
                    checkDate: moment($('#checkDate').val()).format('MM/DD/YYYY')
                },
                invDetails: g,
                recentCheck: today,
                updatedBy: localStorage.username,
                updatedDate: today,
                amt: amt.toFixed(2)
            }
            $.ajax({
                url: localStorage.getItem('url') + "cust/updateARInv",
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
                        alert('Poseted the Check successfully')
                        $('#CheckInfo').modal('hide');
                        getAllInvoice()
                    } else {
                        selectedSum = []
                        console.log(result);
                        alert('Poseted the Check successfully')
                        $('#CheckInfo').modal('hide');
                        getAllInvoice()
                    }
                }
            })
        } else {
            alert('Please enter Check number and Amount')
        }
    })

    function getTableValues(v) {
        var b = $('#' + v),
            c = $(b).find("thead"),
            d = $(b).find("tbody"),
            e = $(b).find("tbody>tr").length,
            f = [],
            g = [],
            invtot = 0,
            paidIn = 0, comment, checked = false

        f.push(v)
        f.push('Total')
        f.push('Date')
        f.push('Paid')
        f.push('Comment')
        $.each($(d).find("tr"), function (a, b) {
            for (var c = {}, d = 0; d < f.length; d++) {
                if ($(this).find(".paidInAmt").val() != '') {
                    if (f[d] == 'Paid') {
                        paidIn = parseInt($(this).find(".paidInAmt").val())
                        c[f[d]] = paidIn
                    } else if (f[d] == 'Total') {
                        invtot = $(this).find("td").eq(d).text();
                        invtot = invtot.slice(2)
                        c[f[d]] = parseInt(invtot)
                    } else if (f[d] == 'Comment') {
                        comment = $(this).find(".comments").val()
                        c[f[d]] = comment
                        checked = $(this).find(".setPaid")[0].checked
                    } else {
                        c[f[d]] = $(this).find("td").eq(d).text();
                    }
                }
            }
            if (c['Paid'] != c['Total'] && c['Comment'] !== '' && checked) {
                c['adj'] = true
                g.push(c)
            } else if (c['Paid'] != c['Total'] && c['Comment'] == '' && checked) {
                alert('Please coment the reason to override the balance')
            } else if (c['Paid'] != c['Total'] && c['Comment'] != '' && !checked) {
                alert('Please select the checkbox to override the balance of this invoice')
            } else if (c['Paid'] == c['Total']) {
                g.push(c)
            } else if (c['Paid'] != c['Total']) {
                c['ppaid'] = true
                c['diff'] = parseInt(c['Total']) - parseInt(c['Paid'])
                $(this).addClass('red-300');
                alert('the highlighted invoice will be updated as partial-paid invoice')
                g.push(c)
            } else if (c['Invoice']) {
                g.push(c)
            }
        })
        return g
    }

    function updateArTags(g) {
        if ($('#Check').val() != '' && $('#checkAmt').val() != '' && $('#checkDate').val() != '') {
            var today = new Date(), amt = parseFloat($('#checkAmt').val())
            var data = {
                customer_id: $('#custID').val(),
                paymentDetails: {
                    CheckNo: $('#Check').val(),
                    amt: amt.toFixed(2),
                    checkDate: moment($('#checkDate').val()).format('MM/DD/YYYY')
                },
                tagDetails: g,
                recentCheck: today,
                updatedBy: localStorage.username,
                updatedDate: today,
                amt: amt.toFixed(2),
            }
            $.ajax({
                url: localStorage.getItem('url') + "cust/updateARTags",
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
                        alert('Poseted the Check successfully')
                        $('#CheckInfo').modal('hide');
                        getAllInvoice()
                    } else {
                        selectedSum = []
                        console.log(result);
                        alert('Poseted the Check successfully')
                        $('#CheckInfo').modal('hide');
                        getAllInvoice()
                    }
                    return
                }
            })
        } else {
            alert('Please enter Check number and Amount')
            return
        }
    }

})