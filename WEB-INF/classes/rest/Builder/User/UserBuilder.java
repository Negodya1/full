package rest.Builder.User;

import rest.Builder.Built;
import rest.Model.User.IUserModel;
import rest.Repository.User.IUserData;

import jakarta.inject.Inject;
import jakarta.enterprise.inject.Produces;
import jakarta.enterprise.inject.Default;

public class UserBuilder {
    
    @Inject @Default
    private IUserModel userModel;

    @Inject @Default
    private IUserData userRepos;

    @Produces @Built
    public IUserModel buildModel(){
        userModel.setDataSource(userRepos);
        return userModel;
    }

}
