$('#tempPrint, #print').click(function () {
    if (!$('.errors').hasClass('text-danger')) {

    } else {
        alert('please select date.')
        return
    }
    var doc = new jsPDF();
    doc.setFontType("bold");
    doc.setFontSize(14);
    doc.text('Sunny Trucking Inc.', 15, 20);
    //doc.setFontSize(10);
    doc.text('3249 W Jackson Street #511', 15, 25);
    doc.text('Hayward, CA 94544', 15, 30);
    doc.text('Office: (510) 715-8262', 15, 35);
    doc.text('', 18, 40);
    doc.setFontSize(12);
    var t = 'Statement :  ' + $('#statementId').text()
    doc.text(t, 150, 45);
    t = 'Date :  ' + $('#StatementDate').val()
    doc.text(t, 162, 50);
    t = $('#DriverName').text()
    doc.text(t, 20, 60);
    t = $('#add1').text()
    doc.text(t, 20, 65);
    t = $('#add2').text()
    doc.text(t, 20, 70);
    t = $('#phone').text()
    doc.text(t, 20, 75);
    t = $('#email').text()
    doc.text(t, 20, 80);
    t = 'Driver No: ' + $('#DriverId').text()
    doc.text(t, 150, 60);
    doc.setFontType("regular");
    doc.autoTable({
        startY: 70,
        html: '#stmttble',
        didParseCell: function (data) {
            var rows = data.table.body;
            if (data.row.index === 0) {
                data.cell.styles.fontStyle = 'bold'
                data.cell.styles.fontSize = 10;
            } else if (data.row.index === rows.length - 1) {
                data.cell.styles.fontStyle = 'bold'
                data.cell.styles.fontSize = 10;
            }
        },
        headStyles: {
            fillColor: [256, 256, 256], textColor: 0, lineColor: [0, 0, 0],
            lineWidth: 0.05, halign: 'center',
        },
        columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 20 },
            2: { cellWidth: 40 },
            3: { cellWidth: 15, halign: 'right', valigh: 'middle' },
            4: { cellWidth: 15, halign: 'right' },
            5: { cellWidth: 15, halign: 'right' },
            6: { cellWidth: 15, halign: 'right' },
            7: { cellWidth: 15, halign: 'right' },
            8: { cellWidth: 16, halign: 'right' }
        },
        theme: 'grid',
        tableWidth: 'wrap',
        styles: {
            fontSize: 9,
            cellPadding: 0,
            minCellHeight: 2,
            valign: 'middle',
        }
    });
    let finalY = doc.previousAutoTable.finalY;
    doc.autoTable({
        tableWidth: 50,
        startY: finalY + 20,
        html: '#qtyview',
        theme: 'grid',
        styles: { cellPadding: 0.5, fontSize: 8 }
    });
    finalY = doc.previousAutoTable.finalY;
    /*var footor
    if (finalY > 280) {
        footor = finalY + 280
    } else {
        footor = 270
    }

    //var ptot = ' Pay Total : ' + $('#pTot').text()
    doc.setFontStyle("bold");
    doc.text(ptot, 200, footor, null, null, 'right')
    doc.setFontStyle("normal");
    //var invdec = 'The total amount of this invoice is due in 15 days from' + $('#InvIdTrue').text()
    //doc.text(invdec, 55, footor + 15)
    //doc.addPage('a4'); */
    name = $('#statementId').text() + '.pdf'
    doc.autoPrint()
    doc.save(name)
})


