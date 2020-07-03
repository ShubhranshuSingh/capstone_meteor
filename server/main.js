import { Meteor } from 'meteor/meteor';
import { Items } from '../imports/api/collections.js';
import { SoldItems } from '../imports/api/collections.js';

Meteor.startup(() => {
  // code to run on server at startup
});

// Publish collections
Meteor.publish('Items', function () {
	return Items.find({});
});

Meteor.publish('SoldItems', function () {
	return SoldItems.find({user_id: this.userId});
});

Meteor.publish('user', function (id) {
	return Meteor.users.find({_id:id}, {fields: {username:1, emails:1}});
});

// Methods
Meteor.methods({
	'additem': function(item) {
		if(!this.userId) return;
		Items.insert(item);
	},
	'solditem': function(item) {
		if(!this.userId) return;
		SoldItems.insert(item);
	},
	'removeitem': function(id) {
		if(!this.userId) return;
		Items.remove({_id:id});
	}
});

//Cloudinary

Cloudinary.config({
    cloud_name: Meteor.settings.private.cloud_name,
    api_key: Meteor.settings.private.api_key,
    api_secret: Meteor.settings.private.api_secret
});

Cloudinary.rules.signature = function() {
  return this.userId;
};