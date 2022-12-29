package rest.Repository.User;

import java.util.List;

import jakarta.annotation.Resource;
import jakarta.persistence.*;

import jakarta.transaction.*;
import rest.Model.DTO.User;

public class UserDataSource implements IUserData {
    

    @PersistenceUnit(unitName = "test-resource_PersistenceUnit")
    private EntityManagerFactory entityManagerFactory;
   
    @Resource
    private UserTransaction userTransaction;

    @Override
    public User getUserData(User getableUser){

        EntityManager entityManager;
        
        try {
            entityManager = entityManagerFactory.createEntityManager();
        
            userTransaction.begin();
            entityManager.joinTransaction();

            List<EUser> user = entityManager.createQuery("SELECT u FROM EUser u WHERE u.login = \'"+getableUser.getLogin()+"\'", EUser.class).getResultList();

            User resolveUser;

            if(user.size() == 1){
                resolveUser = user.get(0).castToUser();
            }else{
                resolveUser = new User();
                resolveUser.setLogin(null);
            }

            userTransaction.commit();

            return resolveUser;
        }
        catch (Exception ex){
            System.out.println(ex);
            return null;
        }
        
    }

    @Override
    public Boolean addUser(User user){

        EntityManager entityManager;
        Boolean status = null;
        try{

            entityManager = entityManagerFactory.createEntityManager();
        
            userTransaction.begin();
            entityManager.joinTransaction();

            EUser newUser = new EUser(user);
            if(newUser.getLogin() != null){

                entityManager.persist(newUser);
                status = true;
            }
            else {
                status = false;
            }

            userTransaction.commit();

            return status;
        
        }
        catch (Exception ex){
            if(ex.getCause().getCause().getCause() instanceof java.sql.SQLIntegrityConstraintViolationException) return false;
            System.out.println(ex);
            return null;
        }

    }

}
