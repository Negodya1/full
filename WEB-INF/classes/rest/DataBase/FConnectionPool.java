package rest.DataBase;

public class FConnectionPool {
    public IConnectionPool getConnectionPool(String url, String login, String password, String driver, Integer initConnCnt){
        return ConnectionPool.initConnectionPool(url, login, password, driver, initConnCnt);
    }
}
