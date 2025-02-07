const { jsPDF } = window.jspdf;

// Initialize first service
addService();

function addService() {
    const servicesList = document.getElementById('servicesList');
    const div = document.createElement('div');
    div.className = 'service-item';
    div.innerHTML = `
        <input type="text" placeholder="Service description">
        <input type="number" value="1" min="1" class="qty">
        <input type="number" placeholder="Price" class="price">
        <span class="item-total">0.00</span>
    `;
    servicesList.appendChild(div);
    
    // Add calculation listeners
    div.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', calculateTotals);
    });
}

function calculateTotals() {
    let grandTotal = 0;
    
    document.querySelectorAll('.service-item').forEach(item => {
        const qty = parseFloat(item.querySelector('.qty').value) || 0;
        const price = parseFloat(item.querySelector('.price').value) || 0;
        const total = qty * price;
        item.querySelector('.item-total').textContent = total.toFixed(2);
        grandTotal += total;
    });

    document.getElementById('grandTotal').textContent = 
        `${document.getElementById('currency').value} ${grandTotal.toFixed(2)}`;
}

function generatePDF() {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(18);
    doc.text("Young Web Solutions", 10, 20);
    doc.setFontSize(12);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 160, 20);
    
    // Add client info
    doc.text(`Client: ${document.getElementById('clientName').value}`, 10, 40);
    doc.text(`Email: ${document.getElementById('clientEmail').value}`, 10, 50);
    
    // Add services
    let yPos = 70;
    doc.setFontSize(12);
    doc.text("Description", 10, yPos);
    doc.text("Qty", 100, yPos);
    doc.text("Price", 130, yPos);
    doc.text("Total", 160, yPos);
    yPos += 10;

    document.querySelectorAll('.service-item').forEach(item => {
        const desc = item.querySelector('input[type="text"]').value;
        const qty = item.querySelector('.qty').value;
        const price = item.querySelector('.price').value;
        const total = item.querySelector('.item-total').textContent;
        
        doc.text(desc, 10, yPos);
        doc.text(qty, 100, yPos);
        doc.text(price, 130, yPos);
        doc.text(total, 160, yPos);
        yPos += 10;
    });

    // Add total
    doc.setFontSize(14);
    doc.text(`Grand Total: ${document.getElementById('grandTotal').textContent}`, 130, yPos + 20);

    doc.save('invoice.pdf');
}
