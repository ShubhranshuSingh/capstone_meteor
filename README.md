# capstone_meteor
An online marketplace made using Meteor, HTML5, CSS bootstrap, JS and Jquery!

Get started:
1. Install Meteor - https://www.meteor.com/install

2. Add a settings.json file to the root directory after creating an account on cloudinary (https://cloudinary.com/) to get the API key. Cloudinary is a cloud service that allows easy image uploading to the cloud. The structure of the settings.json file:
```
{
	"private": 
	{
		"cloud_name": "Your_Cloud_Name",
		"api_key": "API_key",
		"api_secret": "API_secret"
	},
	"public": 
	{
		"cloud_name": "Your_Cloud_Name",
		"api_key": "API_key"
	}
}
```

3. Clone this repo and run the follwing commands:
```
meteor npm install
meteor --settings settings.json
```

4. Go to localhost:3000/ to access the webpage
