package rest.DataBase;

import java.sql.Connection;
import java.sql.SQLException;

interface IConnectionPool {
    Connection retrieveConnection() throws SQLException, NullPointerException;
    void putback(Connection c) throws NullPointerException;
    int getAvailableConnsCnt();
}
