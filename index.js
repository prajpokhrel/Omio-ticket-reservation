const app = require('./express/app');
const { sequelize } = require('./sequelize/models');
const chalk = require('chalk');
const PORT = process.env.PORT || 5000;
const HOSTNAME = "127.0.0.1";

async function checkDatabaseConnection() {
    console.log(chalk.cyan("Checking database connection..."));
    try {
        // Do some stuffs...
        await sequelize.authenticate();
        console.log(chalk.green("Connected to database..!"));
    } catch (error) {
        // Do other stuffs...
        console.log(chalk.red("Unable to connect to the database."));
        console.log(error.message);
        process.exit(1);
    }
}

async function initializeServer() {
    await checkDatabaseConnection();
    console.log(chalk.bgGray(chalk.blue("Starting Sequelize and express.")));

    app.listen(PORT, () => {
        console.log(chalk.green(`Connected to http://${HOSTNAME}:${PORT}`));
    });
}

initializeServer();