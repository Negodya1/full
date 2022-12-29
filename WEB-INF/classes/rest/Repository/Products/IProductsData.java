package rest.Repository.Products;

import java.util.ArrayList;

import rest.Model.DTO.Product;

public interface IProductsData {
    public Integer addRow(Product product);
    public Integer deleteRows(ArrayList<Integer> toDeleteIds);
    public ArrayList<Product> getProductsList(); 
}
