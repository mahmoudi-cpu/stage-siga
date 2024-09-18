package tn.esprit.pi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.pi.entities.Amortization;


@Repository
public interface AmortizationRepository extends JpaRepository<Amortization,Long> {

    // List<Pret> findByDatefinBefore(Date date);
}
