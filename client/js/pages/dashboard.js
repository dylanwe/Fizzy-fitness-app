/**
 * Go to the given template
 *
 * @param {Event} e the click event
 * @param {string} templateId the id of the template you want to go to
 */
const editTemplate = (e, templateId) => {
	e.preventDefault();
	window.location.href = `/dashboard/workout/template/${templateId}`;
};

/**
 * Change the chart information
 * 
 * @param {Event} e the change event
 * @param {*} chart the chart of the exercise
 * @param {*} pinnedStat the information of the pinned stat
 */
const changeChartType = (e, chart, pinnedStat) => {
    const statType = e.target.value;
    let data = [];
    let label = '';

    switch (statType) {
        case 'reps':
            data = pinnedStat.reps;
            label = 'Most reps of workout';
            break;

        case 'pr':
            data = pinnedStat.prs
            label = 'PR of workout';
            break;
    
        default:
            data = pinnedStat.volumes;
            label = 'Exercise volume';
            break;
    }
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].label = label;
    chart.options.scales.y.suggestedMax = Math.max(...data) + Math.max(...data) * 0.2;
    chart.update();
};

// add event to all edit buttons
document.querySelectorAll('[data-edit-template]').forEach((template) => {
	const templateId = template.getAttribute('data-edit-template');
	template.addEventListener('click', (event) =>
		editTemplate(event, templateId)
	);
});

// drawChart and add events to chart
pinnedStats.forEach((pinnedStat) => {
	const container = document.querySelector(`[data-stat="${pinnedStat.id}"]`);
	const canvas = container.querySelector('[data-chart]').getContext('2d');

	// draw chart
	const chart = new Chart(canvas, {
		type: 'line',
		data: {
			labels: pinnedStat.dates,
			datasets: [
				{
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
				},
			],
		},
		options: {
			plugins: {
				legend: {
					display: false,
				},
			},
			scales: {
				y: {
					beginAtZero: true,
					suggestedMax:
						Math.max(...pinnedStat.volumes) +
						Math.max(...pinnedStat.volumes) * 0.2, // put highest value + 20% for padding here
					grid: {
						display: false,
					},
				},
				x: {
					ticks: {
						display: false,
					},
					grid: {
						display: false,
					},
				},
			},
		},
	});

    // add events
    container.querySelector('[data-stat-type]').addEventListener('change', (e) => changeChartType(e, chart, pinnedStat));
});