const inquirer = require('inquirer');
const ENV = process.env
const env9 = ENV['env9']
const questions = [{
	type: 'list',
	name: 'one',
	message: 'choose one',
	choices: ['input', 'shell', 'nodejs script']
}]
inquirer.prompt(questions).then(function (answers) {
	console.log(answers)
});