const currenciesSet = ['USD', 'EUR', 'RUB', 'PLN', 'UAH'];
const currencies = {
    BYR: 1,
};
const rates = {
    BYR: 1,
}
const ratesPrev = {
    BYR: 1,
}
const date = new Date();
const today = date.toISOString().slice(0,10);
const startDate = new Date((date.getFullYear() -1).toString()).toISOString().slice(0,10);
const datePicker = document.getElementById('date');
const dateBlocks = document.querySelectorAll('.dateBlock');
datePicker.value = today;
datePicker.setAttribute('min', startDate);
datePicker.setAttribute('max', today);
document.querySelector('.date p span').textContent = convertDate(startDate);
document.querySelector('.converterFooter').textContent = convertDate(today);
document.querySelector('.dateBlock .currDate').textContent = convertDate(today);
let prevDay = getPrevDate(date);
console.log(prevDay);

function getPrevDate(date) {
    let temp = new Date(date);
    temp.setDate(temp.getDate() - 1);
    temp = temp.toISOString().slice(0,10);
    return temp;
}

function convertDate(date) {
    let temp = date.split('-');
    temp = `${temp[2]}.${temp[1]}.${temp[0]}`;
    return temp;
}

function getRates(date) {
    
    fetch(`http://www.nbrb.by/API/ExRates/Rates?onDate=${date}&Periodicity=0`)
    .then(response => response.json())
    .then(response => {
        
        response.forEach(elem => {
            if (currenciesSet.includes(elem.Cur_Abbreviation)) {
                currencies[elem.Cur_Abbreviation] = elem.Cur_OfficialRate / elem.Cur_Scale;
                rates[elem.Cur_Abbreviation] = elem.Cur_OfficialRate;
            }
        });

        console.log('текущий',response);
        console.log('текущие', rates);
        setRates('rates')
        
    })
    document.querySelector('.dateBlock .currDate').textContent = convertDate(date);
}

function setRates(obj) {
    dateBlocks.forEach((elem, i) => {
    if (i !== 0) {
        let temp = elem.getAttribute('data-type');
        if (obj === 'rates') elem.children[2].textContent = rates[temp];
        if (obj === 'ratesPrev') elem.children[1].textContent = ratesPrev[temp];
    }
});
}

getRates(today);

function getPrevRates(date) {
        
    
    fetch(`http://www.nbrb.by/API/ExRates/Rates?onDate=${date}&Periodicity=0`)
    .then(response => response.json())
    .then(response => {
        
        response.forEach(elem => {
            if (currenciesSet.includes(elem.Cur_Abbreviation)) {
                ratesPrev[elem.Cur_Abbreviation] = elem.Cur_OfficialRate;
            }
        });
        console.log('прошлые', ratesPrev);
        console.log('прошлый',response);
        setRates('ratesPrev');
    })
    document.querySelector('.dateBlock .prevDate').textContent = convertDate(date);
}

getPrevRates(prevDay);

const converterBlock = document.querySelector('.converter');
converterBlock.addEventListener('input', function(event) {
    console.log('conv');
   updateResults(event.target, event.target.value);
})

converterBlock.addEventListener('dblclick', function(event) {
    console.log('nen');
    if (event.target.tagName === 'INPUT') event.target.value = '';
 })

 const inputs = currenciesSet.map(elem => document.getElementById(elem));
 inputs.push(document.getElementById('BYR'));

function updateResults(target, value) {
    inputs.forEach(elem => {
        if (elem != target) {
            let newValue = value * (currencies[target.id] / currencies[elem.id]);
            newValue = roundToTwo(newValue);
            elem.value = newValue ? newValue : '';
            elem.value = roundToTwo(newValue);
        }
    })
}

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

datePicker.addEventListener('input', function(event){
    
    if (datePicker.value < startDate || datePicker.value > today) {
        datePicker.classList.add('red');
    } else {
        datePicker.classList.remove('red');
    }
        
    
})

const header = document.querySelector('.widgetHeader');
header.addEventListener('click', function(event) {
   
    console.log('head');
    const ref = event.target.getAttribute('data-ref');
    if (ref !== 'date') {
        if (datePicker.value >= startDate && datePicker.value <= today) {
            let temp = getPrevDate(datePicker.value);
            getRates(datePicker.value);
            getPrevRates(temp);
        }
        else {
            datePicker.value = today;
            datePicker.classList.remove('red');
        }
        let temp = datePicker.value.split('-');
        document.querySelector('.converterFooter').textContent = `${temp[2]}.${temp[1]}.${temp[0]}`;
        
    }
    //if (ref === 'rates') {
       
    // }
    document.querySelectorAll('.widgetBody>div').forEach(elem => elem.classList.add('hidden'));
    document.querySelector(`.${ref}`).classList.remove('hidden');
    header.querySelectorAll('div').forEach(elem => elem.classList.remove('active'));
    event.target.classList.add('active');
})
console.log(inputs);