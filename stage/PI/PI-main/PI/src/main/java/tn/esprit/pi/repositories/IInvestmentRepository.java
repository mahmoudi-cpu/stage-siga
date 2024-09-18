package tn.esprit.pi.repositories;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tn.esprit.pi.entities.Investment;
import tn.esprit.pi.entities.Project;

import java.util.List;
@Repository
public interface IInvestmentRepository extends JpaRepository<Investment,Integer> {
  List<Investment> findByProject(Project project);
  int countByProject(Project project);
  @Query("SELECT AVG(p.rating) FROM Project p")
  Float calculateAverageRating();
}
