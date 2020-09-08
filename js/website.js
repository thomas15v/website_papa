const months = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
$(document).ready(function(){
    $('.sidenav').sidenav();
    $('select').formSelect();
    $('.tooltipped').tooltip();
    $('.datepicker').datepicker(options={
        format: 'dd/mm/yyyy',
        firstDay: 1,
        i18n: {
            cancel: 'Annuleren',
            clear: 'Wissen',
            done: 'Ok',
            previousMonth: '‹',
            nextMonth: '›',
            months: months,
            monthsShort: ['Jan', 'Feb', 'Maa', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
            weekdays: ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
            weekdaysShort: ['Zon', 'Maa', 'Din', 'Woe', 'Don', 'Vri', 'Zat'],
            weekdaysAbbrev: ['Z', 'M', 'D', 'W', 'D', 'V', 'Z']
        },
    });
});
