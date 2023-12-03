let cadastralValue;

const yearConst = {
    2020: {
        index: 1.8230,
        heating: 2030.00,
        electric: 1010
    },
    2021: {
        index: 1.8492,
        heating: 2060.00,
        electric: 1030
    },
    2022: {
        index: 1.8630,
        heating: 2080.00,
        electric: 1030
    },
    2023: {
        index: 1.9084,
        heating: 2130.00,
        electric: 1060
    },
    2024: {
        index: 2.0915,
        heating: 2330.00,
        electric: 1160
    }
}


function calculateBenefits(cadastralValue, year, furnished){
    console.log((furnished ?  5/3 : 1))
    return cadastralValue * yearConst[year]['index'] * (100 / 60) * 2 * (furnished ?  5/3 : 1)
}

function calculate(){
    const cadastral = parseFloat(cadastralValue.get());
    const year = $('#year').val();
    const furnished = $('#furnished').prop('checked')
    const heating = $('#heating').prop('checked');
    const electricity = $('#electricity').prop('checked')

    $('#total').text(AutoNumeric.format(calculateBenefits(cadastral, year, furnished), AutoNumeric.getPredefinedOptions().French));

    if (heating){
        $('#totalHeating').text(AutoNumeric.format(yearConst[year]['heating'], AutoNumeric.getPredefinedOptions().French));
        $('#totalHeatingDiv').removeClass('hiddendiv');
    } else {
        $('#totalHeatingDiv').addClass('hiddendiv');
    }

    if (electricity) {
        $('#totalElectricity').text(AutoNumeric.format(yearConst[year]['electric'], AutoNumeric.getPredefinedOptions().French));
        $('#totalElectricityDiv').removeClass('hiddendiv');
    } else {
        $('#totalElectricityDiv').addClass('hiddendiv');
    }
}

$(document).ready(function () {
    cadastralValue = new AutoNumeric('#cadastral', 'euroPos');
    $('form :input').change(calculate);
    calculate(cadastralValue)
})