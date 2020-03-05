const axios = require('axios');
const moment = require('moment');

class Comment
{
	async get()
	{	
	 try {	 
		const comments = await axios.all([this.getRon(), this.getJoke(), this.getQod()])
								  .then(axios.spread(function (call1, call2, call3) {								
									let result = new Array();
									
									if(call1) result.push(call1);
									if(call2) result.push(call2);
									if(call3) result.push(call3);
									
									return result ;
								  }));
		  
		  return await comments;
	  } catch(error) {
			console.log(error);
	  }
 	}
	
	getRon() {
		return axios.get('https://ron-swanson-quotes.herokuapp.com/v2/quotes')
					.then(function (response) { 
						return response.data[0]; 
					})
					.catch(function (error) { 
						console.log(error); 
					});
	}

	getJoke() {
		return axios.get('https://icanhazdadjoke.com', { headers: { accept: 'application/json', timeout: 1000 } } )
					.then(function (response) { 
						return response.data.joke; 
					})
					.catch(function (error) { 
						console.log(error); 
					});
	}
	
	getQod() {
		return axios.get('https://quotes.rest/qod', { headers: { accept: 'application/json', timeout: 1000 } })
					.then(function (response) { 
						return response.data.contents.quotes[0].quote; 
					})
					.catch(function (error) { 
						console.log(error); 
					});
	}
}

class Verification
{
	verify(persons, person)
	{
		let result = true;
		let message = "";
		
		if(!person.firstName)
		{
			result = false;
			message += "FirstName can't be empty"
		}
		
		if(!person.lastName)
		{
			result = false;
			message += "LastName can't be empty"
		}
		
		let hDate = moment(person.hireDate, 'YYYY-MM-DD', true);
		if (!hDate.isValid())
		{
			result = false;
			message += "Improper date"
		} else if (moment().diff(hDate) < 0){
			result = false;
			message += "Must be a date in the past"
		}
		
		if (!['CEO','VP','MANAGER','LACKEY'].includes(person.role))
		{
			result = false;
			message += "Role must be one of the following CEO,VP,MANAGER,LACKEY"
		} else if (persons.find(f => f.role === 'CEO') && person.role === 'CEO')
		{
			result = false;
			message += "Only one CEO allowed"
		}
		
		return { isValid: result, exception: message };
	}
}

module.exports.Verification = Verification;
module.exports.Comment = Comment;

