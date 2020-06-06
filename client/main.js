import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Items } from '../imports/api/collections.js';

import './main.html';
import './nav.html';
import './home.html';
import './sell.html';

Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
	this.render("Home");
});

Router.route('/sell', function() {
	this.render('sell_form');
});

Template.sell_form.events({
	'click .js-options': function (event) {
		if (event.target.value == "used") {
			$('.js-toggle-vis').removeClass('hide');
		}
		else {
			$('.js-toggle-vis').addClass('hide');
		}
	},
	'submit .item_details': function (event) {
		event.preventDefault();

		const target = event.target;
		var duration = 0;
		if(target.inlineRadioOptions.value == 'used') {
			if(target.usetime.value) {
				duration = parseInt(target.usetime.value);
			}
		}
		var details = {
			title: target.title.value,
			desc: target.Description.value,
			use: target.inlineRadioOptions.value,
			duration: duration,
			category: target.options.value,
			location: target.location.value,
			price: parseInt(target.price.value)
		};
		Items.insert(details);
	},
});
