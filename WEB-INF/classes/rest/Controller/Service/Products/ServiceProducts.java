package rest.Controller.Service.Products;

import jakarta.ws.rs.Path;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.DELETE;

import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.Consumes;

import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;

import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbException;

import java.util.ArrayList;

import rest.Builder.Built;
import rest.Controller.Interceptor.IdRequired;
import rest.Model.DTO.Product;
import rest.Model.Products.IProductsModel;
import jakarta.inject.Inject;

@Path("/products")
public class ServiceProducts {

    @Context
    ContainerRequestContext requestContext;

    @Inject @Built
    IProductsModel model;

    @GET
    @IdRequired
    @Path("/list")
    @Produces("application/json")
    public Response getProductList(){

        Jsonb jsonb = JsonbBuilder.create();
        String resultJSON = jsonb.toJson("undefinedError");

        try{
            
            resultJSON = jsonb.toJson(model.getProductsList());
            if(resultJSON == null) return Response.status(Response.Status.SERVICE_UNAVAILABLE).entity(jsonb.toJson("Unavailable DataBase Connection")).build();

        }catch (JsonbException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();	             
        }
        catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();	             
        }    
        return Response.ok(resultJSON).build(); 

    }

    @POST
    @IdRequired
    @Path("/")
    @Consumes("application/json")
    @Produces("application/json")
    public Response addProduct(@HeaderParam("User-token") String userToken, String newProduct){

        Product product;
        Jsonb jsonb = JsonbBuilder.create();
        String resultJSON = jsonb.toJson("undefinedError");

        try{

            product = jsonb.fromJson(newProduct, new Product(){}.getClass().getGenericSuperclass());
        
            Integer row = model.addRow(product);
            if(row == 1) resultJSON = jsonb.toJson("row_added");
            else{
                return Response.status(Response.Status.SERVICE_UNAVAILABLE).entity(jsonb.toJson("Unavailable DataBase Connection")).build();
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
    @IdRequired
    @Path("/")
    @Produces("application/json")
    public Response deleteProducts(@HeaderParam("To_Delete_IDs") String toDeleteJSON){

        ArrayList<Integer> toDelete;
        Jsonb jsonb = JsonbBuilder.create();
        String resultJSON = jsonb.toJson("undefinedError");
        try{

            toDelete = jsonb.fromJson(toDeleteJSON, new ArrayList<Integer>(){}.getClass().getGenericSuperclass());
            
            if(toDelete == null) return Response.status(Response.Status.NOT_ACCEPTABLE).entity(jsonb.toJson("NoData")).build();

            Integer rows = model.deleteRows(toDelete);

            if(rows == null) return Response.status(Response.Status.SERVICE_UNAVAILABLE).entity(jsonb.toJson("Unavailable DataBase Connection")).build();
            if(rows == 0) return Response.status(Response.Status.NO_CONTENT).entity(jsonb.toJson("Nothing Deleted")).build();

            resultJSON = jsonb.toJson(rows);

        }catch (JsonbException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(jsonb.toJson(e.getMessage())).build();	             
        }
        catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(jsonb.toJson(e.getMessage())).build();	             
        }    
        return Response.ok(resultJSON).build(); 
    }
}
