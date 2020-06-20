import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Items } from '../imports/api/collections.js';
import { SoldItems } from '../imports/api/collections.js';

import './main.html';
import './nav.html';
import './home.html';
import './sell.html';
import './item.html';
import './profile.html';
import './active.html';
import './sold.html';

// Subscribe to collections

Meteor.subscribe('Items');
Meteor.subscribe('SoldItems');

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
	if(!Meteor.user()) Router.go('/');
	else this.render('sell_form');
});

Router.route('/item/:id', function () {
	var item = Items.findOne({_id:this.params.id});
	if(item) this.subscribe('user', item.user_id).wait();
	this.render('item', {
		data: function() {
			return Items.findOne({_id:this.params.id});
		}
	});
});

Router.route('/user/:id', function () {
	if(!Meteor.user() || Meteor.user()._id != this.params.id) Router.go('/');
	else {
		Session.set('active', true);
		this.render('profile', {
			data: function() {
				var user = Meteor.user();
				return {item: Items.find({user_id:user._id}, {sort: {'createdAt' : -1}})};
			}
			});
		};
});

Router.route('/user/:id/sold', function () {
	if(!Meteor.user() || Meteor.user()._id != this.params.id) Router.go('/');
	else {
		Session.set('active', false);
		this.render('profile', {
			data: function() {
				var user = Meteor.user();
				return {item: SoldItems.find({}, {sort: {'createdAt' : -1}})};
			}
			});
		};
});

// Events 
Template.sell_form.events({
	'click .js-options': function (event) {
		if (event.target.value == 'Used') {
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
		if(target.inlineRadioOptions.value == 'Used') {
			if(target.usetime.value) {
				duration = target.usetime.value;
			}
		}
		var user = Meteor.user();
		if(!user) Router.go('/');
		var details = {
			title: target.title.value,
			desc: target.Description.value,
			use: target.inlineRadioOptions.value,
			duration: duration,
			category: target.options.value,
			city: target.city.value,
			state: target.state.value,
			price: parseInt(target.price.value),
			createdAt: new Date(),
			user_id: user._id
		};
		Meteor.call('additem', details);

		Router.go('/');
	},
});

Template.profile.events({
	'click .js-del': function (event) {
		var ad = this;
		ad['createdAt'] = new Date;
		Meteor.call('solditem', ad);
		$('#Modal_warn').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
		$('#'+this._id).fadeOut(1000, function(){
	      	Meteor.call('removeitem', this.id);
	    });	
	},
	'click li': function (event) {
		$('li').removeClass('active');
		$(event.target.parentElement).addClass('active');
	},
});

// Helpers

Template.registerHelper('showdate', function (date) {
	return date.toDateString();
});

Template.Home.helpers({
	ad: function () {
		return Items.find({}, {sort: {'createdAt' : -1} });
	},
});

Template.item.helpers({
	name: function (id) {
		var user = Meteor.users.findOne({_id:id});
		if (user) return user.username;
		return;
	},

	mail: function (id) {
		var user = Meteor.users.findOne({_id:id});
		if (user) return user.emails[0].address;
		return;
	},

	cond: function (item_id) {
		var obj = Items.findOne({_id:item_id});
		if (obj.use == 'Used') {
			return 'Used for ' + obj.duration; 
		}
		else return 'New';
	}
});

Template.profile.helpers({
	mail: function () {
		var user = Meteor.user();
		if(user) return user.emails[0].address;
	},
	name: function () {
		var user = Meteor.user();
		if(user) return user.username;
	},
	active: function () {
		return Session.get('active');
	}
});