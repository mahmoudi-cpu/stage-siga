package tn.esprit.pi.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Amortization {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Long idAmt;
    @NotBlank
    @Temporal(TemporalType.DATE)
    //@DateTimeFormat(pattern = "dd/MM/yyyy")
    Date date;
    Long periode;
    Long startAmount;
    Long intrest;
    Long amrt;
    Long annuity;
    Long frais;
    Long agio;

    @JsonIgnore
    @OneToOne(mappedBy = "amortization")
    RequestLoan requestloan;

    @OneToMany(mappedBy = "amortization" ,cascade = CascadeType.ALL)
    Set<AmortizationDetail> detailAmorts;

}