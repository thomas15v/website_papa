const yearConst = {
    2021: {
        co2: {
            diesel: 91,
            benzine: 111,
            electric: 0,
            cng: 111
        },
        fuelCoefficient: {
            diesel: 1,
            benzine: 0.95,
            cng: 0.90,
        },
        minBenefit: 1340
    },
    2020: {
        co2: {
            diesel: 91,
            benzine: 111,
            electric: 0,
            cng: 111
        },
        fuelCoefficient: {
            diesel: 1,
            benzine: 0.95,
            cng: 0.90,
        },
        minBenefit: 1340
    },
    2019: {
        co2: {
            diesel: 88,
            benzine: 107,
            electric: 0,
            cng: 107
        },
        minBenefit: 1340
    },
    2018: {
        co2: {
            diesel: 86,
            benzine: 105,
            electric: 0,
            cng: 105
        },
        minBenefit: 1310
    },
    2017: {
        co2: {
            diesel: 87,
            benzine: 105,
            electric: 0,
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
        return Math.round(Math.max(Math.min(120 - (0.5 * yearConst[year]['fuelCoefficient'][fuelType] * co2Emissions), 100), 50))
    } else {
        if (fuelType == 'electric') return 120;
        const table = oldfuelCoefficient[fuelType];
        const keys = Object.keys(table);
        const key = getNumberNextTo(keys, co2Emissions);
        return table[key];
    }
}
