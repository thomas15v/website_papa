const yearConst = {
      2026: {
        co2: {
            diesel: 58,
            benzine: 70,
            cng: 70
        },
        fuelCoefficient: {
            diesel: 1,
            benzine: 0.95,
            cng: 0.90,
        },
        minBenefit: 1650
    },
    2025: {
        co2: {
            diesel: 59,
            benzine: 71,
            cng: 71
        },
        fuelCoefficient: {
            diesel: 1,
            benzine: 0.95,
            cng: 0.90,
        },
        minBenefit: 1650
    },
    2024: {
        co2: {
            diesel: 65,
            benzine: 78,
            cng: 78
        },
        fuelCoefficient: {
            diesel: 1,
            benzine: 0.95,
            cng: 0.90,
        },
        minBenefit: 1600
    },
    2023: {
        co2: {
            diesel: 67,
            benzine: 82,
            cng: 82
        },
        fuelCoefficient: {
            diesel: 1,
            benzine: 0.95,
            cng: 0.90,
        },
        minBenefit: 1540
    },
    2022: {
        co2: {
            diesel: 75,
            benzine: 91,
            cng: 91
        },
        fuelCoefficient: {
            diesel: 1,
            benzine: 0.95,
            cng: 0.90,
        },
        minBenefit: 1400
    },
    2021: {
        co2: {
            diesel: 84,
            benzine: 102,
            cng: 102
        },
        fuelCoefficient: {
            diesel: 1,
            benzine: 0.95,
            cng: 0.90,
        },
        minBenefit: 1370
    },
    2020: {
        co2: {
            diesel: 91,
            benzine: 111,
            cng: 111
        },
        fuelCoefficient: {
            diesel: 1,
            benzine: 0.95,
            cng: 0.90,
        },
        minBenefit: 1360
    },
    2019: {
        co2: {
            diesel: 88,
            benzine: 107,
            cng: 107
        },
        minBenefit: 1340
    },
    2018: {
        co2: {
            diesel: 86,
            benzine: 105,
            cng: 105
        },
        minBenefit: 1310
    },
    2017: {
        co2: {
            diesel: 87,
            benzine: 105,
            cng: 105
        },
        minBenefit: 1280
    }
};

oldfuelCoefficient = {
    'diesel': {
        0: 120,
        60: 100,
        105: 90,
        115: 80,
        145: 75,
        170: 70,
        195: 60,
        999: 50
    },
    'benzine': {
        0: 120,
        60: 100,
        105: 90,
        125: 80,
        155: 75,
        180: 70,
        205: 60,
        999: 50
    },
    'cng': {
        0: 120,
        60: 100,
        105: 90,
        125: 80,
        155: 75,
        180: 70,
        205: 60,
        999: 50
    }
}

const basisPercentage = 5.5;
const minPercentage = 4;
const maxPercentage = 18;

function getDaysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

function getDaysInYear(year) {
    let days = 0;
    for (let i = 1; i <= 12; i++){
        days += getDaysInMonth(i, year);
    }
    return days
}

function getCo2Percentage(year, fuelType, co2Emissions){
    if (fuelType === 'electric') { 
        return minPercentage / 100;
    }
    return Math.max(Math.min(((co2Emissions - yearConst[year]['co2'][fuelType]) / 10) + basisPercentage, maxPercentage), minPercentage) / 100
}

function getCorrectCatalogValue(month, year, catalogValue, firstRegistrationDate) {
    let correctionValue = 100 - (year - firstRegistrationDate.getFullYear()) * 6;
    return (Math.max(firstRegistrationDate.getMonth() >= month ? correctionValue + 6 : correctionValue, 70) / 100) * catalogValue
}


function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function getNumberNextTo(array, number) {
    for(let i = 0; i < array.length; i++) {
        if (array[i] >= number){
            return array[i]
        }
    }
}

function calculateBenefitsForMonth(month, year, catalogValue, fuelType, co2Emissions, firstRegistrationDate){
    const co2Percentage = getCo2Percentage(year, fuelType, co2Emissions);
    const correctCatalogValue = getCorrectCatalogValue(month, year, catalogValue, firstRegistrationDate)
    const daysInYear = getDaysInYear(year);
    const daysInMonth = getDaysInMonth(month, year);
    const minValue = (yearConst[year]['minBenefit'] / daysInYear) ;
    const dayBenefit = Math.max((co2Percentage * correctCatalogValue * 6/7) / daysInYear , minValue);

    if ((month < firstRegistrationDate.getMonth() + 1 && year == firstRegistrationDate.getFullYear()) || year < firstRegistrationDate.getFullYear())
        return 0;
    if (month == firstRegistrationDate.getMonth() + 1 && year == firstRegistrationDate.getFullYear()) {
        return dayBenefit * (daysInMonth - firstRegistrationDate.getDate()  + 1);
    }
    else {
        return dayBenefit * daysInMonth;
    }
}

function calculateDeductible(year, fuelType, co2Emissions) {
    if (year > 2019){
        if (fuelType == 'electric') return 100;
        if (co2Emissions > 200) return 40;
        return (Math.max(Math.min(120 - (0.5 * yearConst[year]['fuelCoefficient'][fuelType] * co2Emissions), 100), 50)).toFixed(1)
    } else {
        if (fuelType == 'electric') return 120;
        const table = oldfuelCoefficient[fuelType];
        const keys = Object.keys(table);
        const key = getNumberNextTo(keys, co2Emissions);
        return table[key];
    }
}
if (typeof $ !== 'undefined') {
    $(document).ready(function () {
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
                $('#fuelCoefficient').html(("Fiscaal aftrekbaar : " + fuelCoefficient + " %").replace('.', ','));
            } else {
                $("#data").addClass('hiddendiv');
                $('#tabledata').empty()
            }
        });
    })
}

exports._test = {
    getCo2Percentage: getCo2Percentage,
    getCorrectCatalogValue: getCorrectCatalogValue,
    getDaysInYear: getDaysInYear,
    getDaysInMonth: getDaysInMonth,
    calculateBenefitsForMonth: calculateBenefitsForMonth,
    calculateDeductible: calculateDeductible
}
