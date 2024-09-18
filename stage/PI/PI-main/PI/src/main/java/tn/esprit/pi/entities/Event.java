    package tn.esprit.pi.entities;

    import com.fasterxml.jackson.annotation.JsonIgnore;
    import jakarta.persistence.*;
    import jakarta.validation.constraints.FutureOrPresent;
    import jakarta.validation.constraints.Min;
    import jakarta.validation.constraints.NotBlank;
    import jakarta.validation.constraints.NotNull;
    import lombok.*;
    import org.springframework.format.annotation.DateTimeFormat;

   import java.io.Serializable;
    import java.time.LocalDate;
    import java.util.HashSet;
    import java.util.List;
    import java.util.Set;

    @Getter
    @Setter
    @ToString
    @AllArgsConstructor
    @NoArgsConstructor
    @Entity
    public class Event implements Serializable {

        private static final long serialVersionUID = 1L;
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int idEvent;
        @NotNull
        @NotBlank
        private String nameEvent;
        @NotNull
        @NotBlank
        private String descriptionEvent;
        @NotNull
        @NotBlank
        private String domain;
        @NotNull
        @FutureOrPresent(message = "The event date must be today or in the future.")
        @DateTimeFormat(pattern = "yyyy-MM-dd")
        private LocalDate dateEvent;
        //@JsonIgnore
        private int likes;
       // @JsonIgnore
        private int dislikes;
        @NotBlank
        @NotNull(message = "Investment amount is required")
        @Min(value = 10000, message = "InvestNeeded amount must be at least 10000 Tunisian dinars")
        double investNeeded;

        @Enumerated(EnumType.STRING)
        private TypeEvent type;
        @OneToMany(mappedBy ="event" )
        @JsonIgnore
        private List<ShareHolder> shareHolders;
        @ManyToMany(cascade = CascadeType.ALL)
        @JoinTable(
                name = "event_user_set",
                joinColumns = @JoinColumn(name = "event_id"),
                inverseJoinColumns = @JoinColumn(name = "user_id")
        )
        @JsonIgnore
        private Set<User> userSet = new HashSet<>();
        @Enumerated(EnumType.STRING)
        private EventStatus eventStatus;




        public void addLike() {
            this.likes++;
        }

        public void addDislike() {
            this.dislikes++;
        }

        public void cancelEvent() {
            this.eventStatus = EventStatus.REPORTED;
        }

      /*  public List<ShareHolder> getShareholders() {
            return shareHolders;
        }

        public void setShareholders(List<ShareHolder> shareholders) {
            this.shareHolders = shareholders;
        }*/


       public int getIdEvent() {
            return idEvent;
        }
        @Override
        public String toString() {
            return "Event{" +
                    "id=" + idEvent +
                    ", nameEvent='" + nameEvent + '\'' +
                    // Ajoutez d'autres attributs ici
                    '}';
        }
        public void updateInvestNeeded(double investmentAmount) {
            this.investNeeded -= investmentAmount;
            if (this.investNeeded < 0) {
                throw new RuntimeException("Investment amount exceeds event balance.");
            }
        }}
