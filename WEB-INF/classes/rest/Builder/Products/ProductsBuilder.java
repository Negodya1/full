package rest.Builder.Products;

import rest.Builder.Built;
import rest.Model.Products.IProductsModel;
import rest.Repository.Products.IProductsData;

import jakarta.inject.Inject;
import jakarta.enterprise.inject.Produces;
import jakarta.enterprise.inject.Default;

public class ProductsBuilder {
    
    @Inject @Default
    private IProductsModel productsModel;

    @Inject @Default
    private IProductsData productsRepos;

    @Produces @Built
    public IProductsModel buildModel(){
        productsModel.setDataSource(productsRepos);
        return productsModel;
    }

}
