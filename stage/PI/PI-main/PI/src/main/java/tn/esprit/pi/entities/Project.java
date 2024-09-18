package tn.esprit.pi.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Project {
  @Id
  @GeneratedValue(strategy= GenerationType.IDENTITY)
  long idProject;
  @NotBlank(message = "Le nom ne peut pas être vide")
  @Column(unique = true) // Ensure uniqueness at the database level
  String nomProject;

  @Size(min = 50, message = "La description  doit superieur 150 caractères")
  String description;

  @NotNull(message = "Le montant d'investissement doit être supérieur à 0")
  @DecimalMin(value = "0", message = "Le montant d'investissement doit être supérieur à 0")
  float  amount_inv;


  float invest_value;
  float investNeed;
  float total_raising_investment = 0;
  float total_interest = 0;
  @NotBlank(message = "Le date ne peut pas être vide")
  @Temporal(TemporalType.DATE)
  Date date_debut;
  @NotBlank(message = "Le date ne peut pas être vide")
  @Temporal(TemporalType.DATE)
  Date date_fin;
  statusProject Status_project;
  Status_inv Status_Invest;
  CategoryProject CategoryProject;
  @Lob
  private byte[] Businessplan;
  private Integer rating = null;
  private String feedback = null;

  @OneToMany(mappedBy = "project")
  @JsonIgnore
  Set<Investment> investments;

  public Project(Long idProject) {
  }

  @PrePersist
  public void calculateInvestValues() {
    // Calculate invest_value (20% of amount_inv)
    this.invest_value = this.amount_inv * 0.20f;

    // Calculate invest_need (80% of amount_inv)
    this.investNeed = this.amount_inv * 0.80f;
  }
  // Custom validation to ensure date_fin is after date_debut
  @AssertTrue(message = "La date de fin doit être postérieure à la date de début")
  private boolean isValidDates() {
    if (date_debut == null || date_fin == null) {
      return true; // Return true if either date is null
    }
    return date_fin.after(date_debut);
  }
}
