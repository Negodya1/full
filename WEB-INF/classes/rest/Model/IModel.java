package rest.Model;

import java.util.ArrayList;

public interface IModel {
    ArrayList<Product> GenerateProductList(ArrayList<ArrayList<String>> products);
    ArrayList<String> checkUser(User user);
    Boolean addUser(User newUser);
    Integer deleteRows(ArrayList<Integer> toDelete);
    ArrayList<Product> getProductsList();
    Integer addRow(Product newProduct);
}
