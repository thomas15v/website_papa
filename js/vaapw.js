const yearConst = {
    2020: {
        'co2': {
            'diesel': 91,
            'benzine': 111,
        },
        'minBenefit': 1340
    },
    2019: {
        'co2': {
            'diesel': 88,
            'benzine': 107,
        },
        'minBenefit': 1340
    },
    2018: {
        'co2': {
            'diesel': 86,
            'benzine': 105,
        },
        'minBenefit': 1310
    },
    2017: {
        'co2': {
            'diesel': 87,
            'benzine': 105,
        },
        'minBenefit': 1280
    }
};
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
    return Math.max(Math.min(((co2Emissions - yearConst[year]['co2'][fuelType]) / 10) + basisPercentage, maxPercentage), minPercentage) / 100
}

function getCorrectCatalogValue(month, year, catalogValue, firstRegistrationDate) {
    let correctionValue = 100 - (year - firstRegistrationDate.getFullYear()) * 6;
    return (Math.max(firstRegistrationDate.getMonth() >= month ? correctionValue + 6 : correctionValue, 70) / 100) * catalogValue
}


function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function calculateBenefitsForMonth(month, year, catalogValue, fuelType, co2Emissions, firstRegistrationDate){
    const co2Percentage = getCo2Percentage(year, fuelType, co2Emissions);
    const correctCatalogValue = getCorrectCatalogValue(month, year, catalogValue, firstRegistrationDate)
    const daysInYear = getDaysInYear(year);
    const daysInMonth = getDaysInMonth(month, year);
    const minValue = (yearConst[year]['minBenefit'] / daysInYear) ;
    const dayBenefit = Math.max((co2Percentage * correctCatalogValue * 6/7) / daysInYear , minValue);

    if ((month < firstRegistrationDate.getMonth() + 1 && year == firstRegistrationDate.getFullYear()) || year < firstRegistrationDate.getFullYear())
        return 0
    if (month == firstRegistrationDate.getMonth() + 1 && year == firstRegistrationDate.getFullYear()) {
        return dayBenefit * (daysInMonth - firstRegistrationDate.getDate()  + 1)
    }
    else {
        return dayBenefit * daysInMonth
    }
}
