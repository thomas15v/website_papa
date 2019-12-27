$(document).ready(function(){
    const months = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
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
    const inputCatalogValue = new AutoNumeric('#catalogValue', 'euroPos');
    const inputco2 = new AutoNumeric('#co2', options = {
        maximumValue: 999,
        minimumValue: 0,
        decimalPlaces: 0,
        suffixText: ' gr/km'
    });
    $('form :input').change(function(){
        const catalogValue = parseFloat(inputCatalogValue.get());

        const fuelType = $('#fuelType').val();
        let co2 = parseInt(inputco2.get());
        let firstRegistrationDate = $('#firstRegistrationDate').val();
        const year = parseInt($('#year').val());

        if (fuelType && fuelType == 'electric'){
            co2 = 0;
            $('#co2Field').addClass('hiddendiv');
        } else {
            $('#co2Field').removeClass('hiddendiv');
        }

        if (catalogValue && fuelType && Number.isInteger(co2) && firstRegistrationDate && year){
            $("#data").removeClass('hiddendiv');
            $('#tabledata').empty();
            const table = $('#tabledata');
            const dateArray = firstRegistrationDate.split('/')
            firstRegistrationDate = new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0])
            let total = 0;
            for (let i = 1; i <= 12; i++){
                let month = months[i-1]
                let value = calculateBenefitsForMonth(i, year, catalogValue, fuelType, co2, firstRegistrationDate)
                total += value;
                table.append("<tr><td>" + month + "</td><td>" + AutoNumeric.format(value, AutoNumeric.getPredefinedOptions().French) + "</td></tr>")
            }
            $('#totalfield').text(AutoNumeric.format(total, AutoNumeric.getPredefinedOptions().French))

            //aftrekbaarheid addon
            $('#fuelCoefficientDiv').removeClass('hiddendiv');
            let fuelCoefficient = calculateDeductible(year, fuelType, co2)
            $('#fuelCoefficient').html("Fiscaal aftrekbaar : " + fuelCoefficient + " %");
        } else {
            $("#data").addClass('hiddendiv');
            $('#tabledata').empty()
        }
    });
});
