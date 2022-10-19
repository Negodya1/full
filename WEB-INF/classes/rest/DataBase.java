package rest;

import java.sql.*;

import javax.swing.text.StyledEditorKit.BoldAction;
import java.util.ArrayList;

public class DataBase {
    private static DataBase instance;
    private static Connection conn = null;
    
    private DataBase() throws SQLException, SQLTimeoutException{
        try{Class.forName("org.postgresql.Driver");} catch(Exception ex){}
        try{conn = getConnection();}catch (Exception ex){};
	}

    public static DataBase initDataBase() throws SQLException, SQLTimeoutException, Exception{
        if(instance == null){
            instance = new DataBase();
        }
        if(conn == null || conn.isValid(1) == false || conn.isClosed() == true){
            conn = getConnection();
        }
        return instance;
    }

    private static Connection getConnection() throws SQLException, SQLTimeoutException{
        String url = "jdbc:postgresql://localhost:5432/postgres?serverTimezone=Europe/Moscow&useSSL=false";
    	String username = "postgres";
    	String password = "12345";

    	return DriverManager.getConnection(url, username, password);
    };

    public static boolean isUserCorrect(String login, String password) throws SQLException, SQLTimeoutException{
        PreparedStatement statement = conn.prepareStatement("SELECT * FROM users");
        ResultSet resultSet = statement.executeQuery();

        while(resultSet.next()){
            if(resultSet.getString("login").equals(login)){
                if(resultSet.getString("password").equals(password)){
                    statement.close();
                    resultSet.close();
                    return true;
                }
            } else{continue;}
        }

        statement.close();
        resultSet.close();
        return false;
    }

    public static Boolean createUser(String login, String password, String email) throws SQLException, SQLTimeoutException{     
        String sqlInsert = "INSERT INTO users(login, password, email) Values (?, ?, ?)";
        PreparedStatement preparedStatement = conn.prepareStatement(sqlInsert);
        preparedStatement.setString(1, login);
        preparedStatement.setString(2, password);
        preparedStatement.setString(3, email);
        int rows = preparedStatement.executeUpdate();
        preparedStatement.close();
        if(rows != 0){ return true;}
        else return false;
    }

    public static void addRow(String name, int price, String description) throws SQLException, SQLTimeoutException{     
        String sqlInsert = "INSERT INTO products(ProductName, Price, Description) Values (?, ?, ?)";
        PreparedStatement preparedStatement = conn.prepareStatement(sqlInsert);
        preparedStatement.setString(1, name);
        preparedStatement.setInt(2, price);
        preparedStatement.setString(3, description);        
        preparedStatement.executeUpdate();
        preparedStatement.close();
    }

    public static void deleteRows(ArrayList<Integer> to_delete) throws SQLException, SQLTimeoutException{
        String sqlDelete = "DELETE FROM products WHERE id = (?)";
        if(to_delete != null){
            PreparedStatement preparedStatement = conn.prepareStatement(sqlDelete);
            for(Integer to_delete_row: to_delete){

                preparedStatement.setString(1, String.valueOf(to_delete_row));

                preparedStatement.executeUpdate();

            }
            preparedStatement.close();
        }
    }

    public static ArrayList<Product> selectProducts() throws SQLException, SQLTimeoutException{

        PreparedStatement statement = conn.prepareStatement("SELECT * FROM products");
        ResultSet resultSet = statement.executeQuery();

        ArrayList<Product> strResultSet = new ArrayList<>();

        while(resultSet.next()){
            Product newProduct = Product.createProduct(
                resultSet.getInt("id"),
                resultSet.getString("ProductName"),
                resultSet.getInt("Price"),
                resultSet.getString("Description")
            );
            
            strResultSet.add(newProduct);
        }

        resultSet.close();
        statement.close();
        return strResultSet;
    }
}
