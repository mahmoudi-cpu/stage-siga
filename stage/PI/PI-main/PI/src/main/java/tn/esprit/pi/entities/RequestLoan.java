package tn.esprit.pi.entities;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.Date;

@Entity
@Getter
@Setter
@ToString
@Builder
@Table(name="request_loans")
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RequestLoan implements Serializable {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Long requestId;
    //@DateTimeFormat(pattern = "dd/MM/yyyy")
    @Temporal(TemporalType.DATE)//timestamp for the hours
    Date reqDate;
    @NotBlank
    @Min(value = 0, message = "The interest rate should not be negative")
    Float loanAmnt;
    @NotBlank
    @Min(value = 3, message = "the repayment periode should not be lower than 3 month")
    Long nbrMonth;
    @Min(value = 1, message = "the repayment periode should not be lower than 3 month")
    @NotBlank
    Long nbrYears;
//public class RequestLoan implements Serializable {
    //@Size(max = 92160, message = "PDF file size should not exceed 90KB")
    @Lob
    byte[] garantorFile;// PDF file
    String fileName;


    @Enumerated(EnumType.STRING)
    StatLoan status;
    @Enumerated(EnumType.STRING)
    typeAmort typeAmrt;

    //association
    @ManyToOne
    OfferLoan offerLoan;

    @OneToOne(cascade = CascadeType.ALL)//affectation
    Amortization amortization;
}


