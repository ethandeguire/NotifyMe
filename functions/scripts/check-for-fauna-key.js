const chalk = require('chalk')

function checkForFaunaKey() {
  if (!process.env.FAUNADB_SERVER_SECRET) {
    console.log(chalk.yellow('Required FAUNADB_SERVER_SECRET enviroment variable not found.'))
    process.exit(1)
  }
}

checkForFaunaKey()
