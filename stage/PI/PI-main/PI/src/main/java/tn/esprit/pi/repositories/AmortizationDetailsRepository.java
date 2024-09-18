package tn.esprit.pi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.pi.entities.AmortizationDetail;


@Repository
public interface AmortizationDetailsRepository extends JpaRepository<AmortizationDetail,Long> {

   }
