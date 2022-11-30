package rest.Controller;

import jakarta.ws.rs.Path;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.DELETE;

import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;

import jakarta.ws.rs.HeaderParam;

import jakarta.ws.rs.core.Response;

import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbException;

import java.util.ArrayList;

import rest.Model.Product;
import rest.Model.IModel;
import jakarta.inject.Inject;

@Path("/products")
public class ServiceProducts {

    @Inject
    IModel model;

    @GET
    @Path("/list")
    @Produces("application/json")
    public Response getProductList(@HeaderParam("User-token") String userToken){

        Token token;
        Jsonb jsonb = JsonbBuilder.create();
        String resultJSON = jsonb.toJson("undefinedError");

        try{
            
            try{
                token = jsonb.fromJson(userToken, new Token(){}.getClass().getGenericSuperclass());
                if(token == null) return Response.status(Response.Status.UNAUTHORIZED).entity("ExpiredToken").build();
            }catch(JsonbException e){
                return Response.status(Response.Status.UNAUTHORIZED).entity("ExpiredToken").build();
            }
            

            if(TokenTools.verifyToken(token)){
                resultJSON = jsonb.toJson(model.getProductsList());

                if(resultJSON == null) return Response.status(Response.Status.SERVICE_UNAVAILABLE).entity("Unavailable DataBase Connection").build();

            }else{
                return Response.status(Response.Status.UNAUTHORIZED).entity("ExpiredToken").build();
            }

        }catch (JsonbException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();	             
        }
        catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();	             
        }    
        return Response.ok(resultJSON).build(); 
  }

    @POST
    @Path("/")
    @Consumes("application/json")
    @Produces("application/json")
    public Response addProduct(@HeaderParam("User-token") String userToken, String newProduct){
        Token token;
        Product product;
        Jsonb jsonb = JsonbBuilder.create();
        String resultJSON = jsonb.toJson("undefinedError");
        try{

            try{
                token = jsonb.fromJson(userToken, new Token(){}.getClass().getGenericSuperclass());
                if(token == null) return Response.status(Response.Status.UNAUTHORIZED).entity("ExpiredToken").build();
            }catch(JsonbException e){
                return Response.status(Response.Status.UNAUTHORIZED).entity("ExpiredToken").build();
            }
            product = jsonb.fromJson(newProduct, new Product(){}.getClass().getGenericSuperclass());
        
            if(TokenTools.verifyToken(token)){
        
                int row = model.addRow(product);
                if(row == 1) resultJSON = jsonb.toJson("row_added");
                else{
                    return Response.status(Response.Status.SERVICE_UNAVAILABLE).entity("Unavailable DataBase Connection").build();
                }
            
            }else{
                return Response.status(Response.Status.UNAUTHORIZED).entity("ExpiredToken").build();
            }

        }catch (JsonbException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();	             
        }
        catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();	             
        }    
        return Response.ok(resultJSON).build(); 
    }

    @DELETE
    @Path("/")
    @Produces("application/json")
    public Response deleteProducts(@HeaderParam("User-token") String userToken, @HeaderParam("To_Delete_IDs") String toDeleteJSON){
        Token token;
        ArrayList<Integer> toDelete;
        Jsonb jsonb = JsonbBuilder.create();
        String resultJSON = jsonb.toJson("undefinedError");
        try{

            try{
                token = jsonb.fromJson(userToken, new Token(){}.getClass().getGenericSuperclass());
                if(token == null) return Response.status(Response.Status.UNAUTHORIZED).entity("ExpiredToken").build();
            }catch(JsonbException e){
                return Response.status(Response.Status.UNAUTHORIZED).entity("ExpiredToken").build();
            }
            toDelete = jsonb.fromJson(toDeleteJSON, new ArrayList<Integer>(){}.getClass().getGenericSuperclass());
            
            if(toDelete == null) return Response.status(Response.Status.NOT_ACCEPTABLE).entity("NoData").build();

        if(TokenTools.verifyToken(token)){

            Integer rows = model.deleteRows(toDelete);

            if(rows == null) return Response.status(Response.Status.SERVICE_UNAVAILABLE).entity("Unavailable DataBase Connection").build();
            if(rows == 0) return Response.status(Response.Status.NO_CONTENT).entity("Nothing Deleted").build();

            resultJSON = jsonb.toJson(rows);

        }else{
            return Response.status(Response.Status.UNAUTHORIZED).entity("ExpiredToken").build();
        }

        }catch (JsonbException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();	             
        }
        catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();	             
        }    
        return Response.ok(resultJSON).build(); 
    }
}
