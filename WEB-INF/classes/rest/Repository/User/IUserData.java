package rest.Repository.User;

import rest.Model.DTO.User;

public interface IUserData {
    public User getUserData(User getableUser);
    public Boolean addUser(User user);
}
