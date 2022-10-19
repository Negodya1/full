package rest;

public class Product {
    private int id;
    private int price;
    private String description;
    private String name;

    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    
    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public static Product createProduct(int id, String name, int price, String description){
        Product newProduct = new Product();

        newProduct.setDescription(description);
        newProduct.setId(id);
        newProduct.setName(name);
        newProduct.setPrice(price);

        return newProduct;
    }
}