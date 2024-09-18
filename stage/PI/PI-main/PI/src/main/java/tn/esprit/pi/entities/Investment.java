package tn.esprit.pi.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;


import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Investment implements Serializable {
  @Id
  @GeneratedValue(strategy= GenerationType.IDENTITY)
  int idInvestment;
  @NotNull(message = "Le nombre d'actions ne peut pas être nul")
  @Min(value = 1, message = "Le nombre d'actions doit être d'au moins 1")
  @Max(value = 80, message = "Le nombre d'actions ne peut pas dépasser 80")
  int nbr_action;
  @NotNull(message = "La date d'investissement ne peut pas être nulle")
  @Temporal(TemporalType.DATE)
  Date date_inevt;
  //Float income_by_day;
  @ManyToOne(cascade = CascadeType.ALL)
    @JsonIgnore
  Project project;
}
