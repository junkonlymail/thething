'use strict';

const express = require('express');
const router = express.Router();

const comment = require('./services').Comment;
const verification = require('./services').Verification;
const persons = require('./models').Persons;
const person = require('./models').Person;
const wperson = require('./models').WindyPerson;

const people = new persons();

/* GET employees listing. */
router.get('', async (req, res) => {

	if(people.getPersons().length === 0) {
		let newPerson = new person('Daffy', 'Duck', new Date(), 'CEO', '00000000-0000-0000-0000-000000000000')
		
		let comments = await new comment().get();
		newPerson = new wperson(newPerson, comments);
		people.addPerson(newPerson);
	} 
	
	return res.send(people.getPersons());
});

/* GET employees listing. */
router.get('/:id', function(req, res) {
	
	let person = people.findPersonById(req.params.id);
	
  return res.send(person);
});

router.post('/', async (req, res) => {
	
	let newPerson = new person(req.body.firstName, req.body.lastName, req.body.hireDate, req.body.role)
		
	let validation = new verification().verify(people.getPersons(), newPerson);
	
	if(!validation.isValid)
	{
		console.log(validation.exception);
		return res.status(400).send(validation.exception);
	}
	
	let comments = await new comment().get();
	newPerson = new wperson(newPerson, comments);
	people.addPerson(newPerson);
	
  return res.send(newPerson)
})

router.put('/:id', function (req, res) {

	let modifyPerson = new person(req.body.firstName, req.body.lastName, req.body.hireDate, req.body.role, req.params.id)
		
	let validation = new verification().verify(people.getPersons(), modifyPerson);
	
	if(!validation.isValid)
	{
		console.log(validation.exception);
		return res.status(400).send(validation.exception);
	}
	
	people.updatePerson(modifyPerson);
	
  return res.send(modifyPerson)
})

router.delete('/:id', function (req, res) {

	let id = req.params.id;
	
	people.removePerson(id);
	
  return res.json ( {id : id});
})

module.exports = router;
