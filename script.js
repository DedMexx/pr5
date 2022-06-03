// ------------------------------------
// Указание путей к нужным эл-там формы
// ------------------------------------
let inputs = Array.from(document.getElementsByTagName('input'));
let calculate = document.querySelector('input[type="button"]');
let result = document.getElementById('result');
// Создаём массив с максимальным количеством дней в месяцах по очереди
let maxDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
// Убираем ненужные инпуты из массива (кнопка и неактивный textbox)
inputs.splice(5, 2);
// ----------------------------
// Регулярное выражение для дат
// ----------------------------
let reg = new RegExp(/^(\d{1,2})([./\\-])(\d{1,2})([./\\-])(\d{2}|\d{4})$/);
// ------------------------------------------
// Запред на ввод любых символов, кроме чисел
// ------------------------------------------
inputs[5].onkeypress = function(event) {
	return ((event.keyCode >= 48) && (event.keyCode <= 57) || (event.keyCode >= 45) && (event.keyCode <= 47));
}
// -------------------------------------------------------------------------------------------------------------------------------
// Подгон введёного в textbox значения под единый красивый и полный вид (при нажатии на любой другой эл-мент страницы), исключения
// -------------------------------------------------------------------------------------------------------------------------------
inputs[5].onblur = function () {
	if (inputs[5].value.match(reg)) {
		// Замена на точки (для удобства счёта и красоты у пользователя)
		if (inputs[5].value.indexOf('-') != -1)
			inputs[5].value = inputs[5].value.replaceAll('-', '.');
		if (inputs[5].value.indexOf('/') != -1)
			inputs[5].value = inputs[5].value.replaceAll('/', '.');
		let arrayFirstDataBlur = inputs[5].value.split('.');
		// Исключения для всех возможных случаев превышения значения
		if (arrayFirstDataBlur[1] > 12) {
			alert('Неверно введена дата (указан больший номер месяца, чем существует месяцев)');
			inputs[5].value = '';
		}
		else if (arrayFirstDataBlur[0] > maxDays[arrayFirstDataBlur[1]-1]) {
			alert('Неверно введена дата (указано больший номер дня месяца, чем в нем есть на самом деле)');
			inputs[5].value = '';
		}
		else if (arrayFirstDataBlur[2] % 4 != 0 && arrayFirstDataBlur[0] > 28 && arrayFirstDataBlur[1] == 2) {
				alert('Неверно введена дата (указано больший номер дня месяца, чем в нем есть на самом деле)');
				inputs[5].value = '';
		}
		else if (arrayFirstDataBlur[2] % 100 == 0 && arrayFirstDataBlur[2] % 400 != 0 && arrayFirstDataBlur[0] > 28 && arrayFirstDataBlur[1] == 2) {
			alert('Неверно введена дата (указано больший номер дня месяца, чем в нем есть на самом деле)');
			inputs[5].value = '';
		}
		// Подгон дат под один вид
		else {
			if (arrayFirstDataBlur[0].length < 2)
				inputs[5].value = '0' + inputs[5].value;
			if (arrayFirstDataBlur[1].length < 2)
				inputs[5].value = inputs[5].value.slice(0, 2) + '.0' + arrayFirstDataBlur[1] + '.' + arrayFirstDataBlur[2];
			if (arrayFirstDataBlur[2].length < 3)
				inputs[5].value = inputs[5].value.slice(0, -2) + '20' + arrayFirstDataBlur[2];
		}
	}
	else if (inputs[5].value == '') {}
	else {
		inputs[5].value = '';
		alert('Введите дату, используя цифры, разделяя день, месяц и год точкой, слэшем или тире без использования отрицательных чисел');
	}
	buttonActive();
}
// ---------------------------------------------------------------------
// Добавление каждому активному инпуту события проверки на заполненность
// ---------------------------------------------------------------------
for (let i = 0; i < 7; i++) {
	inputs[i].addEventListener('input', buttonActive);
}
// -------------------------
// Проверка на заполненность
// -------------------------
function buttonActive() {
	if ((inputs[0].checked || inputs[1].checked || inputs[2].checked || inputs[3].checked || inputs[4].checked) && inputs[5].value != "" && Date.parse(inputs[6].value)) {
		calculate.disabled = false;
		calculate.classList.add('active'); }
	else {
		calculate.disabled = true;
		calculate.classList.remove('active'); 
	}
}
// -----------------------------
// Подсчёт при нажатии на кнопку
// -----------------------------
calculate.onclick = function() {
	// Первая дата
	firstData = inputs[5].value;
	let firstDataNewDate = new Date(0, 0, 0, 0, 0, 0, 0);
	let arrayFirstData = firstData.split('.');
	firstDataNewDate.setDate(arrayFirstData[0]);
	firstDataNewDate.setMonth(arrayFirstData[1]-1);
	firstDataNewDate.setFullYear(arrayFirstData[2]);
	firstDataMs = firstDataNewDate.getTime();
	// Вторая дата
	secondData = inputs[6].value;
	let secondDataNewDate = new Date(0, 0, 0, 0, 0, 0, 0);
	let arraySecondData = secondData.split('-');
	secondDataNewDate.setDate(arraySecondData[2]);
	secondDataNewDate.setMonth(arraySecondData[1]-1);
	secondDataNewDate.setFullYear(arraySecondData[0]);
	SecondDataMs = secondDataNewDate.getTime();
	// Подсчёт
	if (firstDataMs < SecondDataMs) {
		// ------------------
		// Подсчёт дней всего
		// ------------------
		days = ((SecondDataMs-firstDataMs)/(1000*60*60*24));
		// Вывод дней всего
		if (inputs[0].checked) {
			if (days % 10 == 1 && days % 100 != 11)
				result.value = Math.round(((SecondDataMs-firstDataMs)/(1000*60*60*24))) + ' день';
			else if ((days % 100 != 12 && days % 100 != 13 && days % 100 != 14) && (days % 10 == 2 || days % 10 == 3 || days % 10 == 4))
				result.value = Math.round(((SecondDataMs-firstDataMs)/(1000*60*60*24))) + ' дня';
			else
				result.value = Math.round(((SecondDataMs-firstDataMs)/(1000*60*60*24))) + ' дней';
		}
		// --------------------------
		// Подсчёт выходных и рабочих
		// --------------------------
		else if (inputs[1].checked || inputs[2].checked) {
			let currentDayNewDate = new Date();
			let weekends = 0;
			for(let j = 0; j <= days; j++) {
				currentDayNewDate.setTime(firstDataNewDate.getTime() + 1000*60*60*24*j);
				if (currentDayNewDate.getDay() == 0 || currentDayNewDate.getDay() == 6) {
					weekends++;
				}
				if (((secondDataNewDate.getTime() - firstDataNewDate.getTime()) == 1000*60*60*24) && firstDataNewDate.getDay() == 0 && secondDataNewDate.getDay() == 6)
					weekends--;
			}
			//Вывод кол-ва выходных дней
			if (inputs[1].checked) {
				if (weekends % 10 == 1 && weekends % 100 != 11)
					result.value = weekends + ' выходной день';
				else if ((weekends % 100 != 12 && weekends % 100 != 13 && weekends % 100 != 14) && (weekends % 10 == 2 || weekends % 10 == 3 || weekends % 10 == 4))
					result.value = weekends + ' выходных дня';
				else
					result.value = weekends + ' выходных дней';
				if (result.value.indexOf('-') != -1)
					result.value = 0 + ' выходных дней'
			}
			//Вывод кол-ва рабочих дней
			else {
				workdays = days - weekends;
				if (workdays % 10 == 1 && workdays % 100 != 11)
					result.value = workdays + ' рабочий день';
				else if ((workdays % 100 != 12 && workdays % 100 != 13 && workdays % 100 != 14) && (workdays % 10 == 2 || workdays % 10 == 3 || workdays % 10 == 4))
					result.value = workdays + ' рабочих дня';
				else
					result.value = workdays + ' рабочих дней';
				if (result.value.indexOf('-') != -1)
					result.value = 0 + ' рабочих дней'
			}
		}
		// ----------------------------
		// Подсчёт кол-ва полных недель
		// ----------------------------
		else if (inputs[3].checked) {
			if (firstDataNewDate.getDay() != 1) {
				for (let x = 1; x < 7; x++) {
					if (firstDataNewDate.getDay() + x == 1 || firstDataNewDate.getDay() + x == 8) {
						firstDataNewDate.setDate(firstDataNewDate.getDate()+1);
						break;
					}
				}
			}
			if (secondDataNewDate.getDay() != 1) {
				secondDataNewDate.setDate(secondDataNewDate.getDate()-secondDataNewDate.getDay()+1)
			}
			weeksCount = Math.floor((secondDataNewDate.getTime() - firstDataNewDate.getTime()) / (1000*60*60*24*7));
			// Вывод кол-ва полных недель
			if (weeksCount % 10 == 1 && weeksCount % 100 != 11)
				result.value = weeksCount + ' полная неделя';
			else if ((weeksCount % 100 != 12 && weeksCount % 100 != 13 && weeksCount % 100 != 14) && (weeksCount % 10 == 2 || weeksCount % 10 == 3 || weeksCount % 10 == 4))
				result.value = weeksCount + ' полных недели';
			else
				result.value = weeksCount + ' полных недель';
			if (result.value.indexOf('-') != -1)
				result.value = 0 + ' полных недель'
		}
		// -----------------------------
		// Подсчёт кол-ва полных месяцев
		// -----------------------------
		else if (inputs[4].checked) {
			monthsCount = (secondDataNewDate.getFullYear() - firstDataNewDate.getFullYear()) * 12;
			monthsCount -= firstDataNewDate.getMonth();
			monthsCount += secondDataNewDate.getMonth();
			// Подсчёт полных месяцев
			if (firstDataNewDate.getDate() == 1 && secondDataNewDate.getDate() == maxDays[secondDataNewDate.getMonth()])
				monthsCount++;
			else if ((firstDataNewDate.getDate() == 1 || secondDataNewDate.getDate() == maxDays[secondDataNewDate.getMonth()]))
				monthsCount = monthsCount;
			else
				monthsCount--;
			if ((secondDataNewDate.getFullYear() % 4 != 0 || (secondDataNewDate.getFullYear() % 100 == 0 && secondDataNewDate.getFullYear() % 400 != 0)) && secondDataNewDate.getDate() == 28)
				monthsCount++;
			// Вывод полных месяцев
			if (monthsCount % 10 == 1 && monthsCount % 100 != 11)
				result.value = monthsCount + ' полный месяц';
			else if ((monthsCount % 100 != 12 && monthsCount % 100 != 13 && monthsCount % 100 != 14) && (monthsCount % 10 == 2 || monthsCount % 10 == 3 || monthsCount % 10 == 4))
				result.value = monthsCount + ' полных месяца';
			else
				result.value = monthsCount + ' полных месяцев';
			if (result.value.indexOf('-') != -1)
				result.value = 0 + ' полных месяцев'
			
		}
	}
	else {
		alert('Первая дата должна быть меньше второй!');
	}
}