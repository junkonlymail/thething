const axios = require('axios');
const moment = require('moment');

class Comment
{
	async get()
	{	
		try {
			var calls = [ new ExternalRonProvider().get(), new ExternalJokeProvider().get(), new ExternalQuoteProvider().get()];
			
			return await axios.all(calls).then((responses) => { return responses; });	  
		} catch(error) {
			console.log(error);
		}
 	}
}

class ExternalApiBase
{
	#url;
	#headers;

	constructor(url, headers)
	{
		this.#url = url;
		this.#headers = headers;
	}

	getData(data) {
		data = JSON.parse(data);
	  return this.getText(data);
	}
	
	get() {
		return axios.get(this.#url, { headers: this.#headers, transformResponse: [(data, headers) => this.getData(data) ] })
			.then(function (response) { 
				return response.data;
			})
			.catch(function (error) { 
				console.error(error); 
			});
	}
}

class ExternalRonProvider extends ExternalApiBase
{
	constructor()
	{
		super("https://ron-swanson-quotes.herokuapp.com/v2/quotes", { timeout: 1000 });
	}
	
	getText(data) {
	  return data[0];
	}
}

class ExternalJokeProvider extends ExternalApiBase
{
	constructor()
	{
		super("https://icanhazdadjoke.com", { accept: 'application/json', timeout: 1000 });
	}
	
	getText(data) {
	  return data.joke;
	}
}

class ExternalQuoteProvider extends ExternalApiBase
{
	constructor()
	{
		super("https://quotes.rest/qod", { accept: 'application/json', timeout: 1000 });
	}
	
	getText(data) {
	  return data.contents.quotes[0].quote;
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

