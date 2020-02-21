function InvPdf() {
    var row = 90, text = 96.5, rowspace = [0, 20, 45, 120, 140, 160], a, doc = new jsPDF();
    doc.setFontType("bold");
    doc.setFontSize(14);
    doc.text('Sunny Trucking Inc.', 15, 20);
    //doc.setFontSize(10);
    doc.text('3249 W Jackson Street #511', 15, 25);
    doc.text('Hayward, CA 94544', 15, 30);
    doc.text('Office: (510) 715-8262', 15, 35);
    doc.text('', 18, 40);
    doc.setFontSize(12);
    var t = 'INVOICE:  ' + $('#invId').text();
    doc.text(t, 150, 20);
    t = 'Date:  ' + $('#InvIdTrue').text();
    doc.text(t, 158, 25);
    t = $('#custName').text();
    doc.text(t, 20, 60);
    t = $('#add1').text();
    doc.text(t, 20, 65);
    t = $('#add2').text();
    doc.text(t, 20, 70);
    t = 'Customer No: ' + $('#custId').text();
    doc.text(t, 150, 60);
    doc.setFontType("regular");
    doc.autoTable({
        startY: 90,
        html: '#invTable',
        didParseCell: function (data) {
            var rows = data.table.body;
            if (data.row.index === rows.length - 1) {
                data.cell.styles.fontStyle = 'bold';
            }
        },
        headStyles: {
            fillColor: [256, 256, 256], textColor: 0, lineColor: [0, 0, 0],
            lineWidth: 0.05
        },
        columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 25 },
            2: { cellWidth: 50 },
            3: { cellWidth: 25 },
            4: { cellWidth: 20 },
            5: { cellWidth: 20 }
        },
        theme: 'grid',
        tableWidth: 'wrap',
        styles: { cellPadding: 0.2, fontSize: 9 }
    });
    let finalY = doc.previousAutoTable.finalY;
    doc.autoTable({
        tableWidth: 50,
        startY: finalY + 10,
        html: '#qtyview',
        headStyles: {
            fillColor: [256, 256, 256], textColor: 0, lineColor: [0, 0, 0],
            lineWidth: 0.05
        },
        columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 25 },
            2: { cellWidth: 75 },
            3: { cellWidth: 25 },
            4: { cellWidth: 20 },
            5: { cellWidth: 20 }
        },
        theme: 'grid',
        tableWidth: 'wrap',
        styles: { cellPadding: 0.2, fontSize: 8 }
    });
    var footor = doc.previousAutoTable.finalY;
    if (finalY > 280) {
        footor = finalY + 280;
    } else {
        footor = 270;
    }
    var ptot = ' Pay Total : ' + $('#pTot').text();
    doc.setFontStyle("bold");
    doc.text(ptot, 200, footor, null, null, 'right');
    doc.setFontStyle("normal");
    var invdec = 'The total amount of this invoice is due in 15 days';
    doc.text(invdec, 55, footor + 15);
    //doc.addPage('a4');
    name = $('#invId').text() + '.pdf';
    doc.autoPrint();
    doc.save(name);
}
