package rest.Model.User;

import rest.Model.DTO.User;
import rest.Repository.User.IUserData;

public interface IUserModel {
    public User checkUser(User user);
	public String getStatus(User user);
    public Boolean addUser(User newUser);
    public void setDataSource(IUserData datasource);
}
