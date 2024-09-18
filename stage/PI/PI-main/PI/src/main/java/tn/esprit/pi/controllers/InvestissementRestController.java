package tn.esprit.pi.controllers;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.entities.Investment;
import tn.esprit.pi.entities.Project;
import tn.esprit.pi.entities.User;
import tn.esprit.pi.services.InvestmentService;
import tn.esprit.pi.services.UserService;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/Investment")
@SecurityRequirement(name = "bearerAuth")
public class InvestissementRestController {
    private InvestmentService investmentService;
  UserService userService;

  // http://localhost:8089/pi/investment/retrieve-all-investments
  @PreAuthorize("hasAnyAuthority('ADMIN')")
  @GetMapping("/retrieve-all-investments")
  public List<Investment> getInvestments() {
    List<Investment> listInvestments = investmentService.retiveAllInvestments();
    return listInvestments;
  }
  // http://localhost:8089/pi/investment/retrieve-investment/8
  @PreAuthorize("hasAnyAuthority('ADMIN', 'INVESTOR')")
  @GetMapping("/retrieve-investment/{investment-id}")
  public Investment retrieveInvestment(@PathVariable("investment-id") Integer investmentId) {
    Investment investment = investmentService.retriveInvestment(investmentId);
    return investment;}
 /* @PreAuthorize("hasAnyAuthority('INVESTOR')")
  @PostMapping("/add")
  Investment AddInvestissement(@RequestBody Investment investment){
    return investmentService.AddInvestissement(investment);
  }*/
  // http://localhost:8089/pi/investment/remove-investment/{investment-id}
  @DeleteMapping("/remove-investment/{investment-id}")
  public void removeInvestment(@PathVariable("investment-id") Integer invId) {
    investmentService.removeInvestment(invId);
  }
  // http://localhost:8089/pi/investment/modify-investment
 /* @PutMapping("/modify-investment")
  public Investment modifyInvestment(@RequestBody Investment i) {
    Investment investment = investmentService.modifyInvestment(i);
    return investment;
  }*/


 /* @PutMapping("/affecter-investment-a-idProject/{investment-id}/{idProject}")
  public void affecterInvestmentAidProject(@PathVariable("investment-id") Integer idInvestment,
                                           @PathVariable("idProject") Long idProject) {
    investmentService.assignInvestmentToProject(idInvestment, idProject);
  }

  @PutMapping("/desaffecter-investment-a-dProject/{investment-id}")
  public void desaffecterInvestmentAidProject(@PathVariable("investment-id") Integer idInvestment){
    investmentService.dessignerInvestmentToProject(idInvestment);
  }*/
  @PreAuthorize("hasAnyAuthority('INVESTOR')")
  @PostMapping("/investments")
  public void invest(@RequestParam("idProject") Long idProject, @RequestBody Investment investment) {
    investment.setProject(new Project(idProject)); // Set the project using the provided projectId
    investmentService.invest(idProject, investment.getNbr_action());
  }

  @PreAuthorize("hasAnyAuthority('ADMIN')")
  @GetMapping("/most-investment")
  public ResponseEntity<User> findInvestorWithMostInvestment() {
    User investorWithMostInvestment = investmentService.findInvestorWithMostInvestment();
    if (investorWithMostInvestment == null) {
      return ResponseEntity.notFound().build();
    } else {
      return ResponseEntity.ok(investorWithMostInvestment);
    }
  }

}

