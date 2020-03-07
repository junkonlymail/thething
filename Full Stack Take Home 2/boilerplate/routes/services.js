const axios = require('axios');
const moment = require('moment');

class Comment
{
	async get()
	{	
		try {
			var calls = [ new ExternalRon().get(), new ExternalJoke().get(), new ExternalQuotes().get()];
			
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
	transformResponse;

	constructor(url, headers)
	{
		this.#url = url;
		this.#headers = headers;
	}

	get() {
		return axios.get(this.#url, { headers: this.#headers, transformResponse: this.transformResponse })
			.then(function (response) { 
				return response.data;
			})
			.catch(function (error) { 
				console.error(error); 
			});
	}
}

class ExternalRon extends ExternalApiBase
{
	constructor()
	{
		super("https://ron-swanson-quotes.herokuapp.com/v2/quotes", { accept: 'application/json', timeout: 1000 });
		super.transformResponse = [(data, headers) => this.getText(data) ];
	}
	
	getText(data) {
		data = JSON.parse(data);
	  return data[0];
	}
}

class ExternalJoke extends ExternalApiBase
{
	constructor()
	{
		super("https://icanhazdadjoke.com", { accept: 'application/json', timeout: 1000 });
		super.transformResponse = [(data, headers) => this.getText(data) ];
	}
	
	getText(data) {
		data = JSON.parse(data);
	  return data.joke;
	}
}

class ExternalQuotes extends ExternalApiBase
{
	constructor()
	{
		super("https://quotes.rest/qod", { accept: 'application/json', timeout: 1000 });
		super.transformResponse = [(data, headers) => this.getText(data) ];
	}
	
	getText(data) {
		data = JSON.parse(data);
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

