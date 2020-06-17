import { Meteor } from 'meteor/meteor';
import { Items } from '../imports/api/collections.js';
import { SoldItems } from '../imports/api/collections.js';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.publish('Items', function () {
	return Items.find({});
});

Meteor.publish('SoldItems', function () {
	return SoldItems.find({user_id: this.userId});
});
// {fields: {username:1, emails:1}}

Meteor.publish('user', function (id) {
	return Meteor.users.find({_id:id}, {fields: {username:1, emails:1}});
});