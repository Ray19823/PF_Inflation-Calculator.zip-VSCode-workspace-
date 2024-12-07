// DOM Elements
const form = document.getElementById('inflation-form');
const resultsDiv = document.getElementById('results');
const chartCanvas = document.getElementById('inflation-chart');
const savedResultsTable = document.querySelector('#saved-results tbody');

// Initialize Chart.js
let inflationChart = new Chart(chartCanvas, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Inflation Trends',
            data: [],
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            tension: 0.4,
            fill: true,
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: true },
        },
        scales: {
            x: { title: { display: true, text: 'Year' } },
            y: { title: { display: true, text: 'Inflation Rate (%)' } }
        }
    }
});

// Event: Form Submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    const startYear = parseInt(document.getElementById('start-year').value);
    const endYear = parseInt(document.getElementById('end-year').value);

    if (startYear >= endYear) {
        resultsDiv.innerHTML = `<p style="color:red;">Start year must be less than end year.</p>`;
        return;
    }

    const adjustedAmount = calculateInflation(amount, startYear, endYear);
    displayResult(amount, startYear, endYear, adjustedAmount);
    updateChartData(startYear, endYear); // Fetch dynamic data and update chart
});

// Function: Calculate Inflation
function calculateInflation(amount, startYear, endYear) {
    const rate = 0.03; // Assume 3% annual inflation
    const years = endYear - startYear;
    return parseFloat((amount * Math.pow(1 + rate, years)).toFixed(2));
}

// Function: Display Results
function displayResult(amount, startYear, endYear, adjustedAmount) {
    const resultHTML = `
        <div class="result-card">
            <h3>Result</h3>
            <p>${amount} in ${startYear} is equivalent to <strong>${adjustedAmount}</strong> in ${endYear}.</p>
            <button class="save-btn" data-amount="${amount}" data-start-year="${startYear}" data-end-year="${endYear}" data-adjusted-amount="${adjustedAmount}">Save Result</button>
        </div>
    `;
    resultsDiv.innerHTML = resultHTML;
}

resultsDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('save-btn')) {
        const button = e.target;
        const amount = button.getAttribute('data-amount');
        const startYear = button.getAttribute('data-start-year');
        const endYear = button.getAttribute('data-end-year');
        const adjustedAmount = button.getAttribute('data-adjusted-amount');

        saveResult(amount, startYear, endYear, adjustedAmount);
    }
});

// Function: Save Results
function saveResult(amount, startYear, endYear, adjustedAmount) {
    const rowHTML = `
        <tr>
            <td>${amount}</td>
            <td>${startYear}</td>
            <td>${endYear}</td>
            <td>${adjustedAmount}</td>
            <td><button class="delete-btn">Delete</button></td>
        </tr>
    `;
    savedResultsTable.insertAdjacentHTML('beforeend', rowHTML);
}

savedResultsTable.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        deleteRow(e.target);
    }
});

// Function: Delete a Row
function deleteRow(button) {
    button.closest('tr').remove();
}

// Function: Update Chart Data
function updateChartData(startYear, endYear) {
    const labels = [];
    const data = [];
    for (let year = startYear; year <= endYear; year++) {
        labels.push(year);
        data.push((Math.random() * 5).toFixed(2));
    }
    inflationChart.data.labels = labels;
    inflationChart.data.datasets[0].data = data;
    inflationChart.update();
}

// Accordion Toggle
document.querySelector('.accordion').addEventListener('click', function () {
    this.classList.toggle('active');
    const content = this.nextElementSibling;
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
});
