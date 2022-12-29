package rest.Controller.Service.User;

import jakarta.ws.rs.Path;

import jakarta.ws.rs.POST;

import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;

import jakarta.ws.rs.core.Response;

import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbException;


import rest.Controller.Token.Token;
import rest.Controller.Token.TokenTools;

import rest.Model.DTO.User;
import rest.Model.User.IUserModel;
import jakarta.inject.Inject;
import rest.Builder.Built;

@Path("/users")
public class ServiceUser {

    @Inject @Built
    IUserModel model;

    @POST
    @Path("/auth")
    @Consumes("application/json")
    @Produces("application/json")
    public Response authUser(String userJson) {

        User user;
        Jsonb jsonb = JsonbBuilder.create();
        String resultJSON = jsonb.toJson("undefinedError");

        try{

            user = jsonb.fromJson(userJson, new User(){}.getClass().getGenericSuperclass());
            User userData = model.checkUser(user);

            
            if(userData == null){
                return Response.status(Response.Status.SERVICE_UNAVAILABLE).entity(jsonb.toJson("Unavailable DataBase Connection")).build();
            }

            if(userData.getLogin() != null){

                Token token = TokenTools.generateToken(userData);
                resultJSON = jsonb.toJson(token);

            }else{
                return Response.status(Response.Status.UNAUTHORIZED).entity(jsonb.toJson("UserNotFound")).build();
            }

        }catch (JsonbException e) {
            System.out.println(e);
            return Response.status(Response.Status.BAD_REQUEST).entity(jsonb.toJson(e.getMessage())).build();	             
        }
        catch (Exception e) {
            System.out.println(e);
            return Response.status(Response.Status.BAD_REQUEST).entity(jsonb.toJson(e.getMessage())).build();	             
        }    
        return Response.ok(resultJSON).build();
    }

    @POST
    @Path("/")
    @Consumes("application/json")
    @Produces("application/json")
    public Response createUser(String User){
        Jsonb jsonb = JsonbBuilder.create();             
        User newUser;
        String resultJSON = "undefinedError";
        try {  
            
            newUser = jsonb.fromJson(User,new User(){}.getClass().getGenericSuperclass());    
            
            Boolean userCreated = model.addUser(newUser);

            if(userCreated == null){
                return Response.status(Response.Status.SERVICE_UNAVAILABLE).entity(jsonb.toJson("Unavailable DataBase Connection")).build();
            }

            if(userCreated == false){
                return Response.status(Response.Status.UNAUTHORIZED).entity(jsonb.toJson("UserAlreadyExist")).build();
            }
            
            resultJSON = jsonb.toJson("userCreated");

        }
        catch (JsonbException e) {
        return Response.status(Response.Status.BAD_REQUEST).entity(jsonb.toJson(e.getMessage())).build();	             
        }
        catch (Exception e) {
        return Response.status(Response.Status.BAD_REQUEST).entity(jsonb.toJson(e.getMessage())).build();	             
        }    
        return Response.ok(jsonb.toJson(resultJSON)).build();  
    }

}
