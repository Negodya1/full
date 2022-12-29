package rest.Model.Products;

import java.util.ArrayList;

import rest.Model.DTO.Product;
import rest.Repository.Products.IProductsData;

public interface IProductsModel {
    public void setDataSource(IProductsData datasource);
    Integer deleteRows(ArrayList<Integer> toDelete);
    ArrayList<Product> getProductsList();
    Integer addRow(Product newProduct);
}
