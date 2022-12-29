package rest.Repository.User;

import java.io.Serializable;
import jakarta.persistence.*;
import rest.Model.DTO.User;

@Entity
@Table(name = "\"users\"")
public class EUser implements Serializable {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name = "\"id\"")
    private Integer id;

    @Column(name = "\"login\"")
    private String login;

    @Column(name = "\"password\"")
    private String password;

    @Column(name = "\"email\"")
    private String email;
	
	@Column(name = "\"role\"")
    private String status;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

	public String getStatus() {
        return status;
    }

    public void setStatus(String Status) {
        this.status = Status;
    }

    public User castToUser(){
        
        User user = new User();

        user.setLogin(this.getLogin());
        user.setEmail(this.getEmail());
        user.setPassword(this.getPassword());
		user.setStatus(this.getStatus());

        return user;
    }

    protected EUser(){}
    
    public EUser(User user){
        this.login = user.getLogin();
        this.email = user.getEmail();
        this.password = user.getPassword();
		this.status = user.getStatus();
    }

}
