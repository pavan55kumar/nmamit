// Calendar data
let events = JSON.parse(localStorage.getItem('events')) || [];
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const months = [
	"January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"
];

// DOM Elements
const monthAndYear = document.getElementById("monthAndYear");
const calendarBody = document.getElementById("calendar-body");
const reminderList = document.getElementById("reminderList");
const modal = document.getElementById("eventModal");
const openModal = document.getElementById("openModal");
const closeModal = document.querySelector(".close");

// Event listeners
document.getElementById("previous").addEventListener("click", () => changeMonth(-1));
document.getElementById("next").addEventListener("click", () => changeMonth(1));
document.getElementById("addEvent").addEventListener("click", addEvent);
openModal.addEventListener("click", () => modal.classList.remove("hidden"));
closeModal.addEventListener("click", () => modal.classList.add("hidden"));
window.addEventListener("click", (e) => {
	if (e.target === modal) modal.classList.add("hidden");
});

// Initialize
populateYearDropdown();
populateMonthDropdown();
updateCalendar();
renderEvents();

function changeMonth(offset) {
	currentMonth += offset;
	if (currentMonth < 0) {
		currentMonth = 11;
		currentYear--;
	} else if (currentMonth > 11) {
		currentMonth = 0;
		currentYear++;
	}
	updateCalendar();
}

function populateMonthDropdown() {
	const monthDropdown = document.getElementById("month");
	monthDropdown.innerHTML = months
		.map((month, index) => `<option value="${index}">${month}</option>`)
		.join("");
	monthDropdown.value = currentMonth;
	monthDropdown.addEventListener("change", () => {
		currentMonth = parseInt(monthDropdown.value);
		updateCalendar();
	});
}

function populateYearDropdown() {
	const yearDropdown = document.getElementById("year");
	const startYear = currentYear - 10;
	const endYear = currentYear + 10;
	yearDropdown.innerHTML = Array.from(
		{ length: endYear - startYear + 1 },
		(_, i) => `<option value="${startYear + i}">${startYear + i}</option>`
	).join("");
	yearDropdown.value = currentYear;
	yearDropdown.addEventListener("change", () => {
		currentYear = parseInt(yearDropdown.value);
		updateCalendar();
	});
}

function updateCalendar() {
	monthAndYear.textContent = `${months[currentMonth]} ${currentYear}`;
	renderCalendar(currentMonth, currentYear);
}

function renderCalendar(month, year) {
	calendarBody.innerHTML = "";
	const firstDay = new Date(year, month).getDay();
	const daysInMonth = 32 - new Date(year, month, 32).getDate();

	let date = 1;
	for (let i = 0; i < 6; i++) {
		let row = document.createElement("tr");
		for (let j = 0; j < 7; j++) {
			let cell = document.createElement("td");
			if (i === 0 && j < firstDay) {
				cell.textContent = "";
			} else if (date > daysInMonth) {
				break;
			} else {
				cell.textContent = date;
				date++;
			}
			row.appendChild(cell);
		}
		calendarBody.appendChild(row);
	}
}

function addEvent() {
	const eventDate = document.getElementById("eventDate").value;
	const eventTitle = document.getElementById("eventTitle").value;
	const eventDescription = document.getElementById("eventDescription").value;

	if (eventDate && eventTitle && eventDescription) {
		events.push({ date: eventDate, title: eventTitle, description: eventDescription });
		localStorage.setItem("events", JSON.stringify(events));
		renderEvents();
		modal.classList.add("hidden");
		alert("Event added successfully!");
	} else {
		alert("Please fill in all fields.");
	}
}

function renderEvents() {
	reminderList.innerHTML = events
		.map(
			(event, index) => `
			<li>
				<strong>${event.title}</strong> - ${event.description} (${event.date})
				<button onclick="deleteEvent(${index})">Delete</button>
			</li>`
		)
		.join("");
}

function deleteEvent(index) {
	events.splice(index, 1);
	localStorage.setItem("events", JSON.stringify(events));
	renderEvents();
}

