const inquirer = require('inquirer');
const questions = [{
	type: 'list',
	name: 'one',
	message: 'choose one',
	choices: ['input', 'shell', 'nodejs script']
}]
inquirer.prompt(questions).then(function (answers) {
	console.log(answers)
});