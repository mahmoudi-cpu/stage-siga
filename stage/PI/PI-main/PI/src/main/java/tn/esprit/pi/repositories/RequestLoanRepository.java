package tn.esprit.pi.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.pi.entities.RequestLoan;
import tn.esprit.pi.entities.StatLoan;

import java.util.List;

@Repository
public interface RequestLoanRepository extends JpaRepository<RequestLoan,Long> {
    List<RequestLoan> findByStatus(StatLoan status);
    List<RequestLoan> findAllByAmortizationIsNotNull();

/*
    List<RequestLoan> findByDatefinBefore(Date date);
  @Query("SELECT r FROM RequestLoan r WHERE r.loanAmnt LIKE %:keyword% OR r.nbrMonth LIKE %:keyword%")
    List<RequestLoan> findByKeyword(String keywords);


 */


}
