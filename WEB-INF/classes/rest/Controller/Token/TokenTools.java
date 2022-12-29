package rest.Controller.Token;

import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbException;
import rest.Model.DTO.User;

public class TokenTools {

    public static Payload generatePayload(User user){
        Payload payload = new Payload();
        payload.setLogin(user.getLogin());
        payload.setEmail(user.getEmail());
        return payload;
    }


    public static Boolean verifyToken(Token token){
        
        Token checkToken = generateToken(token.getPayload());

        if(checkToken.getCrypto().equals(token.getCrypto())){
            return true;
        } 
        
        return false;

    }

    public static Token generateToken(Payload payload){
        Token token = new Token();
        token.setPayload(payload);

        try{
            Jsonb jsonb = JsonbBuilder.create();
            token.setCrypto(jsonb.toJson(payload));
        }catch(JsonbException e){}

        return token;
    }

    public static Token generateToken(User user){
        Token token = new Token();
        Payload payload = generatePayload(user);
        token.setPayload(payload);

        try{
            Jsonb jsonb = JsonbBuilder.create();
            token.setCrypto(jsonb.toJson(payload));
        }catch(JsonbException e){}

        return token;
    }
    
}
