package rest;

public class Token {
	static String saul = "";
	
	private String payload;
	private String cryptoXBOCT;
	
	public Token() {
		payload = "";
		cryptoXBOCT = "";
	}
	
	public String getPayload() {
		return payload;
	}
	public String getCrypto() {
		return cryptoXBOCT;
	}
	
	public void setPayload(String pl) {
		payload = pl;
	}
	public void setCrypto(String cr) {
		cryptoXBOCT = cr;
	}
	
	public static Token generateToken(String login) {
		Token result = new Token();
		
		result.setPayload(login);
		result.setCrypto(login + Token.saul);
		
		return result;
	}
	
	public static boolean verifyToken(Token token) {
		Token newToken = Token.generateToken(token.getPayload());
		
		if (newToken.getCrypto().equals(token.getCrypto())) return true;
		
		return false;
	}
}