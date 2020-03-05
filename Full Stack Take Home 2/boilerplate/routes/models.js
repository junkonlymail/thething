const { v4: uuidv4 } = require('uuid');

class Person {
  constructor(firstName, lastName, hireDate, role, id = uuidv4()) {
	this.id = id;
    this.firstName = firstName;
	this.lastName = lastName;
	this.hireDate = hireDate;
	this.role = role.toUpperCase();
  }
}

class WindyPerson extends Person {
  constructor(person, comments) {
	super(person.firstName, person.lastName, person.hireDate, person.role, person.id);
	this.comments = comments;
  }
}

class Persons {
	#items
	constructor() {
		this.#items = new Array();
	}
	
	getPersons()
	{
		return this.#items;
	}
	
	findPersonById(id)
	{
		return this.#items.find(a => a.id === id);
	}
	
	addPerson(person)
	{
		this.#items.push(person);
	}
	
	updatePerson(person)
	{
		let found = this.findPersonById(person.id);
		
		if(found)
		{
			found.firstName = person.firstName;
			found.lastName = person.lastName;
			found.hireDate = person.hireDate;
			found.role = person.role;
		}
	}
	
	removePerson(id)
	{
		for(var i = this.#items.length; i--;)
		{
			if (this.#items[i].id === id)
			{
				this.#items.splice(i, 1);
			}
		}
	}
}

module.exports.Person = Person;
module.exports.WindyPerson = WindyPerson;
module.exports.Persons = Persons;