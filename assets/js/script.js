var localStorageKey = 'work-day-scheduler-schedule';    // name of the key for localstorage
var schedule; // variable for map to hold events for given times

// sets the current day on the page in Day, Month Date format
$('#currentDay').text(moment().format('dddd, MMMM Do'));


// attempts to load scheduled events from local storage
function loadSchedule() {
    // attempts to get saved events from localstorage - leaving it as an array at first
    schedule = JSON.parse(localStorage.getItem(localStorageKey));
    // if no key-value was found, sets schedule to a new map
    if (!schedule) {
        schedule = new Map();
    } else {
        // otherwise convert array from local storage to a map and loop through populating the schedule with saved events
        schedule = new Map(schedule);
        var timeBlock;
        $('.time-block').each(function () {
            timeBlock = $(this).attr('data-time-block');    // current time block time
            // if there is an event saved for this time, add it to the schedule
            if (schedule.get(timeBlock)) {
                $(this).find('.event').text(schedule.get(timeBlock));
            }
        });
    }
};

// saves schedule to local storage converting the schedule Map variable to an array
function saveSchedule() {
    localStorage.setItem(localStorageKey, JSON.stringify(Array.from(schedule.entries())));
};

// function used to get text to display time
function getTimeText(i) {
    var time;
    if ((i % 24) == 0){         // Checks for 12am Midnight
        time = 12 + 'am';
    } else if ((i % 12) == 0){  // Checks for 12pm Noon
        time = 12 + 'pm';
    } else if ((i % 24) > 12) { // Checks for after 12pm Noon
        time = (i % 12) + 'pm';
    } else {                    // Else it is before 12pm Noon
        time = (i % 12) + 'am';
    }
    return time;
}

// Generates the entire schedule on the page
function createSchedule() {
    // loops to create the work schedule from hour 9 to 17 (9am to 5pm)
    // can change to whatever hours desired
    for (var i = 9; i <= 17; i++) {
        // creates the appropriate display for the time for - written to work if we change the hours desired for the schedule
        var timeText = getTimeText(i);

        var timeBlock = $('<div>').addClass('row time-block').attr('data-time-block', i);
        timeBlock.append(
            $('<div>').addClass('hour col-1 d-flex align-items-center justify-content-center').text(timeText)
        );
        timeBlock.append(
            $('<textarea>').addClass('event col-10')
        );
        timeBlock.append(
            $('<button>').addClass('btn col-1 saveBtn d-flex justify-content-center align-items-center')
                .append($('<i>').addClass('bi bi-calendar-check-fill'))
        );
        $('div.container').append(timeBlock);
    }
    colorSchedule();
    loadSchedule();
};

function colorSchedule() {
    // gets the current hour in the 24 hour clock
    var currentHour = moment().format('H');
    var hourBlock;
    // loops through each time-block of the schedule
    $('.time-block').each(function () {
        // current time blocks hour in the 24 hour clock
        hourBlock = parseInt($(this).attr('data-time-block'));
        if (currentHour > hourBlock) { // marks as past if current hour is greater than hour of time block
            $(this).find('.event').addClass('past');
        } else if (currentHour < hourBlock) { // marks as future if current hour is less than hour of time block
            $(this).find('.event').addClass('future');
        } else { // else hour is the present
            $(this).find('.event').addClass('present');
        }
    });
};

// Adds an event listener to the schedule container to listen for clicks on saveBtn
$('.schedule').on('click', '.saveBtn', function () {
    // time block to be saved and event for given time block
    var timeBlock = $(this).parent('.time-block').attr('data-time-block');
    var event = $(this).parent('.time-block').find('.event').val();

    // exits if there is no event to be saved
    if (!event) { return false; }

    schedule.set(timeBlock, event);
    saveSchedule();
});

// Sets click event for Delete Button to delete all events in the schedule
$('.delete-button').on('click', function () {
    schedule = new Map();
    saveSchedule();
    $('.time-block').each(function () {
        $(this).find('.event').text('');
    });
});


createSchedule();