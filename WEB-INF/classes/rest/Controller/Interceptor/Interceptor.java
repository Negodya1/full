package rest.Controller.Interceptor;

import java.io.IOException;

import jakarta.ws.rs.ext.Provider;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;

import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;

import rest.Controller.Token.Token;
import rest.Controller.Token.TokenTools;

@Provider
@IdRequired
public class Interceptor implements ContainerRequestFilter {
    
    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        
        String tokenHeaderValue = requestContext.getHeaderString("User-token");
        Jsonb jsonb = JsonbBuilder.create();
        
        if(tokenHeaderValue == null) requestContext.abortWith(
            Response.status(Response.Status.UNAUTHORIZED)
            .type(MediaType.APPLICATION_JSON)
            .entity(jsonb.toJson("Authorization Token Required"))
            .build()
        );
        
        Token token = jsonb.fromJson(tokenHeaderValue, new Token(){}.getClass().getGenericSuperclass());;
        
        if(!TokenTools.verifyToken(token)) requestContext.abortWith(
            Response.status(Response.Status.UNAUTHORIZED)
            .type(MediaType.APPLICATION_JSON)
            .entity(jsonb.toJson("Authorization Token Expired"))
            .build()
        );

    }
}
