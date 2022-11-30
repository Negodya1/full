package rest.DataBase;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Vector;
import java.util.Random;

public class ConnectionPool implements IConnectionPool {
    
    private static ConnectionPool instance;

    private Vector<Connection> availableConns = new Vector<Connection>();
    private Vector<Connection> usedConns = new Vector<Connection>();
    private String url;
    private String login;
    private String password;

    private int errorCount = 0;

    private int maxConnectionsCount = 15;

    public static synchronized ConnectionPool initConnectionPool(String url, String login, String password, String driver, int initConnCnt){
        if(instance == null){
            instance = new ConnectionPool(url, login, password, driver, initConnCnt);
        }

        return instance;
    };
    
    private ConnectionPool(String url, String login, String password, String driver, int initConnCnt) {
		try{
			Class.forName(driver);
		} catch (Exception e) {
			e.printStackTrace();
		}

		this.url = url;
		this.login = login;
		this.password = password;

        if(initConnCnt > maxConnectionsCount) initConnCnt = maxConnectionsCount;

		for (int i = 0; i < initConnCnt; i++) {
			availableConns.addElement(getConnection());
		}
	}

    private Connection getConnection() {
		try {
			return DriverManager.getConnection(url, login, password);
		} catch (Exception e) {
			e.printStackTrace();
            return null;
		}
	}

    private Connection checkConnReconnect(Connection conn) throws SQLException, NullPointerException{
                
        if(conn.isClosed() == true || conn == null || conn.isValid(0) == false){
            usedConns.removeElement(conn);
            conn.close();
            conn = getConnection();
            errorCount++;
        }

        if(errorCount > 10){
            closeConnections();
            errorCount = 0;
        }

        usedConns.add(conn);

        return conn;
    }

    private void closeConnections(){
        for(Connection conn : usedConns){
            try{
                conn.close();
            }catch(SQLException ex){}
        }

        usedConns.clear();

        for(Connection conn : availableConns){
            try{
                conn.close();
            }catch(SQLException ex){}
        }

        availableConns.clear();
    }


    @Override
    public synchronized Connection retrieveConnection() throws SQLException, NullPointerException {
        
        Connection newConn = null;

        if (availableConns.size() == 0) {

            //If used conn count is not maximum
            if(usedConns.size() < maxConnectionsCount){
                newConn = getConnection();
                usedConns.addElement(newConn);

                //If used conn count is maximum. Will return random of existing connections
            }else{

                Random rnd = new Random();
                
                int rndConnNum = rnd.nextInt(maxConnectionsCount);

                int i = 0;
                for(Connection conn : usedConns){
                    if(i == rndConnNum){
                        newConn = conn;
                        break;
                    }
                    i++;
                }

		    }
        }
        else{

            newConn = (Connection)availableConns.lastElement();
            usedConns.addElement(newConn);
            availableConns.removeElement(newConn);
            
        }

        return checkConnReconnect(newConn);
	}

    @Override
    public synchronized void putback(Connection c) throws NullPointerException{
        if (c != null) {
            if (usedConns.removeElement(c)) {
                availableConns.addElement(c);
            } else {
                throw new NullPointerException("This conn is not in usedConns");
            }			
        }
    }

    @Override
    public int getAvailableConnsCnt() {
		return availableConns.size();
	}
}
