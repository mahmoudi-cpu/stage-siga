package tn.esprit.pi.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AmortizationDetail {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Long idDetail;
    Long periode;
    @Temporal(TemporalType.DATE)
   // @DateTimeFormat(pattern = "dd/MM/yyyy")
    Date date;
    Long startAmount;
    Long intrest;
    Long amrt;
    Long annuity;
    Long frais;
    Long agio;

    @ManyToOne
    Amortization amortization;

}
