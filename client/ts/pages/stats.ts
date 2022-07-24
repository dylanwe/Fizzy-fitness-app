/**
 * Change the chart information
 *
 * @param e the change event
 * @param chart the chart of the exercise
 * @param stat the information of the stat
 */
 const changeChartType = (e: Event, chart: any, stat: Stat) => {
	const statType = (<HTMLInputElement> e.target).value;
	let data: number[] = [];
	let label = '';

	switch (statType) {
		case 'reps':
			data = stat.reps;
			label = 'Most reps of workout';
			break;

		case 'pr':
			data = stat.prs;
			label = 'PR of workout';
			break;

		default:
			data = stat.volumes;
			label = 'Exercise volume';
			break;
	}
	chart.data.datasets[0].data = data;
	chart.data.datasets[0].label = label;
	chart.options.scales.y.suggestedMax =
		Math.max(...data) + Math.max(...data) * 0.2;
	chart.update();
};

/**
 * Change if exercise should be pinned to the dashboard
 * 
 * @param container the element in which the all exercise data is
 * @param stat the statistics for this pin
 */
const changePin = async (container: HTMLElement, stat: Stat) => {
	// send request than change classes;
	const pin = container.querySelector('[data-pin]')!;
	let isPinned = pin.getAttribute('data-pin') === 'pinned';

	const resp = await fetch(`/dashboard/stats/${stat.id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ isPinned }),
	});

	if (resp.status === 200) {
		isPinned = !isPinned;
		const pinClasses = {
			pinned: [
				'bg-cyan-300',
				'text-cyan-900',
				'border-cyan-300',
				'hover:border-cyan-500',
			],
			notPinned: [
				'bg-slate-50',
				'text-slate-900',
				'border-slate-100',
				'hover:border-slate-300',
			],
		};

		if (isPinned) {
			pin.setAttribute('data-pin', 'pinned');
			pin.classList.add(...pinClasses.pinned);
			pin.classList.remove(...pinClasses.notPinned);
		} else {
			// remove element if not on stats page
			if (window.location.href.includes('stats')) {
				pin.setAttribute('data-pin', '');
				pin.classList.remove(...pinClasses.pinned);
				pin.classList.add(...pinClasses.notPinned);
			} else {
				container.remove();
			}
		}
	}
};

// drawChart and add events to chart
//@ts-ignore because stats are loaded in from the page script
stats.forEach((stat: Stat) => {
	const container = <HTMLElement> document.querySelector(`[data-stat="${stat.id}"]`)!;
	const canvas = (<HTMLCanvasElement> container.querySelector('[data-chart]'))!.getContext('2d');

	// draw chart
    //@ts-ignore because it comes from a cdn
	const chart = new Chart(canvas, {
		type: 'line',
		data: {
			labels: stat.dates,
			datasets: [
				{
					label: 'Exercise volume',
					data: stat.volumes,
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
						Math.max(...stat.volumes) +
						Math.max(...stat.volumes) * 0.2, // put highest value + 20% for padding here
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
	container
		.querySelector('[data-stat-type]')!
        .addEventListener('change', (e) => changeChartType(e, chart, stat));
	container
        .querySelector('[data-pin]')!
        .addEventListener('click', () => changePin(container, stat));
});
