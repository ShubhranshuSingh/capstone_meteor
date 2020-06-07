import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Items } from '../imports/api/collections.js';

import './main.html';
import './nav.html';
import './home.html';
import './sell.html';
import './item.html';

// Config Form
Accounts.ui.config({
	passwordSignupFields:'USERNAME_AND_EMAIL'
});

// Iron Router
Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
	this.render('Home');
});

Router.route('/sell', function () {
	this.render('sell_form');
});

Router.route('/item/:id', function () {
	this.render('item', {
		data: function() {
			return Items.findOne({_id:this.params.id});
		}
	});
});

// Events 
Template.sell_form.events({
	'click .js-options': function (event) {
		if (event.target.value == 'used') {
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
			price: parseInt(target.price.value),
			createdAt: new Date()
		};
		Items.insert(details);

		Router.go('/');
	},
});

// Helpers

Template.Home.helpers({
	ad: function () {
		return Items.find({}, {sort: {'createdAt' : -1} });
	},
});