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

const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: pinnedStat.dates,
        datasets: [{
            label: 'Exercise volume',
            data: pinnedStat.volumes,
            borderColor: [
                'rgba(6, 182, 212)',
                'rgba(103, 232, 249, 1)',
            ],  
            pointBorderColor: 'rgba(6, 182, 212)',
            backgroundColor: 'rgba(255, 255, 255)',
            borderWidth: 2,
            pointRadius: 4,
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
                suggestedMax: Math.max(...pinnedStat.volumes) + (Math.max(...pinnedStat.volumes) * 0.2), // put highest value + 20% for padding here
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