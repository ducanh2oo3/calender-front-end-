// datepicker.js

function DatePicker(id, callback) {
    this.id = id;
    this.callback = callback;
    this.currentDate = new Date();
}

DatePicker.prototype.render = function() {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDate = new Date(this.currentDate);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const container = document.createElement('div');
    container.classList.add('datepicker-container');

    const tbl = document.createElement('table');
    tbl.classList.add('datepicker-table');
    container.appendChild(tbl);

    // Create header row with navigation controls, month, and year display
    const trHeader = tbl.insertRow();
    const tdMonthYear = trHeader.insertCell();
    tdMonthYear.colSpan = 7;
    tdMonthYear.classList.add('datepicker-month-year');
    tdMonthYear.textContent = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);

    const trNav = tbl.insertRow();
    const tdPrev = trNav.insertCell();
    tdPrev.textContent = '<';
    tdPrev.addEventListener('click', () => this.previousMonth());

    const tdNext = trNav.insertCell();
    tdNext.textContent = '>';
    tdNext.addEventListener('click', () => this.nextMonth());

    // Create header row with week day abbreviations
    const trWeekDays = tbl.insertRow();
    weekDays.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        trWeekDays.appendChild(th);
    });

    // Calculate the maximum number of rows needed (7 days * 6 weeks)
    const maxRows = 6;

    for (let i = 0; i < maxRows; i++) {
        const tr = tbl.insertRow();
        for (let j = 0; j < 7; j++) {
            const td = tr.insertCell();
            const dayOfMonth = (i * 7) + j - firstDayOfMonth + 1;
            var date, info;
            if (dayOfMonth > 0 && dayOfMonth <= daysInMonth) {
                td.textContent = dayOfMonth;
                td.dataset.date = dayOfMonth;
                td.dataset.month = currentMonth + 1;
                td.dataset.year = currentYear;
                td.classList.add('current-month-day');

                // Get the information for this date
                date = new Date(currentYear, currentMonth, dayOfMonth);
                info = getDayInfo(date);
            } else {
                // Logic for previous and next month's days
                const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
                if (dayOfMonth <= 0) {
                    td.textContent = prevMonthDays + dayOfMonth;
                    td.dataset.date = prevMonthDays + dayOfMonth;
                    td.dataset.month = currentMonth === 0 ? 12 : currentMonth;
                    td.dataset.year = currentMonth === 0 ? currentYear - 1 : currentYear;
                    date = new Date(td.dataset.year, td.dataset.month - 1, td.dataset.date);
                } else {
                    td.textContent = dayOfMonth - daysInMonth;
                    td.dataset.date = dayOfMonth - daysInMonth;
                    td.dataset.month = currentMonth === 11 ? 1 : currentMonth + 2;
                    td.dataset.year = currentMonth === 11 ? currentYear + 1 : currentYear;
                    date = new Date(td.dataset.year, td.dataset.month - 1, td.dataset.date);
                }
                info = getDayInfo(date);
                td.classList.add('other-month-day');
            }

            td.setAttribute('data-info', info);

            td.addEventListener('click', (event) => {
                const selectedDay = event.target;
                const selectedDays = document.querySelectorAll('.selected-day');
                selectedDays.forEach(day => day.classList.remove('selected-day'));
                selectedDay.classList.add('selected-day');
                if (typeof this.callback === 'function') {
                    this.callback(this.id, {
                        day: parseInt(selectedDay.dataset.date),
                        month: parseInt(selectedDay.dataset.month),
                        year: parseInt(selectedDay.dataset.year)
                    });
                }

                // If the selected day is in the next month, update currentMonth and currentYear and re-render
                if (selectedDay.classList.contains('other-month-day') && parseInt(selectedDay.dataset.date) < 15) {
                    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                    this.render();
                }

                // If the selected day is in the previous month, update currentMonth and currentYear and re-render
                if (selectedDay.classList.contains('other-month-day') && parseInt(selectedDay.dataset.date) > 20) {
                    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                    this.render();
                }
            });
        }
    }
    

    const elem = document.getElementById(this.id);
    elem.innerHTML = '';
    elem.appendChild(container);
}

DatePicker.prototype.previousMonth = function() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.render();
}

DatePicker.prototype.nextMonth = function() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.render();
}

const datePicker = new DatePicker('datepicker', () => {});
datePicker.render();
function getDayInfo(date) {
    // Format the date as a string
    var dateString = date.toDateString();

    // Return the string
    return dateString;
}
