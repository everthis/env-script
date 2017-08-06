const fs = require('fs')
const path = require('path')
const acorn = require('acorn')
const {promisify} = require('util')
const readFileAsync = promisify(fs.readFile)
const walk = require("acorn/dist/walk")

const walkSync = (dir, filelist = []) => {
  let tmpPath = ''
  fs.readdirSync(dir).forEach(file => {
    tmpPath = path.join(dir, file)
    filelist = fs.statSync(tmpPath).isDirectory()
      ? walkSync(tmpPath, filelist)
      : (typeCheck(tmpPath) ? filelist.concat(tmpPath) : filelist)
  })
  return filelist
}

function typeCheck(filePath) {
	const types = ['js', 'yml', 'json', 'config', 'tpl', 'html']
	for (let i = types.length - 1; i >= 0; i--) {
		if(types.indexOf(path.extname(filePath).slice(1)) !== -1) {
			return true
		}
	}
	return false
}

function pp (obj) {
  return JSON.stringify(obj, null, 2)
}

function getEnvIdentifier(node, list) {
	let res = ''
	if (node.object
		&& node.object.type === 'Identifier'
		&& node.object.name === 'ENV') {
        if (node.property
			&& node.property.type === 'Literal') {
        	res = node.property.value
        } else if (node.property
			&& node.property.type === 'Identifier') {
        	res = node.property.name
        }
	}
	res === '' ? null : list.push(res)
	return list
}

async function genAST(file) {
	const res = []
	try {
		const wantedFileList = walkSync(path.resolve(__dirname, 'dir1'))
		let str = ''

		for (let i = wantedFileList.length - 1; i >= 0; i--) {
			str = await readFileAsync(wantedFileList[i], {encoding: 'utf8'})
			// AssignmentExpression
			// res.push(acorn.parse(str))
			walk.ancestor(acorn.parse(str), {
			  MemberExpression(node, ancestor) {
			  	getEnvIdentifier(node, res)
			  }
			})
		}
	} catch (err) {
		console.log('ERROR:', err)
	}
	return res
}

genAST()
.then(data => console.log(pp(data)))