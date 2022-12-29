package rest.Repository.Products;

import java.io.Serializable;
import jakarta.persistence.*;
import rest.Model.DTO.Product;

@Entity
@Table(name = "\"products\"")
public class EProduct  implements Serializable{

    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name = "\"id\"")
    private Integer id;

    @Column(name = "\"productname\"")
    private String name;

    @Column(name = "\"price\"")
    private Integer price;

    @Column(name = "\"description\"")
    private String description;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    protected EProduct(){}

    public EProduct(Product product){
        this.setName(product.getName());
        this.setPrice(product.getPrice());
        this.setDescription(product.getDescription());
    }
    
    public Product castToProduct(){
        Product product = new Product();

        product.setId(this.getId());
        product.setName(this.getName());
        product.setPrice(this.getPrice());
        product.setDescription(this.getDescription());

        return product;
    }
}
