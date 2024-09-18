package tn.esprit.pi.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.pi.entities.Project;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {


  List<Project> findAllByOrderByInvestNeedAsc();
  long count();
  List<Project> findByNomProjectContainingIgnoreCase(String nom);
  @Query("SELECT AVG(p.rating) FROM Project p")
  Float calculateAverageRating();
}
