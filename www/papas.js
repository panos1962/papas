Papas = {
	dcountMin: 3,
	dcountMax: 10,
	dcount: 3,
	tries: 0,
	success: 0,
	mode: 'Human',
};

$(document).ready(function() {
	Papas.bodyDOM = $(document.body).
	append(Papas.panelTopDOM = $('<div>').addClass('panel')).
	append(Papas.arenaDOM = $('<div>').attr('id', 'arena')).
	append(Papas.panelBottomDOM = $('<div>').addClass('panel')).
	append($('<table>').attr('id', 'footer').append($('<tr>').
	append($('<td>').
	append($('<div>').attr('id', 'legend').
	append('<a href="https://en.wikipedia.org/wiki/Monty_Hall_problem" ' +
		'target="montyhall">Monty Hall</a> problem simulation'))).
	append($('<td>').
	append($('<div>').attr('id', 'copyright').html('Copyright &copy; 2017 by Panos Papadopoulos')))));

	Papas.
	mainSetup().
	panelSetup().
	arenaSetup();
});

Papas.mainSetup = function() {
	try {
		Papas.url = new URL(window.location);
		Papas.dcount = parseInt(Papas.url.searchParams.get('doors'));

		if (isNaN(Papas.dcount) || (Papas.dcount < Papas.dcountMin))
		Papas.dcount = Papas.dcountMin;

		Papas.hint = Papas.url.searchParams.has('hint');

		if (Papas.url.searchParams.has('persist'))
		Papas.mode = 'Persist';

		else if (Papas.url.searchParams.has('switch'))
		Papas.mode = 'Switch';

		Papas.velo = parseInt(Papas.url.searchParams.get('velocity'));

		if (isNaN(Papas.velo))
		Papas.velo = 1000;

	} catch (e) {
		delete Papas.url;
		Papas.dcount = Papas.dcountMin;
	}

	Papas.bodyDOM.
	on('keyup', function(e) {
		e.preventDefault();
		switch (e.which) {
		case 32:	// space
			Papas.hintSwitch();
			break;
		}
	});

	return Papas;
};

Papas.panelSetup = function() {
	Papas.panelTopDOM.

	append($('<div>').attr('id', 'dcount').addClass('data').
	append(Papas.dcountDOM = $('<input>').attr({
		type: 'number',
		min: Papas.dcountMin,
		max: Papas.dcountMax,
		value: Papas.dcount,
	}).on('change', function(e) {
		Papas.dcount = $(this).val();
		Papas.dcountChange();
	}))).

	append($('<div>').attr('id', 'success').addClass('data').
	append(Papas.successDOM = $('<input>').
	prop('disabled', true).attr({
		value: Papas.success,
	}))).

	append($('<div>').attr('id', 'failure').addClass('data').
	append(Papas.failureDOM = $('<input>').
	prop('disabled', true).attr({
		value: Papas.tries,
	})));

	Papas.panelBottomDOM.

	append(Papas.hintDOM = $('<button>').
	prop('title', '[Space toggle]').
	attr('id', 'hintButton').
	on('click', (e) => Papas.hintSwitch())).

	append($('<button>').text('Cancel').
	prop('title', 'Cancel your choice').
	on('click', (e) => Papas.dcountChange({
		target: Papas.target
	}))).

	append(Papas.resetDOM = $('<button>').text('Reset').
	prop('title', 'Reset staticstics').
	on('click', function(e) {
		Papas.tries = 0;
		Papas.success = 0;
		Papas.successDOM.val(0);
		Papas.failureDOM.val(0);
		Papas.dcountChange();
	})).

	append($('<select>').attr('id', 'mode').
	append($('<option>').text('Human')).
	append($('<option>').text('Persist')).
	append($('<option>').text('Switch')).
	on('click', function(e) {
		Papas.modeSet(e, $(this).val());
	})).

	append(Papas.veloDOM = $('<select>').attr('id', 'velo').
	append($('<option value="0">').text('Pause')).
	append($('<option value="3000">').text('Grave')).
	append($('<option value="2000">').text('Αργά')).
	append($('<option value="1000" selected>').text('Γρήγορο')).
	append($('<option value="500">').text('Vivace')).
	append($('<option value="200">').text('Presto')).
	append($('<option value="50">').text('Prestissimo')).
	on('click', function(e) {
		Papas.veloSet(e, $(this).val());
	}));

	Papas.hint = !Papas.hint;
	Papas.hintSwitch();

	return Papas;
};

Papas.arenaSetup = function() {
	Papas.dcountChange();
	return Papas;
};

Papas.dcountChange = function(props) {
	var i;
	var doorClass = 'door';

	if (props === undefined)
	props = {};

	Papas.dcount = Papas.dcountDOM.val();
	Papas.doorArray = [];
	Papas.target = props.hasOwnProperty('target') ? props.target : Papas.randomChoice();
	delete Papas.replay;
	delete Papas.selected;
	Papas.arenaDOM.empty();

	if (Papas.hint)
	doorClass += ' hint';

	for (i = 0; i < Papas.dcount; i++) {
		Papas.arenaDOM.
		append(Papas.doorArray[i] = $('<div>').
		addClass('doorPlesio').
		on('click', function(e) {
			Papas.doorClick({
				door: $(this).data('doorNumber'),
			});
		}));

		if (i === Papas.target)
		Papas.doorArray[i].
		append(Papas.giftDOM = $('<div>').attr('id', 'gift').html('&#x273C'));

		Papas.doorArray[i].
		append($('<div>').
		addClass(doorClass)).
		data('doorNumber', i);
	}

	Papas.arenaDOM.
	append(Papas.fyiDOM = $('<div>').attr('id', 'fyi'));

	Papas.fyiMessage('Select one of ' + Papas.dcount + ' doors');

	if (!Papas.velo)
	return Papas;

	if (Papas.modeAuto())
	Papas.doorClick({
		timer: Papas.velo,
		door: Papas.randomChoice(),
	});

	return Papas;
};

Papas.doorSelect = function(n) {
	if (Papas.selected === undefined)
	Papas.firstChoice(n);

	else
	Papas.secondChoice(n);

	return Papas;
};
	
Papas.firstChoice = function(n) {
	var dom = Papas.doorArray[n];
	var i;

	Papas.selected = n;
	dom.addClass('choice');

	if (Papas.selected === Papas.target) {
		do {
			n = Papas.randomChoice();
		} while (n === Papas.selected);
	}

	else {
		n = Papas.randomChoice();
		for (i = 0; i < Papas.dcount; i++, n = (n + 1) % Papas.dcount) {
			if (n === Papas.selected)
			continue;

			if (n === Papas.target)
			break;
		}
	}

	for (i = 0; i < Papas.dcount; i++) {
		if (i === Papas.selected)
		continue;

		if (i === n)
		continue;

		Papas.doorArray[i].
		data('open', true).
		addClass('inactive').
		children('.door').addClass('open');
	}

	Papas.fyiMessage('You may insist, or select the other door');

	if (Papas.modeHuman())
	return Papas;

	if (Papas.modePersist())
	return Papas.doorClick({
		door: Papas.selected,
		timer: Papas.velo,
	});

	n = Papas.randomChoice();

	for (i = 0; i < Papas.dcount; i++, n = (n + 1) % Papas.dcount) {
		if (n === Papas.selected)
		continue;

		if (Papas.doorArray[n].data('open'))
		continue;

		break;
	}

	return Papas.doorClick({
		door: n,
		timer: Papas.velo,
	});
};

Papas.secondChoice = function(n) {
	Papas.tries++;

	if (n === Papas.target) {
		Papas.success++;
		Papas.fyiMessage('Bingo! Click any door for new game');
	}

	else {
		Papas.giftDOM.addClass('fail');
		Papas.fyiMessage('Try again! Click any door');
	}

	$('.inactive').removeClass('inactive');
	$('.door').addClass('open');
	Papas.replay = true;
	delete Papas.selected;

	Papas.successDOM.val(Papas.success);
	Papas.failureDOM.val(Papas.tries - Papas.success);

	if (Papas.modeAuto())
	Papas.doorClick({
		timer: Papas.velo,
		door: 0,
	});

	return Papas;
};

Papas.hintSwitch = function() {
	Papas.hint = !Papas.hint;

	if (Papas.hint)
	$('.door').addClass('hint');

	else
	$('.door').removeClass('hint');

	Papas.hintDOM.text(Papas.hint ? 'Hide' : 'Hint');

	return Papas;
};

Papas.randomChoice = function() {
	return Math.floor(Math.random() * Papas.dcount);
};

Papas.fyiMessage = function(msg) {
	Papas.fyiDOM.text(msg);
	return Papas;
};

Papas.modeSet = function(e, val) {
	Papas.timerClear();
	Papas.mode = val;

	if (Papas.modeAuto()) {
		Papas.veloDOM.css('display', 'inline-block');
		Papas.doorClick({
			timer: 100,
			door: Papas.randomChoice(),
		});
	}

	else
	Papas.veloDOM.css('display', 'none');

	Papas.resetDOM.trigger('click');
	return Papas;
};

Papas.timerClear = function() {
	if (Papas.timer) {
		clearTimeout(Papas.timer);
		delete Papas.timer;
	}

	return Papas;
};

Papas.modeHuman = function() {
	return (Papas.mode === 'Human');
};

Papas.modeAuto = function() {
	return !Papas.modeHuman();
};

Papas.modePersist = function() {
	return (Papas.mode === 'Persist');
};

Papas.doorClick = function(props) {
	if (props === undefined)
	props = {};

	Papas.timerClear();

	if (props.hasOwnProperty('timer')) {
		Papas.timer = setTimeout(function() {
			Papas.doorClick({
				door: props.door,
			});
		}, props.timer);
	}

	else {
		if (Papas.replay)
		return Papas.dcountChange();

		if (!$(this).data('open'))
		Papas.doorSelect(props.door);
	}

	return Papas;
};

Papas.veloSet = function(e, val) {
	Papas.velo = parseInt(val);

	if (!Papas.velo)
	Papas.timerClear();

	else
	Papas.doorClick({
		timer: Papas.velo,
		door: Papas.randomChoice(),
	});

	return Papas;
};
