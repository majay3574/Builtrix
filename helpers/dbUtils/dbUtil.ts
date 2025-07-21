import mysql from 'mysql2/promise';
import { test } from '../customFixtures/salesForceFixture';
import { format, addMinutes } from 'date-fns';
import data from "../data/dbData/dbCredentials.json"

/* This project contains a DB class designed to handle database interactions using MySQL with mysql2 / promise.
It provides an executeQuery method to execute SQL queries and return the results.
The class ensures proper connection handling and error management. */


/* DBConfig is a private object storing database connection settings.

It reads the database host, user, database name, password, and port from the JSON file.

waitForConnections: true ensures that if all connections are in use, new requests will wait rather than failing immediately.

connectionLimit: 10 sets the maximum number of connections.

queueLimit: 0 allows an unlimited number of queries to be queued. */

export default class DB {
    private DBConfig: mysql.ConnectionOptions = {
        host: data.database_config.host,
        user: data.database_config.credentials.user,
        database: data.database_config.database_name,
        password: data.database_config.credentials.password,
        port: data.database_config.port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };

   
/*executeQuery(query: string): Asynchronous function that takes a SQL query string as input.

mysql.createConnection(this.DBConfig): Establishes a connection to the database.

connection.execute(query): Executes the provided SQL query and returns the result.

If an error occurs during execution, it is logged and thrown.

finally ensures that the database connection is closed after execution.

connection.end() closes the connection, and errors are caught and logged. */

    async executeQuery(query: string): Promise<any[]> {
        const connection = await mysql.createConnection(this.DBConfig);
        try {
            const [rows] = await connection.execute(query) as [any[], any];
            return rows;
        } catch (error) {
            console.error("Error in connection/executing query:", error);
            throw error;
        } finally {
            await connection.end().catch((error) => {
                console.error("Error ending connection:", error);
            });
        }
    }
}

/* Error Handling
executeQuery(`SELECT * FROM `)
If the query execution fails, an error is logged and rethrown.

If closing the database connection fails, an error is logged but does not affect execution. */

