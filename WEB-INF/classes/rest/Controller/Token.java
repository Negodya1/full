package rest.Controller;

public class Token{

    private Payload payload;
    private String crypto;

    public Payload getPayload(){
        return this.payload;
    }

    public String getCrypto(){
        return this.crypto;
    }

    public void setPayload(Payload payload){
        this.payload = payload;
    }

    public void setCrypto(String crypto){
        this.crypto = crypto;
    }

}