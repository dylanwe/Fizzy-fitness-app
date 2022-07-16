/**
 * Go to the given template
 * 
 * @param {Event} e the click event
 * @param {string} templateId the id of the template you want to go to
 */
const editTemplate = (e, templateId) => {
    e.preventDefault();
    window.location.href = `/dashboard/workout/template/${templateId}`;
}

// add event to all edit buttons
document.querySelectorAll('[data-edit-template]').forEach((template) => {
    const templateId = template.getAttribute('data-edit-template');
    template.addEventListener('click', (event) => editTemplate(event, templateId));
})

// Create all charts
const ctx = document.getElementById('myChart').getContext('2d');
// create gradient for charts
var gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(103, 232, 249, 1)');   
gradient.addColorStop(0.4, 'rgba(103, 232, 249, 0)');

const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: data[0].labels,
        datasets: [{
            label: data[0].exercise,
            data: data[0].data,
            borderColor: [
                'rgba(6, 182, 212)',
                'rgba(103, 232, 249, 1)',
            ],  
            pointBorderColor: 'rgba(6, 182, 212)',
            backgroundColor: 'rgba(255, 255, 255)',
            borderWidth: 2,
            pointRadius: 4,
            tension: 0,
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 100 + (100 * 0.2), // put highest value + 20% for padding here
                ticks: {
                    display: false,
                },
                grid: {
                    display: false,
                }
            },
            x: {
                ticks: {
                    display: false,
                },
                grid: {
                    display: false,
                }
            }
        }
    }
});