package tn.esprit.pi.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OfferLoan implements Serializable {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Long idOffer;
    String status ="AVAILABLE";// AVAILABLE or UNAVAILABLE

    @Enumerated(EnumType.STRING)
    LoanType typeLoan;

    @NotBlank
    @Temporal(TemporalType.DATE)
    //@DateTimeFormat(pattern = "dd/MM/yyyy")
    Date offrDate;
    @NotBlank(message = "the amount should be in decimal value")
    Long maxAmnt;
    @NotBlank(message = "the amount should be in decimal value and better than 0")
    Long minAmnt;
    @Min(value = 2, message = "the repayment periode should not be lower than 3 month")
    Long minRepaymentPer;
    Double tmm;
    @NotBlank(message = "the interest rate should be grater than the tmm ")
    @Min(value = 1, message = "The interest rate should not be negative")
    Float intRate;

//association:
    @JsonIgnore
    @OneToMany(mappedBy = "offerLoan", cascade = CascadeType.ALL)
    Set<RequestLoan> requestLoans;

    @ManyToOne
    User user;


}
