package rest.Controller.Service.Root;

import jakarta.ws.rs.Path;

import jakarta.ws.rs.GET;

import jakarta.ws.rs.Produces;


@Path("/")
public class ServiceMain {

  @GET
  @Path("/")
  @Produces("text/plain")
  public String ping() {   
    return "OK";
  } 

}