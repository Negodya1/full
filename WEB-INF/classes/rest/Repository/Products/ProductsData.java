package rest.Repository.Products;

import java.util.ArrayList;
import java.util.List;

import jakarta.annotation.Resource;
import jakarta.persistence.*;

import jakarta.transaction.*;
import rest.Model.DTO.Product;

public class ProductsData implements IProductsData {

    @PersistenceUnit(unitName = "test-resource_PersistenceUnit")
    private EntityManagerFactory entityManagerFactory;
   
    @Resource
    private UserTransaction userTransaction;

    @Override
    public ArrayList<Product> getProductsList(){
        EntityManager entityManager;

        try{
            entityManager = entityManagerFactory.createEntityManager();

            userTransaction.begin();
            entityManager.joinTransaction();

            ArrayList<Product> productList = new ArrayList<>();

            List<EProduct> eProducts = entityManager.createQuery("SELECT p FROM EProduct p", EProduct.class).getResultList();

            for(EProduct eProduct : eProducts){
                productList.add(eProduct.castToProduct());
            }

            userTransaction.commit();

            return productList;

        }catch(Exception ex){
            return null;
        }
    }
    
    @Override
    public Integer addRow(Product product){

        EntityManager entityManager;

        try{

            entityManager = entityManagerFactory.createEntityManager();

            userTransaction.begin();
            entityManager.joinTransaction();

            EProduct newEProduct = new EProduct(product);

            Integer status = 0;

            if(newEProduct.getName() != null && newEProduct.getName() != ""){
                entityManager.persist(newEProduct);
                status = 1;
            }

            userTransaction.commit();

            return status;

        }
        catch(Exception ex){
            return null;
        }
    }

    @Override
    public Integer deleteRows(ArrayList<Integer> toDeleteIds){

        if(toDeleteIds.size() == 0) return 0;
        EntityManager entityManager;
        
        try{

            entityManager = entityManagerFactory.createEntityManager();

            userTransaction.begin();
            entityManager.joinTransaction();

            Integer rows = 0;

            for(Integer toDeleteId: toDeleteIds){
                try{
                    entityManager.createQuery("DELETE FROM EProduct p WHERE p.id = " + Integer.toString(toDeleteId), EProduct.class).executeUpdate();
                    rows++;
                }
                catch(Exception ex){continue;}
            }

            userTransaction.commit();

            return rows;
        }
        catch(Exception ex){
            return null;
        }

    }
    
}
