// sets the current day on the page in Day, Month Date format
$('#currentDay').text(moment().format('dddd, MMMM Do'));

// Generates the entire schedule on the page
function createSchedule() {
    // loops to create the work schedule from hour 9 to 17 (9am to 5pm)
    for (var i = 9; i < 18; i++) {
        // creates the appropriate display for the time for - written to work if we change the hours desired for the schedule
        var time;
        if (i > 12) { // meant for any time from 1pm to 11pm
            time = i % 12 + 'pm';
        } else if (i == 12) { // meant for 12pm noon
            time = i + 'pm';
        } else if (i == 0) { // meant for 12am midnight
            time = 12 + 'am'
        } else {            // meant for 1am to 11am
            time = i + 'am';
        }
        var timeBlock = $('<div>').addClass('row time-block').attr('data-time-block', i);
        timeBlock.append(
            $('<div>').addClass('hour col-1 justify-content-center align-items-center d-flex').text(time)
        );
        timeBlock.append(
            $('<textarea>').addClass('event col-10')
        );
        timeBlock.append(
            $('<button>').addClass('col-1 saveBtn d-flex')
                .append($('<i>').addClass('bi bi-calendar-check-fill m-auto'))
        );
        $('div.container').append(timeBlock);
    }
    colorSchedule();
};

function colorSchedule() {
    // gets the current hour in the 24 hour clock
    var currentHour = moment().format('H');
    var hourBlock;
    // loops through each time-block of the schedule
    $('.time-block').each(function () {
        // current time blocks hour in the 24 hour clock
        hourBlock = parseInt($(this).attr('data-time-block'));
        if(currentHour > hourBlock){ // marks as past if current hour is greater than hour of time block
            $(this).find('.event').addClass('past');
        } else if(currentHour < hourBlock){ // marks as future if current hour is less than hour of time block
            $(this).find('.event').addClass('future');
        } else { // else hour is the present
            $(this).find('.event').addClass('present');
        }
    });
};

createSchedule();